import { onMount, onCleanup, createMemo, on } from 'solid-js'
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
    let el: PlotlyHTMLElementWithListener | null = null
    let resizeHandler: (() => void) | null = null
    const handlers: Partial<Record<PlotlyHTMLElementEventName, EventHandler>> = {}
    const data = () => props.data
    const layout = () => props.layout
    const config = () => props.config
    const frames = () => props.frames
    const revision = () => props.revision

    const attachUpdateEvents = () => {
      if (!el || typeof el.on !== 'function') return
      updateEvents.forEach(updateEvent => {
        el?.on(updateEvent as PlotlyBasicEvent, () => handleUpdate())
      })
    }

    const removeUpdateEvents = () => {
      if (!el || typeof el.removeListener !== 'function') return
      updateEvents.forEach(updateEvent => {
        el?.removeListener(updateEvent as PlotlyBasicEvent, () => handleUpdate())
      })
    }

    const handleUpdate = () => {
      figureCallback(props.onUpdate)
    }

    const figureCallback = (callback?: EventHandler) => {
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
      handlers[eventName] = handler
      if (isBasicEvent(eventName)) {
        el?.on(eventName, () => handler(getCurrentFigure(), el!))
      }
    }

    const removeEventHandler = (eventName: PlotlyHTMLElementEventName) => {
      const handler = handlers[eventName]
      if (handler && isBasicEvent(eventName)) {
        el?.removeListener(eventName, () => handler(getCurrentFigure(), el!))
        delete handlers[eventName]
      }
    }

    // Type guard to check if an event is a basic event
    const isBasicEvent = (eventName: PlotlyHTMLElementEventName): eventName is PlotlyBasicEvent => {
      return updateEvents.includes(eventName)
    }

    const getCurrentFigure = (): PlotlyFigure => ({
      data: el?.data as Partial<PlotData>[],
      layout: el?.layout ?? {},
      frames: el?._transitionData?._frames,
    })

    const updatePlotly = async (
      shouldInvokeResizeHandler: boolean,
      callback?: EventHandler,
      shouldAttachUpdateEvents: boolean = false,
    ) => {
      try {
        await new Promise(resolve => setTimeout(resolve, 0))

        if (!el) {
          throw new Error('Missing element reference')
        }

        await Plotly.react(el, props.data, props.layout || {}, props.config)

        syncWindowResize(shouldInvokeResizeHandler)
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

    onMount(() => {
      // console.log('solid-plotly on mount:', props.data)
      updatePlotly(true, props.onInitialized, true)
    })

    createMemo(
      on(
        data,
        () => {
          // console.log('solid-plotly memo data:', props.data)
          updatePlotly(false, props.onUpdate, false)
        },
        { defer: true },
      ),
    )
    createMemo(
      on(
        layout,
        () => {
          // console.log('solid-plotly memo layout:', props.layout)
          updatePlotly(false, props.onUpdate, false)
        },
        { defer: true },
      ),
    )
    createMemo(
      on(
        config,
        () => {
          // console.log('solid-plotly memo config:', props.config)
          updatePlotly(false, props.onUpdate, false)
        },
        { defer: true },
      ),
    )
    createMemo(
      on(
        frames,
        () => {
          // console.log('solid-plotly memo frames:', props.frames)
          updatePlotly(false, props.onUpdate, false)
        },
        { defer: true },
      ),
    )
    createMemo(
      on(
        revision,
        () => {
          // console.log('solid-plotly memo revision:', props.revision)
          updatePlotly(false, props.onUpdate, false)
        },
        { defer: true },
      ),
    )

    onCleanup(() => {
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
          el = elRef as unknown as PlotlyHTMLElementWithListener
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
