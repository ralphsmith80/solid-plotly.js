<p>
  <img width="100%" src="https://assets.solidjs.com/banner?type=solid-plotly.js&background=tiles&project=%20" alt="solid-plotly.js">
</p>

# solid-plotly.js

[![pnpm](https://img.shields.io/badge/maintained%20with-pnpm-cc00ff.svg?style=for-the-badge&logo=pnpm)](https://pnpm.io/)

A plotly.js SolidJS component from Plotly

# solid-plotly.js

<img src="https://www.solidjs.com/img/logo/without-wordmark/logo.svg" width="200" height="200" alt="solid-js-logo">

TODO: complete details after wrapper is implemented
<!-- > A [plotly.js](https://github.com/plotly/plotly.js) React component from
> [Plotly](https://plot.ly/). The basis of Plotly's
> [React component suite](https://plot.ly/products/react/).

👉 [DEMO](http://react-plotly.js-demo.getforge.io/)

👉 [Demo source code](https://github.com/plotly/react-plotly.js-demo-app)

<div align="center">
  <a href="https://dash.plotly.com/project-maintenance">
    <img src="https://dash.plotly.com/assets/images/maintained-by-plotly.png" width="400px" alt="Maintained by Plotly">
  </a>
</div>

---

## Contents

- [Installation](#installation)
- [Quick start](#quick-start)
- [State management](#state-management)
- [Refreshing the Plot](#refreshing-the-plot)
- [API](#api)
  - [Basic props](#basic-props)
  - [Event handler props](#event-handler-props)
- [Customizing the `plotly.js` bundle](#customizing-the-plotlyjs-bundle)
- [Loading from a `<script>` tag](#loading-from-a-script-tag)
- [Development](#development)

## Installation

```bash
$ npm install react-plotly.js plotly.js
```

## Quick start

The easiest way to use this component is to import and pass data to a plot component:

```javascript
import React from 'react';
import Plot from 'react-plotly.js';

class App extends React.Component {
  render() {
    return (
      <Plot
        data={[
          {
            x: [1, 2, 3],
            y: [2, 6, 3],
            type: 'scatter',
            mode: 'lines+markers',
            marker: {color: 'red'},
          },
          {type: 'bar', x: [1, 2, 3], y: [2, 5, 3]},
        ]}
        layout={{width: 320, height: 240, title: 'A Fancy Plot'}}
      />
    );
  }
}
```

You should see a plot like this:

<p align="center">
 <img src="example.png" alt="Example plot" width="320" height="240">
</p>

For a full description of Plotly chart types and attributes see the following resources:

- [Plotly JavaScript API documentation](https://plot.ly/javascript/)
- [Full plotly.js attribute listing](https://plot.ly/javascript/reference/) -->