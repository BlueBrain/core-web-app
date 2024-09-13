import { EModel, NeuronMorphology } from '../e-model';
import { MEModelResource } from '../me-model';
import { IdWithLabel, IdWithType } from './common';
import {
  Annotation,
  BrainLocation,
  Contribution,
  FileDistribution,
  ModelSubject,
} from './delta-properties';
import { Distribution, EntityResource } from '@/types/nexus/common';

export type ModelResource = EntityResource & {
  brainLocation: BrainLocation;
  contribution: Contribution;
  name: string;
};

type Activity = {
  '@type': 'Activity';
  followedWorkflow: IdWithType;
};

export type EModelResource = ModelResource & {
  annotation: Annotation;
  distribution: Array<FileDistribution>;
  emodel: string;
  etype: string;
  generation: {
    '@type': 'Generation';
    activity: Activity;
  };
  iteration: string;
  mtype: string;
  objectOfStudy: IdWithLabel & {
    '@type': 'ObjectOfStudy';
  };
  seed: number;
  subject: ModelSubject;
  score?: number;
};

export type SynaptomeModelResource = EntityResource & {
  distribution: Distribution;
  name: string;
  description: string;
  used: {
    '@id': string;
    '@type': string | Array<string>;
  };
  seed: number;
  linkedMeModel?: MEModelResource;
  linkedMModel?: NeuronMorphology;
  linkedEModel?: EModel;
};

export type Model = EModelResource | SynaptomeModelResource;
