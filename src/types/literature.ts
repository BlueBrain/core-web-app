import { Session } from 'next-auth';

import * as LiteratureErrors from '../components/explore-section/Literature/errors';
import { Filter } from '@/components/Filter/types';

export type HighlightHit = {
  start: number;
  end: number;
};

export type GArticle = {
  id: string;
  doi: string;
  title: string;
  authors: string[];
  journal: string;
  paragraph: string;
  section: string;
  abstract: string | string[];
  categories?: string[];
  articleType?: string;
  publicationDate?: string; // format "%Y-%m-%d"
};

export type GenerativeQAMetadata = {
  article_id: string;
  article_doi: string;
  article_title: string;
  article_authors: string[];
  article_abstract: string | string[];
  article_journal: string;
  section: string;
  paragraph: string;
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
