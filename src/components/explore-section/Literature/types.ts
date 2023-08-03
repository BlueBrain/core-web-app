import * as LiteratureErrors from './errors';

type THighlightHits = {
  start: number;
  end: number;
};

type TArticle = {
  id: string;
  doi: string;
  title: string;
  authors: string[];
  journal: string;
  paragraph: string;
  section: string;
  abstract: string | string[];
};

type TGenerativeQAMetadata = {
  article_id: string;
  article_doi: string;
  article_title: string;
  article_authors: string[];
  article_abstract: string | string[];
  section: string;
  paragraph: string;
};

type TGenerativeQAResponse = {
  answer: string;
  raw_answer: string;
  paragraphs: string[];
  metadata: TGenerativeQAMetadata[];
};

type TGenerativeQA = {
  id: string;
  askedAt: Date;
  question: string;
  answer: string;
  rawAnswer: string;
  articles: TArticle[];
};

type TGetGenerativeQAInput = {
  question: string;
  size?: number;
};
type TReturnGetGenerativeQA = (
  input: TGetGenerativeQAInput
) => Promise<TGenerativeQA | LiteratureErrors.LiteratureValidationError | null>;

export type {
  THighlightHits,
  TArticle,
  TGenerativeQAResponse,
  TGenerativeQA,
  TReturnGetGenerativeQA,
  TGetGenerativeQAInput,
};
