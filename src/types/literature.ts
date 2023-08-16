import { Session } from 'next-auth';

import * as LiteratureErrors from '../components/explore-section/Literature/errors';
import { Filter } from '@/components/Filter/types';

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
  article_journal: string;
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

export type GenerativeQA = {
  id: string;
  askedAt: Date;
  question: string;
  answer: string;
  rawAnswer: string;
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

export type FilterFieldsType = (typeof FilterFields)[number];

export type FilterValues = Partial<{ [key in FilterFieldsType]: Filter['value'] }>;

export type MLFilter = Filter & {
  field: FilterFieldsType;
  hasOptions: boolean;
};
