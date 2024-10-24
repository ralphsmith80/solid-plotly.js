import { onMount, onCleanup, createMemo, createSignal, on } from 'solid-js'
import PlotlyInstance from 'plotly.js'

import type { JSX } from 'solid-js'
import type { PlotData } from 'plotly.js'
import type {
  EventHandler,
  PlotlyBasicEvent,
  PlotlyComponentProps,
  PlotlyEventHandlers,
  PlotlyHTMLElementWithListener,
  PlotlyFigure,
  PlotlyHTMLElementEventName,
} from './types'

// Update event mapping to use correct Plotly event types
const eventNameMapping: Record<keyof PlotlyEventHandlers, PlotlyHTMLElementEventName> = {
  onRedraw: 'plotly_redraw',
  onAfterExport: 'plotly_afterexport',
  onAfterPlot: 'plotly_afterplot',
  onAnimated: 'plotly_animated',
  onAnimationInterrupted: 'plotly_animationinterrupted',
  onAutoSize: 'plotly_autosize',
  onBeforeExport: 'plotly_beforeexport',
  onDeselect: 'plotly_deselect',
  onDoubleClick: 'plotly_doubleclick',
  onFramework: 'plotly_framework',
  onTransitioning: 'plotly_transitioning',
  onTransitionInterrupted: 'plotly_transitioninterrupted',
  onClick: 'plotly_click',
  onHover: 'plotly_hover',
  onUnhover: 'plotly_unhover',
  onSelected: 'plotly_selected',
  onSelecting: 'plotly_selecting',
  onRelayout: 'plotly_relayout',
  onRelayouting: 'plotly_relayouting',
  onRestyle: 'plotly_restyle',
  onLegendClick: 'plotly_legendclick',
  onLegendDoubleClick: 'plotly_legenddoubleclick',
  onSliderChange: 'plotly_sliderchange',
  onSliderEnd: 'plotly_sliderend',
  onSliderStart: 'plotly_sliderstart',
  onAnimatingFrame: 'plotly_animatingframe',
  onClickAnnotation: 'plotly_clickannotation',
  onSunburstClick: 'plotly_sunburstclick',
}

const updateEvents: PlotlyHTMLElementEventName[] = [
  'plotly_restyle',
  'plotly_redraw',
  'plotly_relayout',
  'plotly_relayouting',
  'plotly_doubleclick',
  'plotly_animated',
  'plotly_sunburstclick',
]

const isBrowser = typeof window !== 'undefined'

export default function plotComponentFactory(Plotly: typeof PlotlyInstance) {
  const PlotlyComponent = (props: PlotlyComponentProps): JSX.Element => {
    const [plotEl, setPlotEl] = createSignal<PlotlyHTMLElementWithListener | null>(null)
    let resizeHandler: (() => void) | null = null
    const handlers: Partial<Record<PlotlyHTMLElementEventName, EventHandler>> = {}
    const data = () => props.data
    const layout = () => props.layout
    const config = () => props.config
    const frames = () => props.frames
    const revision = () => props.revision

    const attachUpdateEvents = () => {
      const el = plotEl()
      if (!el || typeof el.on !== 'function') return
      updateEvents.forEach(updateEvent => {
        el.on(updateEvent as PlotlyBasicEvent, handleUpdate)
      })
    }

    const removeUpdateEvents = () => {
      const el = plotEl()
      if (!el || typeof el.removeListener !== 'function') return
      updateEvents.forEach(updateEvent => {
        el.removeListener(updateEvent as PlotlyBasicEvent, handleUpdate)
      })
    }

    const handleUpdate = () => {
      figureCallback(props.onUpdate)
    }

    const figureCallback = (callback?: EventHandler) => {
      const el = plotEl()
      if (typeof callback === 'function' && el) {
        const figure: PlotlyFigure = {
          data: el.data as Partial<PlotData>[],
          layout: el.layout,
          frames: el._transitionData ? el._transitionData._frames : undefined,
        }
        callback(figure, el)
      }
    }

    const syncWindowResize = (invoke: boolean) => {
      const el = plotEl()

      if (!isBrowser) return

      if (props.useResizeHandler && !resizeHandler) {
        resizeHandler = () => el && Plotly.Plots.resize(el)
        window.addEventListener('resize', resizeHandler)
        if (invoke) {
          resizeHandler()
        }
      } else if (!props.useResizeHandler && resizeHandler) {
        window.removeEventListener('resize', resizeHandler)
        resizeHandler = null
      }
    }

    const syncEventHandlers = () => {
      Object.entries(eventNameMapping).forEach(([propName, plotlyEventName]) => {
        const handler = props[propName as keyof PlotlyEventHandlers]
        const existingHandler = handlers[plotlyEventName]

        if (handler && !existingHandler) {
          addEventHandler(plotlyEventName, handler)
        } else if (!handler && existingHandler) {
          removeEventHandler(plotlyEventName)
        } else if (handler && existingHandler && handler !== existingHandler) {
          removeEventHandler(plotlyEventName)
          addEventHandler(plotlyEventName, handler)
        }
      })
    }

    const addEventHandler = (eventName: PlotlyHTMLElementEventName, handler: EventHandler) => {
      const el = plotEl()
      handlers[eventName] = handler
      if (isBasicEvent(eventName)) {
        el?.on(eventName, () => handler(getCurrentFigure(), el))
      }
    }

    const removeEventHandler = (eventName: PlotlyHTMLElementEventName) => {
      const el = plotEl()
      const handler = handlers[eventName]
      if (handler && isBasicEvent(eventName)) {
        el?.removeListener(eventName, () => handler(getCurrentFigure(), el))
        delete handlers[eventName]
      }
    }

    // Type guard to check if an event is a basic event
    const isBasicEvent = (eventName: PlotlyHTMLElementEventName): eventName is PlotlyBasicEvent => {
      return updateEvents.includes(eventName)
    }

    const getCurrentFigure = (): PlotlyFigure => {
      const el = plotEl()
      return {
        data: el?.data as Partial<PlotData>[],
        layout: el?.layout ?? {},
        frames: el?._transitionData?._frames,
      }
    }

    const updatePlotly = async (
      callback?: EventHandler,
      shouldAttachUpdateEvents: boolean = false,
    ) => {
      try {
        const el = plotEl()
        if (!el) {
          throw new Error('Missing element reference')
        }

        await Plotly.react(el, props.data, props.layout || {}, props.config)

        syncEventHandlers()
        figureCallback(callback)

        if (shouldAttachUpdateEvents) {
          attachUpdateEvents()
        }
      } catch (err) {
        if (props.onError && err instanceof Error) {
          props.onError(err)
        } else {
          // eslint-disable-next-line no-console
          console.error('PlotlyComponent error:', err)
        }
      }
    }

    const retryUpdatePlotly = () => {
      const el = plotEl()
      if (el) {
        updatePlotly(props.onInitialized, true)
        syncWindowResize(true)
      } else {
        setTimeout(retryUpdatePlotly, 0) // Retry after 1 tick
      }
    }

    onMount(() => {
      // console.log('solid-plotly on mount:', props.data)
      retryUpdatePlotly()
    })

    // INFO: This would be an alternative to using onMount with a retryUpdatePlotly function however,
    //  it doesn't work as expected because when running the production app locally using a linked file
    // createEffect(() => {
    //   console.log('solid-plotly effect:')
    //   const el = plotEl()
    //   if (el) {
    //     console.log('solid-plotly effect: updatePlotly')
    //     updatePlotly(props.onInitialized, true)
    //   }
    // })

    createMemo(
      on(
        [data, layout, config, frames, revision],
        () => {
          // console.log('solid-plotly memo [data, layout, config, frames, revision]:', [
          //   props.data,
          //   props.layout,
          //   props.config,
          //   props.frames,
          //   props.revision,
          // ])
          updatePlotly(props.onUpdate, false)
        },
        { defer: true },
      ),
    )

    onCleanup(() => {
      const el = plotEl()
      figureCallback(props.onPurge)

      if (resizeHandler && isBrowser) {
        window.removeEventListener('resize', resizeHandler)
        resizeHandler = null
      }

      removeUpdateEvents()

      if (el) {
        Plotly.purge(el)
      }
    })

    return (
      <div
        id={props.divId}
        style={props.style}
        ref={elRef => {
          // console.log('solid-plotly ref:', elRef)
          setPlotEl(elRef as unknown as PlotlyHTMLElementWithListener)
        }}
        class={props.class}
      />
    )
  }

  PlotlyComponent.defaultProps = {
    useResizeHandler: false,
    data: [],
    style: { position: 'relative', display: 'inline-block' } as const,
  }

  return PlotlyComponent
}
