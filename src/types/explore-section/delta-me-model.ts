import { IdWithLabel, IdWithType } from './common';
import { Annotation, BrainLocation, Contribution, FileDistribution } from './delta-properties';
import { EntityResource } from '@/types/nexus/common';

type MEModelResource = EntityResource & {
  brainLocation: BrainLocation;
  contribution: Contribution;
  name: string;
};

type Activity = {
  '@type': 'Activity';
  followedWorkflow: IdWithType;
};

type MEModelSubject = {
  '@type': 'Subject';
  species: IdWithLabel;
};

export type EModelResource = MEModelResource & {
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
  subject: MEModelSubject;
};
