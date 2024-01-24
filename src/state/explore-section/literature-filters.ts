import { atom } from 'jotai';

import {
  ArticleListFilters,
  fetchArticleTypes,
  fetchAuthorSuggestions,
  fetchJournalSuggestions,
  getAuthorOptions,
  getJournalOptions,
} from '@/components/explore-section/Literature/api';
import { ArticleTypeSuggestionResponse, Suggestion } from '@/types/literature';

export const articleListingFilterPanelOpenAtom = atom(false);

export const initialFilters: ArticleListFilters = {
  publicationDate: null,
  authors: [],
  journals: [],
  articleTypes: [],
};

export const articleListFiltersAtom = atom<ArticleListFilters>(initialFilters);

/**
 * Fetches (& caches) author suggestions that are shown in literautre q/a page and article listing page when user
 * hasn't typed anything (i.e.searchTerm = '') in author search input.
 */
export const initialAuthorSuggestionsAtom = atom<Promise<Suggestion[]>>(async () => {
  try {
    const initialAuthorSuggestionResponse = await fetchAuthorSuggestions('');
    return getAuthorOptions(initialAuthorSuggestionResponse);
  } catch (err) {
    return [];
  }
});

/**
 * Fetches (& caches) journal suggestions that are shown in literautre q/a page and article listing page when user
 * hasn't typed anything (i.e.searchTerm = '') in journal search input.
 */
export const initialJournalSuggestionsAtom = atom<Promise<Suggestion[]>>(async () => {
  try {
    const initialJournalSuggestionResponse = await fetchJournalSuggestions('');
    return getJournalOptions(initialJournalSuggestionResponse);
  } catch (err) {
    return [];
  }
});

/**
 * Fetches all article types (~30) from the ML server.
 */
export const articleTypeSuggestionsAtom = atom<Promise<ArticleTypeSuggestionResponse>>(async () => {
  try {
    const articleTypeResponse = await fetchArticleTypes();
    return articleTypeResponse;
  } catch (err) {
    return [];
  }
});
