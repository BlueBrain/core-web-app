import { Dispatch, ReactNode, SetStateAction } from 'react';
import { Loadable } from 'jotai/vanilla/utils/loadable';
import { ContributionEntity, AgentOrIsPartOfOrLicense, DateISOString } from '@/types/nexus';
import { Filter } from '@/components/Filter/types';

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

export type EPhysImageItem = {
  '@id': string;
  repetition: number;
  about: string;
  stimulusType: {
    '@id': string;
  };
};

export interface SideLinkList {
  links?: Array<SideLink>;
}

export interface SideLink {
  url: string;
}

export interface FetchParams {
  id: string;
  project: string;
  org: string;
}

export interface Campaign {
  id: string;
  org: string;
  self: string;
  name: string;
  project: string;
  status?: string;
  description?: string;
  configuration?: string;
  dimensions?: string;
  startedAt?: string;
  updatedAt?: string;
  endedAt?: string;
  createdAt?: string;
  attributes?: string;
  updatedBy?: string;
  tags?: string[];
}

export interface ExploreSectionResource extends OptionalExploreSectionFields {
  key: React.Key | string;
  self: string;
  id: string;
  name: string;
  description: string;
  subjectSpecies?: string;
  contributors: string;
  createdAt: string;
  brainRegion: string;
}

export interface OptionalExploreSectionSerializedFields {
  meanstd?: string | number;
  mean?: string | number;
  standardDeviation?: string | number;
  sem?: string | number | void;
  series?: Series[];
  numberOfCells?: string | number;
  weight?: string | number | void;
  conditions?: string;
}

export interface OptionalExploreSectionFields extends OptionalExploreSectionSerializedFields {
  reference?: string;
  neuronDensity?: NValueEntity;
  layerThickness?: NValueEntity;
  boutonDensity?: NumericEntity;
  subjectAge?: SubjectAge;
  image?: ImageEntity[] | null;
}

export interface TotalHits {
  relation: string;
  value: number;
}

export interface ExploreSectionResponse {
  hits: ExploreSectionResource[];
  aggs: Aggregations;
  total: TotalHits;
}

// The interaces below this line are generated for Elastic Search responses for type @trace
export interface IdLabelEntity {
  identifier: string;
  label: string | string[];
}

export interface Distribution {
  contentSize: number;
  encodingFormat: string;
  label: string;
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

export interface ESResponseRaw {
  sort?: number[] | null;
  _id: string;
  _index: string;
  _source: Source;
  _type: string;
}

export interface Source extends OptionalExploreSectionFields {
  '@id': string;
  '@type'?: string | string[] | null;
  brainRegion?: IdLabelEntity;
  createdAt: string;
  createdBy: string;
  deprecated: boolean;
  description?: string | null;
  distribution: Distribution;
  name: string;
  project: IdLabelEntity;
  subjectSpecies?: SubjectSpecies;
  updatedAt: string;
  updatedBy: string;
  _self: string;
  mType: IdLabelEntity | null;
  eType: IdLabelEntity | null;
  layer?: IdLabelEntity[];
  layerThickness?: NValueEntity;
  contributors?: ContributorsEntity[] | null;
  license?: IdLabelEntity | null;
  organizations?: IdLabelEntity[] | null;
}

export type Series = {
  statistic: string;
  unitCode: string;
  value: number;
};

export interface DetailAtomResource extends DeltaResource {
  contributors: string[] | null;
}

// TODO: dimension is a mock type
export type Dimension = {
  id: string;
  label: string;
  value: number[];
};

// Below is the delta response interface definitions
export type DeltaResource<
  T = {
    [key: string]: any;
  }
> = T & {
  '@context'?: string[] | null;
  '@id': string;
  '@type'?: string[] | null;
  atlasRelease: AtlasSpatialReferenceSystemOrAtlasRelease;
  brainLocation: BrainLocation;
  description: string;
  distribution: Distribution;
  isPartOf: AgentOrIsPartOfOrLicense;
  license: AgentOrIsPartOfOrLicense;
  name: string;
  objectOfStudy: ObjectOfStudy;
  subject: Subject;
  contribution?: ContributionEntity[] | null;
  annotation?: AnnotationEntity[] | null;
  stimulus?: StimulusEntity[] | null;
  image?: ImageEntity[] | null;
  series?: Series[] | Series;
  reason?: string;
  brainConfiguration?: string;
  attribute?: string;
  status?: string;
  tags?: string[];
  dimensions?: Dimension[];
  coords: { [key: string]: string };
  attrs: { [key: string]: number[] };
  latestRevision?: number | null | undefined;
  campaign?: string;
  startedAt?: string;
  completedAt?: string;
  _constrainedBy: string;
  _createdAt: DateISOString;
  _createdBy: string;
  _deprecated: boolean;
  _incoming: string;
  _outgoing: string;
  _project: string;
  _rev: number;
  _schemaProject: string;
  _self: string;
  _updatedAt: string;
  _updatedBy: string;
};

export type SimulationStatus = 'running' | 'done' | 'failed' | 'cancelled';

export type SimulationCampaignResource = DeltaResource & {
  brainConfiguration: string;
  status: string;
  tags: string[];
  coords: { [key: string]: number[] };
  attrs: { [key: string]: number[] };
};

export type SimulationResource = DeltaResource & {
  campaign: string;
  coords: { [key: string]: number };
  status: SimulationStatus;
  startedAt: string;
  completedAt?: string;
};

interface Weight {
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

export interface Subject {
  '@type': string;
  '@id'?: string;
  species: BrainRegionOrStimulusTypeOrSpecies;
  age?: SubjectAge;
  weight?: Weight;
}

export interface Bucket {
  key: string;
  doc_count: number;
}

export interface Aggregations {
  [key: string]: {
    buckets: Bucket[];
    excludeOwnFilter: { buckets: Bucket[] };
  };
}

export interface SortState {
  field: string | React.Key;
  order: 'asc' | 'desc';
}

export interface SerializedDeltaResource extends OptionalExploreSectionSerializedFields {
  description?: string;
  speciesLabel?: string | null;
  brainRegion?: string;
  numberOfMeasurement?: number;
  subjectSpecies?: string;
  createdBy?: string;
  meanPlusMinusStd?: ReactNode | null;
  creationDate?: ReactNode;
  thickness?: ReactNode;
  brainConfiguration?: string;
  subjectAge?: string | void;
  mType?: string | void;
  eType?: string | void;
  attribute?: string;
  status?: string;
  tags?: ReactNode;
  updatedAt?: string | null;
  dimensions?: IdLabel[] | null;
  contributors?: IdLabel[] | null;
  layer?: string;
  license?: string | null;
  attrs?: IdLabel[] | null;
  campaign?: string;
  startedAt?: string;
  completedAt?: string;
}

export type DetailResource = SerializedDeltaResource & DeltaResource;

export type AxesState = {
  xAxis?: string;
  yAxis?: string;
};

export type IdLabel<
  T = {
    [key: string]: string;
  }
> = T & {
  id?: string;
  label?: string;
};

export type ListViewAtomValues = {
  aggregations: Loadable<Aggregations | undefined>;
  data: Loadable<ExploreSectionResource[] | undefined>;
  filters: Filter[];
  pageSize: number;
  searchString: string;
  sortState: SortState;
  total: Loadable<TotalHits | undefined>;
};

export type ListViewAtomSetters = {
  setFilters: Dispatch<SetStateAction<ListViewAtomValues['filters']>>;
  setSearchString: Dispatch<SetStateAction<ListViewAtomValues['searchString']>>;
  setSortState: Dispatch<SetStateAction<ListViewAtomValues['sortState']>>;
  setPageSize: Dispatch<SetStateAction<ListViewAtomValues['pageSize']>>;
};
