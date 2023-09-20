import { Project } from './es-common';
import { DerivationResource, FileDistribution } from './es-properties';
import { DateISOString } from '@/types/nexus/common';

export type AnalysisReport = {
  '@id': string;
  '@type': string;
  createdAt: DateISOString;
  createdBy: string;
  deprecated: boolean;
  derivation: DerivationResource[];
  description: string;
  distribution: FileDistribution[];
  name: string;
  project: Project;
  updatedAt: DateISOString;
  updatedBy: string;
  _self: string;
};

export type AnalysisReportWithImage = AnalysisReport & {
  blob: Blob;
  simulation: string;
};
