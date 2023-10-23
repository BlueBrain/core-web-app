import { ReactNode } from 'react';
import { ContributionEntity, AgentOrIsPartOfOrLicense, DateISOString } from '@/types/nexus';
import {
  AtlasSpatialReferenceSystemOrAtlasRelease,
  BrainRegionOrStimulusTypeOrSpecies,
  ContributorsEntity,
  AnnotationEntity,
  SimulationStatus,
  StimulusEntity,
  SubjectSpecies,
  IdLabelEntity,
  NumericEntity,
  ObjectOfStudy,
  BrainLocation,
  Aggregations,
  Distribution,
  NValueEntity,
  ImageEntity,
  SubjectAge,
  // Dimension,
  TotalHits,
  IdLabel,
  Series,
  Weight,
} from '@/types/explore-section/fields';

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
  sortOrder: 'ascend' | 'descend' | null;
}

export interface OptionalExploreSectionSerializedFields {
  meanstd?: string | number;
  mean?: string | number;
  standardDeviation?: string | number;
  density?: string | number;
  sem?: string | number | void;
  series?: Series[];
  numberOfMeasurements?: string | number;
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

export interface ExploreSectionResponse {
  hits: ESResponseRaw[];
  aggs: Aggregations;
  total: TotalHits;
}

export interface ESResponseRaw {
  sort?: number[] | null;
  _id: string;
  _index: string;
  _source: Source;
  _type: string;
}

export interface Source extends OptionalExploreSectionFields {
  [key: string]: any;
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
  parameter?: {
    coords: { [key: string]: number[] | number };
    attrs: { [key: string]: number[] };
  };
}

export interface DetailAtomResource extends DeltaResource {
  contributors: string[] | null;
}

type IdType = {
  '@id': string;
  type: string;
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
  attribute?: string;
  tags?: string[];
  simulations?: {
    contentUrl: string;
  };
  latestRevision?: number | null | undefined;
  wasGeneratedBy?: IdType;
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

export interface Subject {
  '@type': string;
  '@id'?: string;
  species: BrainRegionOrStimulusTypeOrSpecies;
  age?: SubjectAge;
  weight?: Weight;
}

export type SimulationCampaignsResponse = {
  attrs: Record<string, string>;
  coords: { [key: string]: { [key: string]: number[] | string[] } };
  data: string[][][];
  dims: Record<number, string>;
  name: string;
};

export type SimulationCampaignResource = DeltaResource & {
  brainConfiguration: string;
  status: string;
  tags: string[];
  parameter?: {
    coords: { [key: string]: number[] };
    attrs: { [key: string]: number[] };
  };
  analyses?: string[];
};

export type Simulation = {
  title: string;
  completedAt: string;
  dimensions: Record<string, number>;
  id: string;
  project: string;
  startedAt: string;
  status: SimulationStatus;
};

export type SimulationResource = DeltaResource & {
  campaign: string;
  coords: { [key: string]: number };
  status: SimulationStatus;
  startedAt: string;
  completedAt?: string;
  distribution: { contentUrl: string }[];
};

export interface SerializedDeltaResource extends OptionalExploreSectionSerializedFields {
  description?: string;
  speciesLabel?: string | null;
  brainRegion?: string;
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
  coords?: { [key: string]: number };
  contributors?: IdLabel[] | null;
  layer?: string;
  license?: string | null;
  attrs?: IdLabel[] | null;
  campaign?: string;
  startedAt?: string | null;
  startedAtTime?: string | null;
  completedAt?: string | null;
  parameter?: {
    coords: { [key: string]: number[] };
    attrs: { [key: string]: number[] };
  };
  name?: string;
  wasGeneratedBy?: string;
}

export type EPhysImageItem = {
  '@id': string;
  repetition: number;
  about: string;
  stimulusType: {
    '@id': string;
  };
};
