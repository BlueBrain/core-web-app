import {
  BrainRegion,
  Contributor,
  CoordinatesInBrainAtlas,
  DerivationResource,
  EType,
  FileDistribution,
  Generation,
  Layer,
  LayerThickness,
  License,
  MType,
  Statistic,
  StimulusImage,
  SubjectAge,
  SubjectSpecies,
  SubjectWeight,
} from './es-properties';
import { ESHitSource } from './es-common';

type ExperimentProps = ESHitSource & {
  brainRegion: BrainRegion;
  contributors: Contributor[];
  subjectSpecies: SubjectSpecies;
};

type ExperimentalBoutonDensity = ExperimentProps & {
  mType: MType;
  series: Statistic[]; // Not on ExperimentalTrace
  subjectWeight: SubjectWeight;
};

export type ExperimentalLayerThickness = ExperimentProps & {
  derivation: DerivationResource;
  description: string;
  layer: Layer[];
  layerThickness: LayerThickness;
  series: Statistic[];
};

type ExperimentalNeuronDensity = ExperimentProps & {
  mType: MType;
  series: Statistic[];
};

type ExperimentalSynapsesPerConnection = ExperimentProps & {
  description: string;
  series: Statistic[];
  subjectWeight: SubjectWeight;
};

export type ExperimentalTrace = ExperimentProps & {
  description: string;
  distribution: FileDistribution[];
  eType: EType;
  image: StimulusImage[];
  license: License;
  subjectAge: SubjectAge;
  subjectWeight: SubjectWeight;
};

export type ReconstructedNeuronMorphology = ExperimentProps & {
  coordinatesInBrainAtlas: CoordinatesInBrainAtlas;
  derivation: DerivationResource;
  description: string;
  distribution: FileDistribution[];
  generation: Generation;
  license: License;
};

export type Experiment =
  | ExperimentalBoutonDensity
  | ExperimentalLayerThickness
  | ExperimentalNeuronDensity
  | ExperimentalSynapsesPerConnection
  | ExperimentalTrace
  | ReconstructedNeuronMorphology;
