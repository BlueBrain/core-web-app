import { format } from 'date-fns';
import startCase from 'lodash/startCase';
import uniq from 'lodash/uniq';

import {
  ReturnGetGenerativeQA,
  AuthorSuggestionResponse,
  JournalSuggestionResponse,
  Suggestion,
  ArticleTypeSuggestionResponse,
} from '@/types/literature';
import { bbsMlBaseUrl } from '@/config';
import {
  ArticleItem,
  ArticleListingResponse,
  ExperimentDatasetCountPerBrainRegion,
} from '@/api/explore-section/resources';
import { GteLteValue } from '@/components/Filter/types';

const normalizeBrainRegionQueryParam = (region: string) =>
  region.toLowerCase().replace(': other', '');

const normalizeQueryParam = (term: string) => term.trim().toLowerCase();

const getGenerativeQA: ReturnGetGenerativeQA = async ({
  question,
  brainRegions,
  fromDate,
  endDate,
  journals,
  authors,
  articleTypes,
  signal,
}) => {
  try {
    const params = new URLSearchParams();

    const uniqueBrainRegions = uniq(
      brainRegions?.map((br) => encodeURIComponent(normalizeBrainRegionQueryParam(br)))
    );
    uniqueBrainRegions?.forEach((brainRegion) => params.append('regions', brainRegion));

    const paramsWithFilters = addQueryParamsForFilters(params, { authors, journals, articleTypes });

    if (fromDate) {
      paramsWithFilters.append('date_from', fromDate);
    }
    if (endDate) {
      paramsWithFilters.append('date_to', endDate);
    }

    const urlQueryParams =
      paramsWithFilters.toString().length > 0 ? `?${paramsWithFilters.toString()}` : '';

    const url = `https://ml.agent.kcp.bbp.epfl.ch/qa`;
    const response = await fetch(url, {
      signal,
      method: 'POST',
      headers: new Headers({
        accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        inputs: question,
        parameters: {},
        query: urlQueryParams,
      }),
    });

    const jsonResponse = await response.json();
    return jsonResponse;
  } catch (error: unknown) {
    throw new Error((error as Error).message);
  }
};

const ML_HEADERS = {
  accept: 'application/json',
  'Content-Type': 'application/json',
  'Cache-Control': 'max-age=604800', // 7 days
};

const fetchArticleTypes = (): Promise<ArticleTypeSuggestionResponse> => {
  return fetch(`${bbsMlBaseUrl}/suggestions/article_types`, {
    method: 'GET',
    headers: new Headers({ ...ML_HEADERS }),
  })
    .then((response: any) => {
      if (response.ok) {
        return response.json();
      }
      return [];
    })
    .catch(() => []);
};

const fetchAuthorSuggestions = (
  searchTerm: string,
  signal?: AbortSignal
): Promise<AuthorSuggestionResponse> => {
  return fetch(`${bbsMlBaseUrl}/suggestions/author?name=${searchTerm}&limit=100`, {
    signal,
    headers: new Headers({ ...ML_HEADERS }),
  })
    .then((response: any) => {
      if (response.ok) {
        return response.json();
      }
      return [];
    })
    .catch((e) => {
      if (e.name === 'AbortError') {
        throw e;
      }
      return [];
    });
};

export const fetchJournalSuggestions = (
  searchTerm: string,
  signal?: AbortSignal
): Promise<JournalSuggestionResponse> => {
  return fetch(`${bbsMlBaseUrl}/suggestions/journal?keywords=${searchTerm}&limit=100`, {
    signal,
    headers: new Headers({ ...ML_HEADERS }),
  })
    .then((response: any) => {
      if (response.ok) {
        return response.json();
      }
      return [];
    })
    .catch(() => []);
};

const fetchParagraphCountForBrainRegionAndExperiment = (
  experimentType: { name: string; id: string },
  brainRegion: string,
  signal: AbortSignal
): Promise<ExperimentDatasetCountPerBrainRegion> => {
  const params = new URLSearchParams();
  params.set('topics', normalizeQueryParam(experimentType.name));
  params.set('regions', normalizeBrainRegionQueryParam(brainRegion));

  return fetch(`${bbsMlBaseUrl}/retrieval/article_count?${params.toString()}`, {
    signal,
    headers: new Headers({ ...ML_HEADERS }),
  })
    .then((response: any) => {
      if (response.ok) {
        return response.json();
      }
      // 40X errors
      throw new Error(
        'There was an error retrieving literature data for the selected brain regions'
      );
    })
    .then((response) => ({
      total: response.article_count,
      experimentUrl: experimentType.id,
    }));
};

export const ML_DATE_FORMAT = 'yyyy-MM-dd';

export type ArticleListFilters = {
  publicationDate: GteLteValue | null;
  authors: string[];
  journals: Suggestion[];
  articleTypes: string[];
};

export const ML_MAX_ARTICLES_PER_PAGE = 100;

const fetchArticlesForBrainRegionAndExperiment = (
  experimentName: string,
  brainRegion: string,
  page: number,
  filters: ArticleListFilters,
  signal?: AbortSignal
): Promise<{ articles: ArticleItem[]; total: number; currentPage: number; pages: number }> => {
  const url = bbsMlBaseUrl;

  const params = new URLSearchParams();
  const encodedBrainRegions = brainRegion ? normalizeBrainRegionQueryParam(brainRegion) : '';

  params.set('number_results', `${ML_MAX_ARTICLES_PER_PAGE}`);
  params.set('topics', normalizeQueryParam(experimentName));
  params.set('regions', encodedBrainRegions);
  params.set('page', `${page}`);

  const paramsWithFilter = addQueryParamsForFilters(params, { ...filters });
  const urlQueryParams =
    paramsWithFilter.toString().length > 0 ? `?${paramsWithFilter.toString()}` : '';

  return fetch(`${url}/retrieval/article_listing${urlQueryParams}`, {
    signal,
    headers: new Headers({ ...ML_HEADERS }),
  })
    .then((response: any) => {
      if (response.status === 404) {
        return [];
      }

      return response.json();
    })
    .then((response: any) => {
      if (!response.items) {
        throw new Error(response.detail?.code, { cause: response.detail?.code });
      }
      const mlResponse = response as ArticleListingResponse;
      const { total, page: currentPage, pages } = mlResponse;
      const articles = mlResponse.items.map(
        (articleResponse) =>
          ({
            doi: articleResponse.article_doi,
            abstract: articleResponse.abstract,
            title: articleResponse.article_title,
            authors: articleResponse.article_authors ?? [],
            journalName: articleResponse.journal_name,
            publicationDate: articleResponse.date,
            citationCount: articleResponse.cited_by,
          }) as ArticleItem
      );
      return {
        articles,
        total,
        pages,
        currentPage,
      };
    });
};

const addQueryParamsForFilters = (
  params: URLSearchParams,
  { publicationDate, authors, journals, articleTypes }: Partial<ArticleListFilters>
) => {
  if (publicationDate?.gte) {
    params.append('date_from', format(publicationDate?.gte, ML_DATE_FORMAT));
  }
  if (publicationDate?.lte) {
    params.append('date_to', format(publicationDate?.lte, ML_DATE_FORMAT));
  }

  authors?.forEach((author) => params.append('authors', author));
  articleTypes?.forEach((articleType) => params.append('article_types', articleType));

  journals?.forEach((journal) => {
    const eIssn = getJournalEIssn(journal);
    const printIssn = getjournalPrintIssn(journal);

    params.append('journals', eIssn);

    if (eIssn !== printIssn) {
      params.append('journals', printIssn);
    }
  });
  return params;
};

const getAuthorOptions = (mlResponse: AuthorSuggestionResponse) =>
  mlResponse.map(
    (authorResponse) =>
      ({
        key: authorResponse.name,
        label: authorResponse.name,
        value: authorResponse.name,
      }) as Suggestion
  );

const getJournalOptions = (mlResponse: JournalSuggestionResponse) =>
  mlResponse.map((journalResponse, index) => ({
    key: journalResponse.eissn ?? journalResponse.print_issn ?? `${index}`,
    label: journalResponse.title,
    value: journalResponse.print_issn ?? journalResponse.eissn ?? `${index}`,
  }));

const getArticleTypeOptions = (mlResponse: ArticleTypeSuggestionResponse) =>
  mlResponse
    .filter((response) => !!response.article_type)
    .map(({ article_type }) => ({
      key: article_type,
      label: startCase(article_type),
      value: article_type,
    }));

const getJournalEIssn = (journal: Suggestion) => journal.key;
const getjournalPrintIssn = (journal: Suggestion) => journal.value;

export {
  getGenerativeQA,
  fetchArticleTypes,
  fetchAuthorSuggestions,
  fetchParagraphCountForBrainRegionAndExperiment,
  fetchArticlesForBrainRegionAndExperiment,
  getAuthorOptions,
  getJournalOptions,
  getArticleTypeOptions,
};
