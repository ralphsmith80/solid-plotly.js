import type { Component } from 'solid-js'
import { Chart } from './Chart'
import { CustomBundleChart } from './CustomBundleChart'
import { BoxChart, HistogramChart } from './CustomThemeChart'
import styles from './App.module.css'

const App: Component = () => {
  return (
    <div class={styles.App}>
      <header class={styles.header}>
        <h1>SolidJS Plotly Example</h1>
        <Chart />
        <h1>Custom Plotly Bundle Example</h1>
        <CustomBundleChart />
        <h1>Custom Theme Example</h1>
        <div style={{ display: 'flex', 'flex-direction': 'column', gap: '1rem' }}>
          <BoxChart />
          <HistogramChart />
        </div>
      </header>
    </div>
  )
}

export default App
