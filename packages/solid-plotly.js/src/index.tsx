import Plotly from 'plotly.js-dist-min'
// INFO: using plotly.js/dist/plotly causes an error when running the dev server
// import Plotly from 'plotly.js/dist/plotly'
import plotComponentFactory from './factory'

export type { PlotlyComponentProps, PlotlyFigure, PlotlyHTMLElementEventName } from './types'

// Create and export the default Plotly component
export const PlotComponent = plotComponentFactory(Plotly)

// Export the factory for users who want to use a different Plotly instance
export { plotComponentFactory }

export default PlotComponent
