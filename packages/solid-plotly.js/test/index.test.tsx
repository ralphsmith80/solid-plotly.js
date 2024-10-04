import { vi, describe, test, expect, beforeEach, afterEach, MockInstance } from 'vitest';
import { render, cleanup } from '@solidjs/testing-library';
import plotComponentFactory from '../src/factory';
// import once from 'onetime';

vi.mock('plotly.js', () => ({
  default: {
    react: vi.fn(),
    newPlot: vi.fn(),
    plot: vi.fn(),
    relayout: vi.fn(),
    restyle: vi.fn(),
    update: vi.fn(),
    purge: vi.fn(),
    Plots: {
      resize: vi.fn(),
    },
  },
}));

import Plotly from 'plotly.js';

// console.log(Plotly)
// const PlotlyComponent = plotComponentFactory(Plotly);

describe('<Plotly/>', () => {
  const PlotlyComponent = plotComponentFactory(Plotly);

  function createPlot(props: any) {
    return new Promise((resolve, reject) => {
      const plot = render(() => <PlotlyComponent {...props} onInitialized={() => resolve(plot)} onError={reject} />);
    });
  }

  function expectPlotlyAPICall(method: MockInstance<any[], any>, props?: any, defaultArgs?: any) {
    expect(method).toHaveBeenCalledWith(
      expect.anything(),
      Object.assign(
        defaultArgs || {
          data: [],
          config: null,
          layout: null,
          frames: null,
        },
        props || {}
      )
    );
  }

  describe('with mocked plotly.js', () => {
    beforeEach(() => {
      vi.resetModules();
    });

    afterEach(() => {
      cleanup();
    });

    describe('initialization', () => {
      test('calls Plotly.react on instantiation', async () => {
        await createPlot({});
        expect(Plotly.react).toHaveBeenCalled();
        // expectPlotlyAPICall(Plotly.react as unknown as MockInstance<any[], any>, {});
      });

      // test('passes data', async () => {
      //   await createPlot({
      //     data: [{ x: [1, 2, 3] }],
      //     layout: { title: 'foo' },
      //   });

      //   expectPlotlyAPICall(Plotly.react as unknown as MockInstance<any[], any>, {
      //     data: [{ x: [1, 2, 3] }],
      //     layout: { title: 'foo' },
      //   });
      // });

      // test('accepts width and height', async () => {
      //   await createPlot({
      //     layout: { width: 320, height: 240 },
      //   });

      //   expectPlotlyAPICall(Plotly.react as unknown as MockInstance<any[], any>, {
      //     layout: { width: 320, height: 240 },
      //   });
      // });
    });

    // describe('plot updates', () => {
    //   test('updates data', async () => {
    //     const updateCallback = vi.fn();
    //     const { plotInstance } = await createPlot({
    //       layout: {width: 123, height: 456},
    //       onUpdate: once(updateCallback),
    //     });

    //     plotInstance.setProps({data: [{x: [1, 2, 3]}]});

    //     await vi.waitFor(() => {
    //       expect(updateCallback).toHaveBeenCalled();
    //       expectPlotlyAPICall(Plotly.react as unknown as MockInstance<any[], any>, {
    //         data: [{x: [1, 2, 3]}],
    //         layout: {width: 123, height: 456},
    //       });
    //     });
    //   });

    //   test('updates data when revision is defined but not changed', async () => {
    //     const updateCallback = vi.fn();
    //     const { plotInstance } = await createPlot({
    //       revision: 1,
    //       layout: {width: 123, height: 456},
    //       onUpdate: once(updateCallback),
    //     });

    //     plotInstance.setProps({revision: 1, data: [{x: [1, 2, 3]}]});

    //     await vi.waitFor(() => {
    //       expect(updateCallback).toHaveBeenCalled();
    //       expectPlotlyAPICall(Plotly.react as unknown as MockInstance<any[], any>, {
    //         data: [{x: [1, 2, 3]}],
    //         layout: {width: 123, height: 456},
    //       });
    //     });
    //   });
    // });

    // describe('managing event handlers', () => {
    //   test('should add an event handler when one does not already exist', async () => {
    //     const onRelayout = vi.fn();
    //     const { plotInstance } = await createPlot({ onRelayout });

    //     expect(plotInstance.props.onRelayout).toBe(onRelayout);
    //     expect(plotInstance.handlers.Relayout).toBe(onRelayout);
    //   });
    // });
  });
});