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
import { IdWithName } from './common';
import { SynapticPathway } from '@/types/explore-section/fields';

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

export type ExperimentalSynapsesPerConnection = ExperimentProps & {
  description: string;
  series: Statistic[];
  subjectWeight: SubjectWeight;
  preSynapticPathway: SynapticPathway[];
  postSynapticPathway: SynapticPathway[];
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
  featureSeries: MorphologyFeature[];
};

export enum MorphoMetricCompartment {
  Axon = 'Axon',
  ApicalDendrite = 'ApicalDendrite',
  BasalDendrite = 'BasalDendrite',
  Soma = 'Soma',
  NeuronMorphology = 'NeuronMorphology',
}

type MorphologyFeature = {
  compartment: MorphoMetricCompartment;
  label: string;
  statistic: string;
  unit: string;
  value: number;
};

export type NeuronMorphologyFeatureAnnotation = ExperimentProps & {
  neuronMorphology: IdWithName;
  compartment: MorphoMetricCompartment;
};

export type Experiment =
  | ExperimentalBoutonDensity
  | ExperimentalLayerThickness
  | ExperimentalNeuronDensity
  | ExperimentalSynapsesPerConnection
  | ExperimentalTrace
  | NeuronMorphologyFeatureAnnotation
  | ReconstructedNeuronMorphology;
