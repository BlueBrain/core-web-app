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
  journalISSN?: string;
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
  journal_name?: string;
  journal_issn?: string;
  cited_by?: number;
  impact_factor?: number;
  abstract?: string;
};
export type GenerativeQAWithDataResponse = {
  answer: string;
  raw_answer: string;
  paragraphs: string[];
  metadata: GenerativeQAMetadata[];
};
export type GenerativeQAWithoutDataResponse = {
  detail: string;
};
export type GenerativeQAResponse = GenerativeQAWithDataResponse | GenerativeQAWithoutDataResponse;
export type SelectedBrainRegionPerQuestion = Pick<SelectedBrainRegion, 'id' | 'title'>;
export type BuildStepPath =
  | 'cell-composition'
  | 'cell-model-assignment'
  | 'connectome-definition'
  | 'connectome-model-assignment';

export type GenerativeQA = {
  id: string;
  askedAt: Date;
  question: string;
  answer: string;
  rawAnswer: string;
  brainRegion?: SelectedBrainRegionPerQuestion;
  articles: GArticle[];
  isNotFound: boolean;
  extra?: {
    parameter: 'Etype | MType';
    buildStep: BuildStepPath;
    DensityOrCount?: 'density' | 'count';
  };
};

export type GetGenerativeQAInput = {
  session: Session | null;
  question: string;
  size?: number;
  keywords?: string[];
  fromDate?: string;
  endDate?: string;
  journals?: string[];
};
export type GenerativeQAServerResponse = {
  question: string;
  response: GenerativeQAResponse;
};
export type ReturnGetGenerativeQA = (
  input: GetGenerativeQAInput
) => Promise<GenerativeQAServerResponse | LiteratureErrors.LiteratureValidationError | null>;

export type JournalSuggestionResponse = {
  title: string;
  citescore: number;
  eissn: string;
  print_issn: string;
}[];

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

export type QuestionAbout = 'EType' | 'MType';
export type ContextQAItem = {
  key: string;
  value: JSX.Element;
  gqa?: GenerativeQA;
};

export type ContextualLiteratureAtom = {
  key?: React.Key;
  about?: QuestionAbout;
  subject?: string;
  contextDrawerOpen?: boolean;
  contextQuestions?: Array<ContextQAItem>;
  densityOrCount?: 'density' | 'count';
  currentQuestion?: ContextQAItem | null;
};

export type BuildQuestionInput = {
  about: QuestionAbout;
  brainRegionTitle: string;
  step: string;
  subject: string;
  densityOrCount?: 'density' | 'count';
};

/**
 * for now their is no way to check if the answer is acceptable or not (the backend is working on that)
 * to check if the answer is good, we have to exclude this two possible response
 * answer is in the response and it has content
 * or the raw_answer is exist and it has content
 * @param gqa server response
 * @returns if the response is considered as generative answer
 */
export function isGenerativeQA(gqa: GenerativeQAServerResponse) {
  if (
    gqa &&
    (('answer' in gqa.response && gqa.response.answer && !!gqa.response.answer.length) ||
      ('raw_answer' in gqa.response && gqa.response.raw_answer && !!gqa.response.raw_answer.length))
  )
    return true;
  return false;
}

/**
 * for now their is no way to check if the answer is acceptable or not (the backend is working on that)
 * to check if the answer is not good, we have to exclude this two possible response
 * detail is in the response
 * or the raw_answer is empty and metadata is empty
 * @param gqa server response
 * @returns if the response is considered as not generative answer
 */
export function isGenerativeQANoFound(gqa: GenerativeQAServerResponse) {
  if (
    gqa &&
    ('detail' in gqa.response ||
      ('metadata' in gqa.response &&
        gqa.response.metadata &&
        !gqa.response.metadata.length &&
        'raw_answer' in gqa.response &&
        gqa.response.raw_answer &&
        !gqa.response.raw_answer.length))
  )
    return true;
  return false;
}
