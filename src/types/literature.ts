import { Session } from 'next-auth';

import * as LiteratureErrors from '../components/explore-section/Literature/errors';
import { Filter } from '@/components/Filter/types';
import { SelectedBrainRegion } from '@/state/brain-regions/types';

export type HighlightHit = {
  start: number;
  end: number;
};

export type GArticle = {
  id: string;
  doi?: string;
  title: string;
  authors: string[];
  journal?: string;
  paragraph: string;
  paragraphId: string;
  section?: string;
  abstract?: string;
  categories?: string[];
  articleType?: string;
  publicationDate?: string; // format "%Y-%m-%d"
  citationsCount?: number;
  impactFactor?: number;
};

export type GenerativeQAMetadata = {
  article_id: string;
  article_title: string;
  article_authors: string[];
  paragraph: string;
  paragraph_id: string;
  article_doi?: string;
  section?: string;
  date?: string; // format "%Y-%m-%d"
  article_type?: string;
  journal?: string;
  cited_by?: number;
  impact_factor?: number;
  abstract?: string;
};

export type GenerativeQAResponse = {
  answer: string;
  raw_answer: string;
  paragraphs: string[];
  metadata: GenerativeQAMetadata[];
};
export type SelectedBrainRegionPerQuestion = Pick<SelectedBrainRegion, 'id' | 'title'>;
export type GenerativeQA = {
  id: string;
  askedAt: Date;
  question: string;
  answer: string;
  rawAnswer: string;
  brainRegion?: SelectedBrainRegionPerQuestion;
  articles: GArticle[];
};

export type GetGenerativeQAInput = {
  session: Session | null;
  question: string;
  size?: number;
};

export type ReturnGetGenerativeQA = (
  input: GetGenerativeQAInput
) => Promise<GenerativeQA | LiteratureErrors.LiteratureValidationError | null>;

export const FilterFields = [
  'categories',
  'publicationDate',
  'articleType',
  'journal',
  'authors',
] as const;

export const SortableFields = ['publicationDate', 'citationsCount', 'impactFactor'] as const;

export type SortDirection = 'asc' | 'desc' | null;
export type SortFn = (article1: GArticle, article2: GArticle) => number;

export type FilterFieldsType = (typeof FilterFields)[number];

export type SortableFieldsType = (typeof SortableFields)[number];

export type FilterValues = Partial<{ [key in FilterFieldsType]: Filter['value'] }>;

export type MLFilter = Filter & {
  field: FilterFieldsType;
  hasOptions: boolean;
};

export function isGenerativeQA(gqa: any) {
  if (gqa && 'id' in gqa && 'question' in gqa) return true;
  return false;
}
