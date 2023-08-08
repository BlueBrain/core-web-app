import * as LiteratureErrors from './errors';

type HighlightHit = {
  start: number;
  end: number;
};

type GArticle = {
  id: string;
  doi: string;
  title: string;
  authors: string[];
  journal: string;
  paragraph: string;
  section: string;
  abstract: string | string[];
};

type GenerativeQAMetadata = {
  article_id: string;
  article_doi: string;
  article_title: string;
  article_authors: string[];
  article_abstract: string | string[];
  section: string;
  paragraph: string;
};

type GenerativeQAResponse = {
  answer: string;
  raw_answer: string;
  paragraphs: string[];
  metadata: GenerativeQAMetadata[];
};

type GenerativeQA = {
  id: string;
  askedAt: Date;
  question: string;
  answer: string;
  rawAnswer: string;
  articles: GArticle[];
};

type GetGenerativeQAInput = {
  question: string;
  size?: number;
};
type ReturnGetGenerativeQA = (
  input: GetGenerativeQAInput
) => Promise<GenerativeQA | LiteratureErrors.LiteratureValidationError | null>;

export type {
  HighlightHit,
  GArticle,
  GenerativeQAResponse,
  GenerativeQA,
  ReturnGetGenerativeQA,
  GetGenerativeQAInput,
};
