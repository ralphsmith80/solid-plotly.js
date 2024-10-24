/* eslint-disable no-console */
import type { PlotlyFigure } from '@ralphsmith80/solid-plotly.js'
import Plot from '@ralphsmith80/solid-plotly.js'
import type { PlotType } from 'plotly.js'
import { createSignal } from 'solid-js'

export const Chart = () => {
  const [data, setData] = createSignal<Partial<Plotly.PlotData>[]>([
    {
      x: [1, 2, 3, 4],
      y: [10, 15, 13, 17],
      type: 'scatter' as PlotType,
      mode: 'lines+markers',
      marker: { color: 'red' },
    },
  ])

  const [layout, setLayout] = createSignal<PlotlyFigure['layout']>({
    title: 'A Simple Plot',
  })

  const handleInitialized = (figure: PlotlyFigure) => {
    console.log('Plotly chart initialized:', figure)
  }

  const handleUpdate = (figure: PlotlyFigure) => {
    console.log('Plotly chart updated:', figure)
  }

  const handleError = (error: Error) => {
    console.error('Plotly chart error:', error)
  }

  const handlePurge = () => {
    console.log('Plotly chart purged.')
  }

  setTimeout(() => {
    setLayout({ title: 'A Simple Plot Changed' })
    setData([
      {
        x: [1, 2, 3, 4],
        y: [15, 10, 17, 13],
        type: 'scatter' as PlotType,
        mode: 'lines+markers',
        marker: { color: 'blue' },
      },
    ])
  }, 1000)

  return (
    <Plot
      data={data()}
      layout={layout()}
      onInitialized={handleInitialized}
      onUpdate={handleUpdate}
      onPurge={handlePurge}
      onError={handleError}
      useResizeHandler={true}
      style={{ width: '90%', height: '100%' }}
      class="my-plotly-chart"
      divId="my-plotly-div"
    />
  )
}

export default Chart
