import {
  StimulusModule,
  StimulusModuleDropdownOptionType,
  StimulusParameter,
  StimulusType,
} from '@/constants/cell-model-assignment/e-model-protocols';

export interface SimConfig {
  isFixedDt: boolean;
  celsius: number;
  dt: number | null;
  variableDt: boolean;
  tstop: number;
  hypamp: number;
  vinit: number;
  injectTo: string;
  recordFrom: string[];
  stimulus: StimulusConfig;
}

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
  segName: string;
  t: number[];
  v: number[];
};

export type TraceData = SegTrace[];

type PlotDataEntry = {
  x: number[];
  y: number[];
  type: 'scatter';
  name: string;
};

export type PlotData = PlotDataEntry[];

export type StimulusConfig = {
  stimulusType: StimulusType;
  stimulusProtocol: StimulusModule | null;
  stimulusProtocolInfo: StimulusModuleDropdownOptionType | null;
  stimulusProtocolOptions: StimulusModuleDropdownOptionType[];
  paramInfo: StimulusParameter;
  paramValues: Record<string, number | null>;
};

export type SimAction =
  | { type: 'CHANGE_TYPE'; payload: StimulusType }
  | { type: 'CHANGE_PROTOCOL'; payload: StimulusModule }
  | { type: 'CHANGE_STIM_PARAM'; payload: { key: string; value: number | null } }
  | { type: 'CHANGE_PARAM'; payload: { key: string; value: unknown } };
