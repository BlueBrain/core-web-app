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
  ArticleListResult,
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

const fetchAuthorSuggestions = (searchTerm: string): Promise<AuthorSuggestionResponse> => {
  const url = nexus.aiUrl;

  return fetch(`${url}/suggestions/author`, {
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
    .catch(() => [{ name: searchTerm, docs_in_db: 0 }] as AuthorSuggestionResponse);
};

export const fetchJournalSuggestions = (searchTerm: string): Promise<JournalSuggestionResponse> => {
  const url = nexus.aiUrl;

  return fetch(`${url}/suggestions/journal`, {
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
  brainRegionIds: string[]
) => {
  if (!accessToken) throw new Error('Access token should be defined');

  const mockRequest = new Promise<ExperimentDatasetCountPerBrainRegion>((resolve) => {
    setTimeout(() => {
      // TODO: We might need brain region title instead when the API is ready.
      brainRegionIds.map((brainRegionId) => `${brainRegionId}`);
      resolve({
        total: Math.floor(Math.random() * 30),
        experimentUrl: experimentType.id,
      });
    }, 1000);
  });

  return mockRequest;
};

const fetchArticlesForBrainRegionAndExperiment = (
  accessToken: string,
  experimentName: string,
  brainRegions: string[],
  offset: number,
  signal: AbortSignal
) => {
  if (!accessToken) throw new Error('Access token should be defined');
  const mockRequest = new Promise<ArticleListResult>((resolve, reject) => {
    setTimeout(() => {
      if (signal.aborted) {
        reject(new Error('Aborted'));
      }
      resolve({
        total: 100,
        results: [...Array(50).keys()].map((_, index) =>
          createMockArticle(
            `A Comparison of Neurotransmitter-Specific and Neuropeptide-Specific Neuronal Cell Types Present in the Dorsal Cortex in Turtles with Those Present in the Isocortex in Mammals: Implications for the Evolution of Isocortex; pp. 53–72 ${index}`,
            `${index}`,
            '… The neurons containing these substances in dor sal cortex in turtles were generally highlysimilar in morphology to their counterparts in mammalian isocortex. In contrast, neurons …'
          )
        ),
        offset,
      });
    }, 2000);
  });

  return mockRequest;
};

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
