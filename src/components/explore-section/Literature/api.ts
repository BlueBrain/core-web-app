import * as LiteratureErrors from './errors';
import {
  GenerativeQAResponse,
  ReturnGetGenerativeQA,
  AuthorSuggestionResponse,
  JournalSuggestionResponse,
} from '@/types/literature';
import { nexus } from '@/config';
import {
  ArticleItem,
  ArticleListingResponse,
  ExperimentDatasetCountPerBrainRegion,
} from '@/api/explore-section/resources';

const getGenerativeQA: ReturnGetGenerativeQA = async ({
  question,
  session,
  keywords,
  fromDate,
  endDate,
  journals,
  authors,
  articleTypes,
}) => {
  try {
    const params = new URLSearchParams();
    keywords?.forEach((keyword) => params.append('keywords', keyword));
    journals?.forEach((journal) => params.append('journals', journal));
    authors?.forEach((author) => params.append('authors', author));
    articleTypes?.forEach((articleType) => params.append('article_types', articleType));

    if (fromDate) {
      params.append('date_from', fromDate);
    }
    if (endDate) {
      params.append('date_to', endDate);
    }

    const urlQueryParams = params.toString().length > 0 ? `?${params.toString()}` : '';
    const url = `${nexus.aiUrl}/qa/generative${urlQueryParams}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: new Headers({
        accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session?.accessToken}`,
      }),
      body: JSON.stringify({
        query: question,
      }),
    });
    const generativeQAResponse = (await response.json()) as GenerativeQAResponse;

    return {
      question,
      response: generativeQAResponse,
    };
  } catch (error: unknown) {
    if (error instanceof LiteratureErrors.LiteratureValidationError) {
      throw new LiteratureErrors.LiteratureValidationError(error.detail);
    }
    throw new Error((error as Error).message);
  }
};

const fetchArticleTypes = (): Promise<{ article_type: string; docs_in_db: number }[]> => {
  const url = nexus.aiUrl;

  return fetch(`${url}/suggestions/article_types`, {
    method: 'GET',
    headers: new Headers({
      accept: 'application/json',
      'Content-Type': 'application/json',
    }),
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
  const url = nexus.aiUrl;

  return fetch(`${url}/suggestions/author`, {
    signal,
    method: 'POST',
    headers: new Headers({
      accept: 'application/json',
      'Content-Type': 'application/json',
    }),
    body: JSON.stringify({
      name: searchTerm,
      limit: 100,
    }),
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
  const url = nexus.aiUrl;

  return fetch(`${url}/suggestions/journal`, {
    signal,
    method: 'POST',
    headers: new Headers({
      accept: 'application/json',
      'Content-Type': 'application/json',
    }),
    body: JSON.stringify({
      keywords: searchTerm,
      limit: 100,
    }),
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
  accessToken: string,
  experimentType: { name: string; id: string },
  brainRegionNames: string[],
  signal: AbortSignal
): Promise<ExperimentDatasetCountPerBrainRegion> => {
  if (!accessToken) throw new Error('Access token should be defined');

  const url = nexus.aiUrl;
  const brainRegionParams = brainRegionNames
    .map((name) => encodeURIComponent(name.toLowerCase()))
    .join('&regions=');

  return fetch(
    `${url}/retrieval/article_count?topics=${encodeURIComponent(
      experimentType.name
    )}&regions=${brainRegionParams}`,
    {
      signal,
      method: 'POST',
      headers: new Headers({
        accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    }
  )
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

const fetchArticlesForBrainRegionAndExperiment = (
  accessToken: string,
  experimentName: string,
  brainRegions: string[],
  signal: AbortSignal
): Promise<ArticleItem[]> => {
  if (!accessToken) throw new Error('Access token should be defined');

  const url = nexus.aiUrl;
  const brainRegionParams = brainRegions
    .map((name) => encodeURIComponent(name.toLowerCase()))
    .join('&regions=');
  const maxResults = 100;

  return fetch(
    `${url}/retrieval/article_listing?number_results=${maxResults}&topics=${encodeURIComponent(
      experimentName
    )}&regions=${brainRegionParams}`,
    {
      signal,
      method: 'POST',
      headers: new Headers({
        accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    }
  )
    .then((response: any) => {
      if (response.ok) {
        return response.json();
      }
      if (response.status === 404) {
        return [];
      }
      // Other 40X errors
      throw new Error(
        'There was an error retrieving literature data for the selected brain regions'
      );
    })
    .then((response: ArticleListingResponse) =>
      response.map(
        (articleResponse) =>
          ({
            doi: articleResponse.article_doi,
            abstract: articleResponse.abstract,
            title: articleResponse.article_title,
          } as ArticleItem)
      )
    );
};

// TODO: Move to spec file
export const createMockArticle = (title: string, doi: string, abstract: string): ArticleItem => ({
  title,
  doi,
  abstract,
});

export {
  getGenerativeQA,
  fetchArticleTypes,
  fetchAuthorSuggestions,
  fetchParagraphCountForBrainRegionAndExperiment,
  fetchArticlesForBrainRegionAndExperiment,
};
