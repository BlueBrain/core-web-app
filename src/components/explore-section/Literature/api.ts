import * as LiteratureErrors from './errors';
import {
  GenerativeQAResponse,
  ReturnGetGenerativeQA,
  AuthorSuggestionResponse,
} from '@/types/literature';
import { nexus } from '@/config';
import { createHeaders } from '@/util/utils';

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
    articleTypes?.forEach((articleType) => params.append('aritcle_types', articleType));

    if (fromDate) {
      params.append('date_from', fromDate);
    }
    if (endDate) {
      params.append('date_to', endDate);
    }

    const urlQueryParams = params.toString().length > 0 ? `?${params.toString()}` : '';
    const url = `${nexus.aiUrl}/generative_qa${urlQueryParams}`;
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

const fetchArticleTypes = (
  accessToken: string
): Promise<{ article_type: string; docs_in_db: number }[]> => {
  const url = nexus.aiUrl;

  return fetch(`${url}/article_types`, {
    method: 'GET',
    headers: createHeaders(accessToken),
  })
    .then((response: any) => response.json())
    .catch(() => []);
};

const fetchAuthorSuggestions = (
  searchTerm: string,
  accessToken: string
): Promise<AuthorSuggestionResponse> => {
  const url = nexus.aiUrl;

  return fetch(`${url}/author_suggestion`, {
    method: 'POST',
    headers: createHeaders(accessToken),
    body: JSON.stringify({
      name: searchTerm,
      limit: 100,
    }),
  })
    .then((response: any) => response.json() as AuthorSuggestionResponse)
    .catch(() => [{ name: searchTerm, docs_in_db: 0 }] as AuthorSuggestionResponse);
};

export const fetchJournalSuggestions = (searchTerm: string, accessToken: string) => {
  const url = nexus.aiUrl;

  return fetch(`${url}/journal_suggestion`, {
    method: 'POST',
    headers: createHeaders(accessToken),
    body: JSON.stringify({
      keywords: searchTerm,
      limit: 100,
    }),
  })
    .then((response: any) => response.json())
    .catch(() => []);
};

export { getGenerativeQA, fetchArticleTypes, fetchAuthorSuggestions };
