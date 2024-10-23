/* eslint-disable no-console */
import { createSignal } from 'solid-js'
import Plotly from 'plotly.js-dist-min'
import { plotComponentFactory } from '@ralphsmith80/solid-plotly.js'
import type { PlotlyFigure } from '@ralphsmith80/solid-plotly.js'
import type { PlotType } from 'plotly.js-dist-min'

// Create the Plotly component using the factory
const CustomPlot = plotComponentFactory(Plotly)

export const CustomBundleChart = () => {
  const [data] = createSignal<Partial<Plotly.PlotData>[]>([
    {
      x: [1, 2, 3, 4],
      y: [10, 15, 13, 17],
      type: 'scatter' as PlotType,
      mode: 'lines+markers',
      marker: { color: 'red' },
    },
  ])

  const [layout] = createSignal<PlotlyFigure['layout']>({
    title: 'A Simple Plot',
  })

  const handleInitialized = (figure: PlotlyFigure) => {
    console.log('Custom Plotly chart initialized:', figure)
  }

  const handleUpdate = (figure: PlotlyFigure) => {
    console.log('Custom Plotly chart updated:', figure)
  }

  const handleError = (error: Error) => {
    console.error('Custom Plotly chart error:', error)
  }

  const handlePurge = () => {
    console.log('Custom Plotly chart purged.')
  }

  return (
    <CustomPlot
      data={data()}
      layout={layout()}
      onInitialized={handleInitialized}
      onUpdate={handleUpdate}
      onPurge={handlePurge}
      onError={handleError}
      useResizeHandler={true}
      style={{ width: '90%', height: '100%' }}
      class="custom-plotly-instance-chart"
      divId="custom-plotly-instance-div"
    />
  )
}

export default CustomBundleChart
