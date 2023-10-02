import * as LiteratureErrors from './errors';
import {
  GenerativeQAResponse,
  ReturnGetGenerativeQA,
  AuthorSuggestionResponse,
  JournalSuggestionResponse,
} from '@/types/literature';
import { nexus } from '@/config';

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

export { getGenerativeQA, fetchArticleTypes, fetchAuthorSuggestions };
