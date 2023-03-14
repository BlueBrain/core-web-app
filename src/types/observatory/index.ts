import { Resource, NexusClient } from '@bbp/nexus-sdk';

export type TraceData = {
  y: any;
  name: string;
  x?: any;
};

export type ZoomRanges = {
  x: [number | undefined, number | undefined];
  y: [number | undefined, number | undefined];
};

export type DataSets = {
  [key: string]: TraceData;
};

export type Sweep = {
  [key: string]: {
    i: string;
    v: string;
  };
};

export type Repetition = {
  [key: string]: {
    sweeps: string[];
  };
};

export type IndexDataValue = {
  dt: number;
  dur: number;
  i_unit: string;
  name: string;
  repetitions: Repetition;
  sweeps: Sweep;
  t_unit: string;
  v_unit: string;
};

export type RABIndexData = {
  [key: string]: IndexDataValue;
};

export type RABIndex = {
  data: RABIndexData;
  metadata: {
    [key: string]: string;
  };
};

export type ZoomRange = {
  x: number[];
  y: number[];
};

export type PlotProps = {
  setSelectedSweeps: (sweeps: string[]) => void;
  metadata?: IndexDataValue;
  sweeps: {
    selectedSweeps: string[];
    previewSweep?: string;
    allSweeps: string[];
    colorMapper: { [key: string]: string };
  };
  dataset: string;
  options: any;
  zoomRanges: ZoomRanges | null;
  onZoom: (zoomRanges: ZoomRanges) => void;
};

export type RemoteData<T> = {
  loading: boolean;
  error: Error | null;
  data: T | null;
};

// Plugin related types

export type CallbackFn = () => void;

export type NexusPluginProps<R> = {
  ref: HTMLDivElement;
  nexusClient: NexusClient;
  resource: Resource<R>;
  goToResource?: (selfUrl: string) => void;
};

export type NexusPlugin<R = any> = (pluginProps: NexusPluginProps<R>) => CallbackFn | void;
