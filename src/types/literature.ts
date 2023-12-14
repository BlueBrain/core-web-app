import { Filter, GteLteValue } from '@/components/Filter/types';
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
  ds_document_id: string;
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
  code: number;
  detail: string;
  raw_answer?: string;
};

export type GenerativeQAResponse =
  | GenerativeQAWithDataResponse
  | { Error: GenerativeQAWithoutDataResponse };
export type SelectedBrainRegionPerQuestion = Pick<SelectedBrainRegion, 'id' | 'title'>;
export type BuildStepPath =
  | 'cell-composition'
  | 'cell-model-assignment'
  | 'connectome-definition'
  | 'connectome-model-assignment';

export interface BaseGenerativeQA {
  id: string;
  chatId?: string;
  askedAt: Date;
  question: string;
  brainRegion?: SelectedBrainRegionPerQuestion;
  streamed: boolean;
}
export interface SucceededGenerativeQA extends BaseGenerativeQA {
  isNotFound: false;
  answer: string;
  rawAnswer: string;
  articles: GArticle[];
  extra?: {
    parameter: 'Etype | MType';
    buildStep: BuildStepPath;
    DensityOrCount?: 'density' | 'count';
  };
}
export interface FailedGenerativeQA extends BaseGenerativeQA {
  isNotFound: true;
  statusCode: string;
  details: string;
  rawRanswer?: string;
}

export type GenerativeQA = SucceededGenerativeQA | FailedGenerativeQA;

export type GenerativeQADTO = { question: string; questionId: string; askedAt: Date } & (
  | {
      isNotFound: false;
      response: GenerativeQAWithDataResponse;
    }
  | {
      isNotFound: true;
      response: GenerativeQAWithoutDataResponse;
    }
);

export type GetGenerativeQAInput = {
  question: string;
  size?: number;
  brainRegions?: string[];
  fromDate?: string;
  endDate?: string;
  journals?: Suggestion[];
  authors?: string[];
  articleTypes?: string[];
  signal?: AbortSignal;
};

export type GenerativeQAServerResponse =
  | {
      success: true;
      question: string;
      data: GenerativeQAWithDataResponse;
    }
  | {
      success: false;
      question: string;
      error: GenerativeQAWithoutDataResponse;
    };

export type ReturnGetGenerativeQA = (input: GetGenerativeQAInput) => Promise<Response | Error>;

export type JournalSuggestionResponse = {
  title: string;
  citescore: number;
  eissn: string;
  print_issn: string;
}[];

export type AuthorSuggestionResponse = {
  name: string;
  docs_in_db: number;
}[];

export type ArticleTypeSuggestionResponse = {
  article_type: string;
  docs_in_db: number;
}[];

export type ArticleTypeSuggestion = {
  articleType: string;
  docCount: number;
};

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

export type QuestionAbout = 'EType' | 'MType' | 'gsyn' | 'nrrp' | 'f' | 'u' | 'd' | 'dtc';
export type ContextQAItem = {
  key: string;
  value: JSX.Element;
  gqa?: GenerativeQA;
};

export type ContextualLiteratureAtom = {
  key?: React.Key;
  about?: QuestionAbout;
  subject?: string;
  densityOrCount?: 'density' | 'count';
  drawerOpen?: boolean;
  currentQuestion?: string;
};

export type BuildQuestionInput = {
  about: QuestionAbout;
  brainRegionTitle: string;
  step: string;
  subject: string;
  densityOrCount?: 'density' | 'count';
};

export type Suggestion = {
  key: string;
  label: string;
  value: string;
};

export type QuestionParameters = {
  selectedDate: GteLteValue;
  selectedJournals: Suggestion[];
  selectedAuthors: string[];
  selectedArticleTypes: string[];
};
