import { Session } from 'next-auth';

import * as LiteratureErrors from './errors';

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
};

export type GenerativeQAMetadata = {
  article_id: string;
  article_doi: string;
  article_title: string;
  article_authors: string[];
  article_abstract: string | string[];
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
