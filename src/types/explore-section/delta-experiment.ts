import { IdWithLabel, IdWithType, TypeWithDate } from './common';
import {
  Annotation,
  BrainLocation,
  Contribution,
  Derivation,
  Generation,
  Image,
  SeriesStatistic,
  Stimulus,
  Subject,
  Synapse,
} from './delta-properties';
import { Distribution, EntityResource } from '@/types/nexus/common';

export type ExperimentResource = EntityResource<{
  brainLocation: BrainLocation;
  contribution: Contribution;
  description: string;
  name: string;
  subject: Subject;
}>;

export type ExperimentalBoutonDensity = ExperimentResource & {
  annotation: Annotation | Annotation[];
  note: string;
  series: SeriesStatistic | SeriesStatistic[];
};

export type ExperimentalLayerThickness = ExperimentResource & {
  derivation: Derivation | Derivation[];
  series: SeriesStatistic | SeriesStatistic[];
};

export type ExperimentalNeuronDensity = ExperimentResource & {
  annotation: Annotation | Annotation[];
  note: string;
  series: SeriesStatistic | SeriesStatistic[];
};

export type ExperimentalSynapsesPerConnection = ExperimentResource & {
  series: SeriesStatistic | SeriesStatistic[];
  synapse: Synapse; // TODO: Check this property against "synapticPathway"
  synapticPathway: {
    postSynaptic: { about: string; label: string }[];
    preSynaptic: { about: string; label: string }[];
  }; // TODO: Check this property against "synapse". Which one is actually correct?
};

export type ExperimentalTrace = ExperimentResource & {
  annotation: Annotation | Annotation[];
  atlasRelease: IdWithType<string[]>;
  dateCreated: TypeWithDate;
  distribution: Distribution | Distribution[];
  identifier: string;
  image: Image[];
  license: IdWithType;
  note: string;
  objectOfStudy: IdWithLabel;
  stimulus: Stimulus[];
};

export type ReconstructedNeuronMorphology = ExperimentResource & {
  atlasRelease: IdWithType<string[]>;
  dateCreated: TypeWithDate;
  derivation: Derivation | Derivation[];
  distribution: Distribution | Distribution[];
  fluorophore: string;
  generation: Generation;
  identifier: string;
  license: IdWithType;
  objectOfStudy: IdWithLabel;
  virus: string;
  version: number;
};
