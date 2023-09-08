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

type Annotation = {
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

type AtlasSpatialReferenceSystem = {
  '@id': string;
  '@type': string[];
};

type BrainRegion = {
  '@id': string;
  label: string;
};

type Coordinate = {
  '@type': string;
  '@value': number;
};

type CoordinatesInBrainAtlas = Record<'valueX' | 'valueY' | 'valueZ', Coordinate>;

type BrainLocation = {
  '@type'?: string;
  atlasSpatialReferenceSystem?: AtlasSpatialReferenceSystem;
  brainRegion: BrainRegion;
  coordinatesInBrainAtlas?: CoordinatesInBrainAtlas;
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
  period: string;
  unitCode: string;
  value: number;
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

type ExploreResource = EntityResource & {
  brainLocation: BrainLocation;
  contribution: Contribution;
  description: string;
  name: string;
  subject: Subject;
};

type ExperimentalBoutonDensity = ExploreResource & {
  annotation: Annotation | Annotation[];
  note: string;
  series: SeriesStatistic | SeriesStatistic[];
};

type ExperimentalLayerThickness = ExploreResource & {
  derivation: Derivation | Derivation[];
  series: SeriesStatistic | SeriesStatistic[];
};

type ExperimentalNeuronDensity = ExploreResource & {
  annotation: Annotation | Annotation[];
  note: string;
  series: SeriesStatistic | SeriesStatistic[];
};

type ExperimentalSynapsesPerConnection = ExploreResource & {
  series: SeriesStatistic | SeriesStatistic[];
  synapse: Synapse;
};

type ExperimentalTrace = ExploreResource & {
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

type ReconstructedNeuronMorphology = ExploreResource & {
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

export type ExploreDeltaResource =
  | ExperimentalBoutonDensity
  | ExperimentalLayerThickness
  | ExperimentalNeuronDensity
  | ExperimentalSynapsesPerConnection
  | ExperimentalTrace
  | ReconstructedNeuronMorphology;
