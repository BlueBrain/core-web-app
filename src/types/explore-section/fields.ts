export interface IdLabelEntity {
  identifier: string;
  label: string | string[];
}

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

export type ZoomRange = {
  x: number[];
  y: number[];
};

export interface TotalHits {
  relation: string;
  value: number;
}
export interface Distribution {
  contentSize: number;
  encodingFormat: string;
  label: string;
}

export interface Subject {
  '@type': string;
  '@id'?: string;
  species: BrainRegionOrStimulusTypeOrSpecies;
  age?: SubjectAge;
  weight?: Weight;
}

export interface SubjectSpecies {
  identifier: string;
  label?: string | string[] | null;
}

export interface ContributorsEntity {
  identifier?: string | string[] | null;
  label?: string | string[] | null;
}

export interface NumericEntity {
  label: string;
  unit: string;
  value: number | string;
}

export interface SubjectAge extends NumericEntity {
  value: number | string;
  period?: number | string;
  unitCode?: string;
}

export interface NValueEntity extends NumericEntity {
  nValue: number;
}

export type Series = {
  statistic: string;
  unitCode: string;
  value: number;
};

// TODO: dimension is a mock type
export type Dimension = {
  id: string;
  label: string;
  value: number[];
};

export type SimulationStatus = 'running' | 'done' | 'failed' | 'cancelled';

export interface Weight {
  maxValue: number;
  minValue: number;
  unitCode: string;
}

export interface AnnotationEntity {
  '@type'?: string[] | null;
  hasBody: HasBody;
  name: string;
}

export interface HasBody {
  '@id': string;
  '@type'?: string[] | null;
  label: string;
}

export interface AtlasSpatialReferenceSystemOrAtlasRelease {
  '@id': string;
  '@type'?: string[] | null;
}

export interface BrainLocation {
  '@type': string;
  atlasSpatialReferenceSystem: AtlasSpatialReferenceSystemOrAtlasRelease;
  brainRegion: BrainRegionOrStimulusTypeOrSpecies;
  layer?: HasBody;
}

export interface BrainRegionOrStimulusTypeOrSpecies {
  '@id': string;
  label: string;
}

export interface AtLocation {
  '@type': string;
  location: string;
  store: Store;
}

export interface Store {
  '@id': string;
  '@type': string;
  _rev: number;
}

export interface ContentSize {
  unitCode: string;
  value: number;
}

export interface Digest {
  algorithm: string;
  value: string;
}

export interface ImageEntity {
  '@id': string;
  about: string;
  repetition: number;
  stimulusType: StimulusType;
}

export interface StimulusType {
  '@id': string;
}

export interface ObjectOfStudy {
  '@id': string;
  '@type': string;
  label: string;
}

export interface StimulusEntity {
  '@type': string;
  stimulusType: BrainRegionOrStimulusTypeOrSpecies;
}
export interface Bucket {
  key: string;
  doc_count: number;
}

interface BucketAggregation {
  buckets: Bucket[];
  excludeOwnFilter: { buckets: Bucket[] };
}

export interface NestedStatsAggregation {
  [key: string]: { [key: string]: Statistics };
}

export interface Statistics {
  avg?: number;
  count: number;
  max?: number;
  min?: number;
  sum: number;
  doc_count?: number;
}

export type StatsAggregation = NestedStatsAggregation | Statistics;

export interface Aggregations {
  [key: string]: BucketAggregation | StatsAggregation;
}

export type IdLabel<
  T = {
    [key: string]: string;
  }
> = T & {
  id?: string;
  label?: string;
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
export type AxesState = {
  xAxis?: string;
  yAxis?: string;
};
