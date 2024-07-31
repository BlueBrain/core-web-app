import { IdWithLabel, IdWithType } from './common';
import { Annotation, BrainLocation, Contribution, FileDistribution } from './delta-properties';
import { EntityResource } from '@/types/nexus/common';

export type ModelResource = EntityResource & {
  brainLocation: BrainLocation;
  contribution: Contribution;
  name: string;
};

type Activity = {
  '@type': 'Activity';
  followedWorkflow: IdWithType;
};

export type ModelSubject = {
  '@type': 'Subject';
  species: IdWithLabel;
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
  // TODO: Use the same type here that @Bilal adds in his PR
  synapses: { id: string }[];
};

export type Model = EModelResource;
