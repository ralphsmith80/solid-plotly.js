import EventEmitter from 'event-emitter';
import { vi } from 'vitest';

const state: { gd?: any } = {};

export const ASYNC_DELAY = 1;

export default {
  plot: vi.fn((gd) => {
    state.gd = gd;
    setTimeout(() => {
      state.gd.emit('plotly_afterplot');
    }, ASYNC_DELAY);
  }),
  newPlot: vi.fn((gd) => {
    state.gd = gd;
    EventEmitter(state.gd); // Set up event emitter on the graph div

    setTimeout(() => {
      state.gd.emit('plotly_afterplot');
    }, ASYNC_DELAY);
  }),
  react: vi.fn((gd) => {
    state.gd = gd;
    EventEmitter(state.gd); // Set up event emitter on the graph div

    setTimeout(() => {
      state.gd.emit('plotly_afterplot');
    }, ASYNC_DELAY);
  }),
  relayout: vi.fn((gd) => {
    state.gd = gd;
    setTimeout(() => {
      state.gd.emit('plotly_relayout');
    }, ASYNC_DELAY);
  }),
  restyle: vi.fn((gd) => {
    state.gd = gd;
    setTimeout(() => {
      state.gd.emit('plotly_restyle');
    }, ASYNC_DELAY);
  }),
  update: vi.fn(),
  purge: vi.fn(() => {
    state.gd = null;
  }),
};
