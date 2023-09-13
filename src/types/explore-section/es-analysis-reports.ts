import { DateISOString } from '@/types/nexus/common';

export type AnalysisReport = {
  id: string;
  type: 'https://neuroshapes.org/AnalysisReport';
  blob: {};
  name: string;
  description: string;
  createdAt: DateISOString;
  createdBy: string;
  simulation: string;
};
