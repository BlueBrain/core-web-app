import { DateISOString, Distribution, EntityResource } from '@/types/nexus/common';

type AnnotationHasBody = {
  '@id': string;
  '@type': string[];
  label: string;
};

type AnnotationMotivation = {
  '@id': string;
  '@type': string;
};

export type Annotation = {
  '@type': string[];
  hasBody: AnnotationHasBody;
  name: string;
  motivatedBy?: AnnotationMotivation;
  note?: string;
};

type AtlasRelease = {
  '@id': string;
  '@type': string[];
};

type BLAtlasSpatialReferenceSystem = {
  '@id': string;
  '@type': string[];
};

type BLBrainRegion = {
  '@id': string;
  label: string;
};

type BLCoordinate = {
  '@type': string;
  '@value': number;
};

type BLCoordinatesInBrainAtlas = Record<'valueX' | 'valueY' | 'valueZ', BLCoordinate>;

type BLLayer = {
  label: string;
};

type BrainLocation = {
  '@type'?: string;
  atlasSpatialReferenceSystem?: BLAtlasSpatialReferenceSystem;
  brainRegion: BLBrainRegion;
  coordinatesInBrainAtlas?: BLCoordinatesInBrainAtlas;
  layer?: BLLayer;
};

type ContributionAgent = {
  '@id': string;
  '@type': string[];
  label: string;
};

type Contribution = {
  '@type': 'Contribution';
  agent: ContributionAgent;
};

type DateObj = {
  '@type': string;
  '@value': DateISOString;
};

type DerivationEntity = {
  '@id': string;
  '@type': string;
};

type Derivation = {
  '@type': string;
  entity: DerivationEntity;
};

type GenerationSoftwareSourceCode = {
  '@type': string;
  codeRepository: string;
  programmingLanguage: string;
  runtimePlatform: string;
  version: string;
};

type GenerationWasAssociatedWith = {
  '@type': string[];
  description: string;
  name: string;
  softwareSourceCode: GenerationSoftwareSourceCode;
};

type GenerationActivity = {
  '@type': string;
  endedAtTime: DateISOString;
  startedAtTime: DateISOString;
  wasAssociatedWith: GenerationWasAssociatedWith;
};

type Generation = {
  '@type': string;
  activity: GenerationActivity;
};

type ImageStimulusType = {
  '@id': string;
};

type Image = {
  '@id': string;
  about: string;
  repetition: number;
  stimulusType: ImageStimulusType;
};

type License = {
  '@id': string;
  '@type': string;
};

type ObjectOfStudy = {
  '@id': string;
  '@type': string;
  label: string;
};

type Rejection = {
  '@type': 'ResourceNotFound';
  reason: "File 'https://creativecommons.org/licenses/by-nc-sa/4.0/' not found in project 'public/thalamus'.";
  status: 404;
};

type SeriesStatistic = {
  statistic: string;
  unitCode: string;
  value: number;
};

type StimulusType = {
  '@id': string;
  label: string;
};

type Stimulus = {
  '@type': string;
  stimulusType: StimulusType;
};

type SubjectAge = {
  maxValue?: number;
  minValue?: number;
  period: string;
  unitCode: string;
  value?: number;
};

type SubjectSex = {
  '@id': string;
  label: string;
};

type SubjectSpecies = {
  '@id': string;
  label: string;
};

type SubjectStrain = {
  label: string;
};

type SubjectWeight = {
  unitCode: string;
  maxValue?: number;
  minValue?: number;
  value?: number;
};

type Subject = {
  '@type': string;
  species: SubjectSpecies;
  strain: SubjectStrain;
  age?: SubjectAge;
  sex?: SubjectSex;
  weight?: SubjectWeight;
};

type SynapseSynaptic = {
  '@id': string;
  label: string;
};

type Synapse = {
  postSynaptic: SynapseSynaptic;
  preSynaptic: SynapseSynaptic;
};

type WasGeneratedBy = {
  '@id': string;
  '@type': string;
};

type ExperimentResource = EntityResource & {
  brainLocation: BrainLocation;
  contribution: Contribution;
  description: string;
  name: string;
  subject: Subject;
};

type ExperimentalBoutonDensity = ExperimentResource & {
  annotation: Annotation | Annotation[];
  note: string;
  series: SeriesStatistic | SeriesStatistic[];
};

export type ExperimentalLayerThickness = ExperimentResource & {
  derivation: Derivation | Derivation[];
  series: SeriesStatistic | SeriesStatistic[];
};

type ExperimentalNeuronDensity = ExperimentResource & {
  annotation: Annotation | Annotation[];
  note: string;
  series: SeriesStatistic | SeriesStatistic[];
};

export type ExperimentalSynapsesPerConnection = ExperimentResource & {
  series: SeriesStatistic | SeriesStatistic[];
  synapse: Synapse;
};

export type ExperimentalTrace = ExperimentResource & {
  annotation: Annotation | Annotation[];
  atlasRelease: AtlasRelease;
  dateCreated: DateObj;
  distribution: Distribution | Distribution[];
  identifier: string;
  image: Image[];
  license: License;
  note: string;
  objectOfStudy: ObjectOfStudy;
  stimulus: Stimulus[];
};

export type LicenseResource = {
  '@context': string;
  '@type': string;
  rejections?: Rejection[];
};

export type ReconstructedNeuronMorphology = ExperimentResource & {
  atlasRelease: AtlasRelease;
  dateCreated: DateObj;
  derivation: Derivation | Derivation[];
  distribution: Distribution | Distribution[];
  fluorophore: string;
  generation: Generation;
  identifier: string;
  license: License;
  objectOfStudy: ObjectOfStudy;
  virus: string;
  version: number;
};

// Simulation Campaigns

type ContentSize = {
  unitCode: 'bytes';
  value: 861;
};

type Digest = {
  algorithm: string;
  value: string;
};

type ParameterAttrs = {
  blue_config_template: string;
  circuit_config: string;
  path_prefix: string;
};

export type ParameterCoords = Record<string, number | number[]>;

type Parameter = {
  attrs?: ParameterAttrs;
  coords: ParameterCoords;
};

export type Simulation = EntityResource & {
  endedAtTime: DateISOString;
  log_url: string;
  name: string;
  parameter: Parameter;
  startedAtTime: DateISOString;
  status: string;
  wasGeneratedBy: WasGeneratedBy;
};

type SimCampSimulations = {
  '@type': string;
  contentSize: ContentSize;
  contentUrl: string;
  digest: Digest;
  encodingFormat: string;
};

export type SimulationCampaign = EntityResource & {
  description: string;
  name: string;
  parameter: Parameter;
  simulations: SimCampSimulations;
  wasGeneratedBy: WasGeneratedBy;
};

export type Experiment =
  | ExperimentalBoutonDensity
  | ExperimentalLayerThickness
  | ExperimentalNeuronDensity
  | ExperimentalSynapsesPerConnection
  | ExperimentalTrace
  | ReconstructedNeuronMorphology;

export type ExploreDeltaResource = Experiment;

export type WithAnnotation = Exclude<
  Experiment,
  ExperimentalLayerThickness | ExperimentalSynapsesPerConnection | ReconstructedNeuronMorphology
>;

export type WithSEM = Exclude<Experiment, ExperimentalTrace | ReconstructedNeuronMorphology>;

export type WithSeries = Exclude<Experiment, ExperimentalTrace | ReconstructedNeuronMorphology>;

export type Contributor = EntityResource & {
  name: string;
};
