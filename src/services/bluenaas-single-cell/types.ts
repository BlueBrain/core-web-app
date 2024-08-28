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

export type NeuronSectionInfo = {
  index: number;
  name: string;
  nseg: number;
  distance_from_soma: number;
  sec_length: number;
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
  neuron_segments_offset: number[];
  neuron_section_id: number;
  segment_distance_from_soma: number[];
};

export type Morphology = {
  [secName: string]: NeuronSectionInfo;
};

type SegTrace = {
  label: string;
  recording?: string;
  t: number[];
  v: number[];
};

export type TraceData = SegTrace[];

export type PlotDataEntry = {
  x: number[];
  y: number[];
  type: 'scatter';
  name: string;
  recording?: string;
};

export type PlotData = PlotDataEntry[];
