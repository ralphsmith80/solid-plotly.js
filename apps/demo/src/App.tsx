import type { Component } from 'solid-js'
import { Chart } from './Chart'
import { CustomBundleChart } from './CustomBundleChart'
import styles from './App.module.css'

const App: Component = () => {
  return (
    <div class={styles.App}>
      <header class={styles.header}>
        <h1>SolidJS Plotly Example</h1>
        <Chart />
        <h1>Custom Plotly Bundle Example</h1>
        <CustomBundleChart />
      </header>
    </div>
  )
}

export default App
