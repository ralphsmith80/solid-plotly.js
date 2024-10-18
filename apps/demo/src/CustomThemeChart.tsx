import { createMemo } from 'solid-js'
import Plot from 'solid-plotly.js'
import { Layout } from 'plotly.js'

import type { Component } from 'solid-js'
import type { PlotType } from 'plotly.js'

export const darkTheme: Partial<Layout> = {
  paper_bgcolor: '#303030',
  plot_bgcolor: '#303030',
  font: {
    color: '#e0e0e0',
  },
  title: {
    font: {
      color: '#ffffff',
    },
  },
  xaxis: {
    gridcolor: '#505050',
    zerolinecolor: '#707070',
  },
  yaxis: {
    gridcolor: '#505050',
    zerolinecolor: '#707070',
  },
  legend: {
    bgcolor: 'rgba(0,0,0,0)',
    font: {
      color: '#e0e0e0',
    },
  },
}

// This is just a wrapper around layout to simplify applying the dark theme to all layouts
export const createLayout = (title?: string): Partial<Plotly.Layout> => {
  const layout = structuredClone(darkTheme) // IMPORTANT!: Deep clone darkTheme to avoid plotly.js errors because of shared object mutation
  layout.title =
    typeof layout.title === 'object' ? { ...layout.title, text: title } : { text: title }
  return layout
}

export const BoxChart: Component = () => {
  // Memoize plotData and layout to optimize performance
  const plotData = createMemo<Partial<Plotly.PlotData>[]>(() => [
    {
      y: Array.from({ length: 100 }, () => Math.random() * 100),
      type: 'box' as PlotType,
      name: 'Box Chart',
      marker: { color: '#bc80bd' },
    },
  ])

  const layout = createMemo(() => createLayout())

  return (
    <Plot
      data={plotData()}
      layout={layout()}
      useResizeHandler={true}
      config={{ displayModeBar: false }}
    />
  )
}

export const HistogramChart: Component = () => {
  // Memoize plotData and layout to optimize performance
  const plotData = createMemo<Partial<Plotly.PlotData>[]>(() => [
    {
      x: Array.from({ length: 100 }, () => Math.random() * 100),
      type: 'histogram' as PlotType,
      name: 'Histogram Chart',
      marker: { color: '#bc80bd' },
    },
  ])

  const layout = createMemo(() => createLayout())

  return (
    <Plot
      data={plotData()}
      layout={layout()}
      useResizeHandler={true}
      config={{ displayModeBar: false }}
    />
  )
}

export default { BoxChart, HistogramChart }
