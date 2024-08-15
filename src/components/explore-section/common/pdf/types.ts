import { FileDistribution } from '@/types/explore-section/delta-properties';

export type AnalysisPDF = FileDistribution & { name?: string };

export enum AnalysisType {
  All = 'all',
  Traces = 'traces',
  Scores = 'scores',
  Distribution = 'distribution',
  Other = 'other',
  Custom = 'custom',
  Thumbnail = 'thumbnail',
}

export enum AnalysisFileType {
  Traces = 'traces.pdf',
  Scores = 'scores.pdf',
  Distribution = 'distribution.pdf',
  Thumbnail = 'thumbnail.png',
  Currentscape = 'currentscape.pdf',
}
