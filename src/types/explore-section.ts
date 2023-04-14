export interface SideLinkList {
  links?: Array<SideLink>;
}

export interface SideLink {
  url: string;
  title: string;
}

export interface FetchParams {
  id?: string;
  project?: string;
  org?: string;
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

export interface ExploreSectionResource {
  key: React.Key;
  self: string;
  id: string;
  name: string;
  description: string;
  subjectSpecies?: string;
  contributor: string;
  createdAt: string;
  brainRegion: string;
  mtype?: string;
  etype?: string;
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

export interface Dimension {
  key: string;
  dimensionValues: string;
  startedAt: string;
  endedAt: string;
  status: string;
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
export interface SubjectAge {
  label: string;
  period: string;
  unit: string;
  value: number | string;
}
export interface ESResponseRaw {
  sort?: number[] | null;
  _id: string;
  _index: string;
  _source: Source;
  _type: string;
}
export interface Source {
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
  contributors?: ContributorsEntity[] | null;
  subjectAge?: SubjectAge | null;
  license?: IdLabelEntity | null;
  organizations?: IdLabelEntity[] | null;
  eType?: IdLabelEntity | null;
  mType?: IdLabelEntity | null;
}

// Below is the delta response interface definitions
export type DeltaResource<
  T = {
    [key: string]: any;
  }
> = T & {
  '@context'?: string[] | null;
  '@id': string;
  '@type'?: string[] | null;
  annotation?: AnnotationEntity[] | null;
  atlasRelease: AtlasSpatialReferenceSystemOrAtlasRelease;
  brainLocation: BrainLocation;
  contribution?: ContributionEntity[] | null;
  description: string;
  distribution: Distribution;
  image?: ImageEntity[] | null;
  isPartOf: AgentOrIsPartOfOrLicense;
  license: AgentOrIsPartOfOrLicense;
  name: string;
  objectOfStudy: ObjectOfStudy;
  stimulus?: StimulusEntity[] | null;
  subject: Subject;
  _constrainedBy: string;
  _createdAt: string;
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
}
export interface BrainRegionOrStimulusTypeOrSpecies {
  '@id': string;
  label: string;
}
export interface ContributionEntity {
  '@type': string;
  agent: AgentOrIsPartOfOrLicense;
}
export interface AgentOrIsPartOfOrLicense {
  '@id': string;
  '@type': string;
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
  species: BrainRegionOrStimulusTypeOrSpecies;
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
