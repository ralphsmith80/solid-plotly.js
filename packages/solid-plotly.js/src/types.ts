import type { PlotlyHTMLElement, Layout, Config, Frame, PlotData } from 'plotly.js';
import type { JSX } from 'solid-js';

export interface TransitionData {
  _frames?: Frame[];
}

export interface PlotlyHTMLElementWithListener extends PlotlyHTMLElement {
  removeListener: (event: string, handler: Function) => void;
  _transitionData?: TransitionData;
}

export interface PlotlyFigure {
  data: Partial<PlotData>[];
  layout: Partial<Layout>;
  frames?: Partial<Frame>[];
}

export type PlotlyBasicEvent =
  | 'plotly_redraw'
  | 'plotly_afterexport'
  | 'plotly_afterplot'
  | 'plotly_animated'
  | 'plotly_animationinterrupted'
  | 'plotly_autosize'
  | 'plotly_beforeexport'
  | 'plotly_deselect'
  | 'plotly_doubleclick'
  | 'plotly_framework'
  | 'plotly_transitioning'
  | 'plotly_transitioninterrupted';

export type PlotlyClickEvent = 'plotly_click';
export type PlotlyHoverEvent = 'plotly_hover' | 'plotly_unhover';
export type PlotlySelectionEvent = 'plotly_selected' | 'plotly_selecting';
export type PlotlyLayoutEvent = 'plotly_relayout' | 'plotly_relayouting';
export type PlotlyRestyleEvent = 'plotly_restyle';
export type PlotlyLegendEvent = 'plotly_legendclick' | 'plotly_legenddoubleclick';
export type PlotlySliderEvent = 'plotly_sliderchange' | 'plotly_sliderend' | 'plotly_sliderstart';
export type PlotlyAnimationEvent = 'plotly_animatingframe';
export type PlotlyAnnotationEvent = 'plotly_clickannotation';
export type PlotlySunburstEvent = 'plotly_sunburstclick';

export type PlotlyHTMLElementEventName =
  | PlotlyBasicEvent
  | PlotlyClickEvent
  | PlotlyHoverEvent
  | PlotlySelectionEvent
  | PlotlyLayoutEvent
  | PlotlyRestyleEvent
  | PlotlyLegendEvent
  | PlotlySliderEvent
  | PlotlyAnimationEvent
  | PlotlyAnnotationEvent
  | PlotlySunburstEvent;

export type EventHandler = (figure: PlotlyFigure, graphDiv: PlotlyHTMLElementWithListener) => void;

export interface PlotlyEventHandlers {
  onRedraw?: EventHandler;
  onAfterExport?: EventHandler;
  onAfterPlot?: EventHandler;
  onAnimated?: EventHandler;
  onAnimationInterrupted?: EventHandler;
  onAutoSize?: EventHandler;
  onBeforeExport?: EventHandler;
  onDeselect?: EventHandler;
  onDoubleClick?: EventHandler;
  onFramework?: EventHandler;
  onTransitioning?: EventHandler;
  onTransitionInterrupted?: EventHandler;
  onClick?: EventHandler;
  onHover?: EventHandler;
  onUnhover?: EventHandler;
  onSelected?: EventHandler;
  onSelecting?: EventHandler;
  onRelayout?: EventHandler;
  onRelayouting?: EventHandler;
  onRestyle?: EventHandler;
  onLegendClick?: EventHandler;
  onLegendDoubleClick?: EventHandler;
  onSliderChange?: EventHandler;
  onSliderEnd?: EventHandler;
  onSliderStart?: EventHandler;
  onAnimatingFrame?: EventHandler;
  onClickAnnotation?: EventHandler;
  onSunburstClick?: EventHandler;
}

export interface PlotlyComponentProps extends PlotlyEventHandlers {
  data: PlotData[];
  layout?: Partial<Layout>;
  config?: Partial<Config>;
  frames?: Partial<Frame>[];
  revision?: number;
  divId?: string;
  class?: string;
  style?: JSX.CSSProperties;
  useResizeHandler?: boolean;
  onInitialized?: EventHandler;
  onUpdate?: EventHandler;
  onPurge?: () => void;
  onError?: (err: Error) => void;
  debug?: boolean;
}