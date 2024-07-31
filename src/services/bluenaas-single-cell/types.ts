interface SecMarkerConfigCommon {
  secName: string;
}

interface RecordingSecMarkerConfig extends SecMarkerConfigCommon {
  type: 'recording';
  segIdx: number;
}

interface StimulusSecMarkerConfig extends SecMarkerConfigCommon {
  type: 'stimulus';
}

export type SecMarkerConfig = RecordingSecMarkerConfig | StimulusSecMarkerConfig;

type MorphSection = {
  index: number;
  nseg: number;
  xstart: number[];
  xend: number[];
  xcenter: number[];
  xdirection: number[];
  ystart: number[];
  yend: number[];
  ycenter: number[];
  ydirection: number[];
  zstart: number[];
  zend: number[];
  zcenter: number[];
  zdirection: number[];
  segx: number[];
  diam: number[];
  length: number[];
  distance: number[];
};

export type Morphology = {
  [secName: string]: MorphSection;
};

type SegTrace = {
  label: string;
  t: number[];
  v: number[];
};

export type TraceData = SegTrace[];

export type PlotDataEntry = {
  x: number[];
  y: number[];
  type: 'scatter';
  name: string;
};

export type PlotData = PlotDataEntry[];
