import { IdWithLabel, IdWithType } from './common';

export type Project = IdWithLabel & {
  identifier: string;
};

export type ESHitSource = IdWithType<string[]> & {
  createdAt: Date;
  createdBy: string;
  deprecated: boolean;
  name: string;
  project: Project;
  updatedAt: Date;
  updatedBy: string;
  _self: string;
};
