import {
  ReturnGetGenerativeQA,
  AuthorSuggestionResponse,
  JournalSuggestionResponse,
} from '@/types/literature';
import { bbsMlBaseUrl } from '@/config';
import {
  ArticleItem,
  ArticleListingResponse,
  ExperimentDatasetCountPerBrainRegion,
} from '@/api/explore-section/resources';

const getGenerativeQA: ReturnGetGenerativeQA = async ({
  question,
  keywords,
  fromDate,
  endDate,
  journals,
  authors,
  articleTypes,
  signal,
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
    const url = `${bbsMlBaseUrl}/qa/streamed_generative${urlQueryParams}`;
    const response = await fetch(url, {
      signal,
      method: 'POST',
      headers: new Headers({
        accept: 'text/event-stream',
        'Content-Type': 'application/json',
        'cache-control': 'no-cache',
      }),
      body: JSON.stringify({
        query: question,
        retriever_k: 700,
        use_reranker: true,
      }),
    });

    return response;
  } catch (error: unknown) {
    throw new Error((error as Error).message);
  }
};

const fetchArticleTypes = (): Promise<{ article_type: string; docs_in_db: number }[]> => {
  return fetch(`${bbsMlBaseUrl}/suggestions/article_types`, {
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
  return fetch(`${bbsMlBaseUrl}/suggestions/author`, {
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
  return fetch(`${bbsMlBaseUrl}/suggestions/journal`, {
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

  const url = bbsMlBaseUrl;
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
  page: number,
  signal?: AbortSignal
): Promise<{ articles: ArticleItem[]; total: number; currentPage: number; pages: number }> => {
  if (!accessToken) throw new Error('Access token should be defined');

  const url = bbsMlBaseUrl;
  const brainRegionParams = brainRegions
    .map((name) => encodeURIComponent(name.toLowerCase()))
    .join('&regions=');
  const maxResults = 100;

  return fetch(
    `${url}/retrieval/article_listing?number_results=${maxResults}&topics=${encodeURIComponent(
      experimentName
    )}&regions=${brainRegionParams}&page=${page}`,
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
          } as ArticleItem)
      );
      return {
        articles,
        total,
        pages,
        currentPage,
      };
    });
};

export {
  getGenerativeQA,
  fetchArticleTypes,
  fetchAuthorSuggestions,
  fetchParagraphCountForBrainRegionAndExperiment,
  fetchArticlesForBrainRegionAndExperiment,
};
