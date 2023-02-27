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

export interface EphysResource {
  key: React.Key;
  self: string;
  id: string;
  name: string;
  description: string;
  brainRegion: string;
  subjectSpecies: string;
  etype?: string;
  mtype?: string;
  contributor: string;
  createdAt: string;
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
  label: string;
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
export interface EphysRaw {
  sort?: number[] | null;
  _id: string;
  _index: string;
  _source: Source;
  _type: string;
}
export interface Source {
  '@id': string;
  '@type'?: string | string[] | null;
  brainRegion: IdLabelEntity;
  createdAt: string;
  createdBy: string;
  deprecated: boolean;
  description?: string | null;
  distribution: Distribution;
  name: string;
  project: IdLabelEntity;
  subjectSpecies: SubjectSpecies;
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
