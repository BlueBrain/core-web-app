export type ZoomRanges = Record<'x' | 'y', Array<number | undefined>>;

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

export type TraceData = {
  y: any;
  name: string;
  x?: any;
};

export type AxesState = {
  xAxis?: string;
  yAxis?: string;
};

export enum SynapticPosition {
  Pre,
  Post,
}

export enum SynapticType {
  BrainRegion = 'https://neuroshapes.org/BrainRegion',
  CellType = 'https://bbp.epfl.ch/ontologies/core/bmo/BrainCellType',
}

export type SynapticPathway = {
  '@id': string;
  about: string;
  label: string;
  idLabel?: string;
  identifier?: string;
};

// TODO: Move this to "es-common"?
export type IdLabel<
  T = {
    [key: string]: string;
  },
> = T & {
  id?: string;
  label?: string;
};
