import PlotlyInstance from 'plotly.js'
import { createEffect, createSignal, onCleanup, onMount } from 'solid-js'

import type { PlotData } from 'plotly.js'
import type { JSX } from 'solid-js'
import type {
  EventHandler,
  PlotlyBasicEvent,
  PlotlyComponentProps,
  PlotlyEventHandlers,
  PlotlyFigure,
  PlotlyHTMLElementEventName,
  PlotlyHTMLElementWithListener,
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

    // Type guard to check if an event is a basic event
    const isBasicEvent = (eventName: PlotlyHTMLElementEventName): eventName is PlotlyBasicEvent => {
      return updateEvents.includes(eventName)
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

    const initUpdateEvents = (el: PlotlyHTMLElementWithListener) => {
      if (typeof el.on !== 'function') return

      const handleUpdate = () => figureCallback(props.onUpdate)

      updateEvents.forEach(updateEvent => {
        el.on(updateEvent as PlotlyBasicEvent, handleUpdate)
      })

      onCleanup(() => {
        updateEvents.forEach(updateEvent => {
          el.removeListener(updateEvent as PlotlyBasicEvent, handleUpdate)
        })
      })
    }

    const initEventHandlers = (el: PlotlyHTMLElementWithListener) => {
      Object.entries(eventNameMapping).forEach(([propName, plotlyEventName]) => {
        createEffect(() => {
          const handler = props[propName as keyof PlotlyEventHandlers]

          if (handler && isBasicEvent(plotlyEventName)) {
            const handle = () => handler(getCurrentFigure(), el)
            el.on(plotlyEventName, handle)
            onCleanup(() => el?.removeListener(plotlyEventName, handle))
          }
        })
      })
    }

    const getCurrentFigure = (): PlotlyFigure => {
      const el = plotEl()
      return {
        data: el?.data as Partial<PlotData>[],
        layout: el?.layout ?? {},
        frames: el?._transitionData?._frames,
      }
    }

    const updatePlotly = async (callback?: EventHandler) => {
      try {
        const el = plotEl()
        if (!el) {
          throw new Error('Missing element reference')
        }

        await Plotly.react(el, props.data, props.layout || {}, props.config)

        figureCallback(callback)
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
      const el = plotEl()!

      initEventHandlers(el)
      initUpdateEvents(el)
      updatePlotly(props.onInitialized)

      if (isBrowser && props.useResizeHandler) {
        const resizeHandler = () => el && Plotly.Plots.resize(el)
        window.addEventListener('resize', resizeHandler)
        onCleanup(() => window.removeEventListener('resize', resizeHandler))
      }

      onCleanup(() => {
        figureCallback(props.onPurge)
        Plotly.purge(el)
      })
    })

    createEffect(() => updatePlotly(props.onUpdate), { defer: true })

    return (
      <div
        id={props.divId}
        style={props.style}
        ref={el => setPlotEl(el as unknown as PlotlyHTMLElementWithListener)}
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
