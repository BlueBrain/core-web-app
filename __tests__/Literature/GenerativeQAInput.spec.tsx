import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useHydrateAtoms } from 'jotai/utils';
import { Provider } from 'jotai';
import startCase from 'lodash/startCase';
import GenerativeQAInputBar from '@/components/explore-section/Literature/components/GenerativeQAInput';
import sessionAtom from '@/state/session';
import { normalizeString } from '@/util/utils';
import { selectTodayAsDate } from '__tests__/__utils__/utils';
import { mockArticleResponse, mockAuthors, mockJournals } from '__tests__/__utils__/Literature';

jest.mock('@/components/explore-section/Literature/api.ts', () => {
  const actual = jest.requireActual('@/components/explore-section/Literature/api.ts');
  return {
    ...actual,
    fetchAuthorSuggestions: jest.fn().mockImplementation(
      (searchTerm: string) =>
        new Promise((resolve) => {
          if (!searchTerm) {
            resolve(mockAuthors);
          } else {
            const filtered = mockAuthors.filter((author) =>
              normalizeString(author.name).includes(normalizeString(searchTerm))
            );
            resolve(filtered);
          }
        })
    ),
    fetchJournalSuggestions: jest.fn().mockImplementation(
      (searchTerm: string) =>
        new Promise((resolve) => {
          if (!searchTerm) {
            resolve(mockJournals);
          } else {
            const filtered = mockJournals.filter((journal) =>
              normalizeString(journal.title).includes(normalizeString(searchTerm))
            );
            resolve(filtered);
          }
        })
    ),
    fetchArticleTypes: jest.fn().mockImplementation(
      () =>
        new Promise((resolve) => {
          resolve(mockArticleResponse);
        })
    ),
    getGenerativeQA: jest.fn(),
  };
});

jest.mock('next/navigation', () => {
  const actual = jest.requireActual('next/navigation');

  return {
    ...actual,
    usePathname: () => '',
    useSearchParams: () => {
      return {
        get: jest.fn(),
        set: jest.fn(),
      };
    },
    useRouter: () => ({
      push: () => jest.fn(),
      replace: () => jest.fn(),
    }),
  };
});

describe('GenerativeQAInput', () => {
  beforeEach(async () => {
    await waitFor(() => render(GenerativeQAInputProvider()));
  });

  test('shows input for typing question', () => {
    const questionInput = screen.getByPlaceholderText('Your question');
    expect(questionInput).toBeVisible();
  });

  test('shows date range input when user clicks on refine search', () => {
    openRefineSearchPanel();

    const startDateInput = screen.getByPlaceholderText('Start date');
    expect(startDateInput).toBeVisible();

    const endDateInput = screen.getByPlaceholderText('End date');
    expect(endDateInput).toBeVisible();

    const journalInput = screen.getByText('Journal', { selector: autocompletePlaceholderSelector });
    expect(journalInput).toBeVisible();
  });

  test('shows search button as disabled if the user hasnt typed a question', () => {
    openRefineSearchPanel();

    selectTodayAsDate('start');

    const searchBtn = sendQuestionButton();
    expect(searchBtn).toBeDisabled();
  });

  test('shows search button as enabled if the user typed a question', () => {
    openRefineSearchPanel();

    typeQuestion(defaultQuestion);
    selectTodayAsDate('start');

    const searchBtn = sendQuestionButton();
    expect(searchBtn).toBeEnabled();
  });

  test('shows only one search button when user opens advanced search panel', () => {
    typeQuestion(defaultQuestion);
    expect(screen.getAllByRole('button', { name: new RegExp('Search') })).toHaveLength(1);

    openRefineSearchPanel();

    expect(screen.getAllByRole('button', { name: new RegExp('Search') })).toHaveLength(1);
  });

  test('closes parameters panel when user clicks the close button', () => {
    openRefineSearchPanel();

    expect(document.querySelectorAll('input')).toHaveLength(5);

    closeRefineSearchPanel();

    expect(document.querySelectorAll('input')).toHaveLength(0);
  });

  test('selects authors from suggestions', async () => {
    openRefineSearchPanel();

    typeQuestion(defaultQuestion);

    typeInInput('Authors', 'Archer');

    await selectSuggestion('Sterling Archer');
    await selectSuggestion('Malory Archer');

    expectOptionsToBeSelected(['Sterling Archer', 'Malory Archer']);
    expectOptionsNotToBeSelected(['Lana Kane']);
  });

  test('selects article types from suggestions', async () => {
    openRefineSearchPanel();
    typeQuestion(defaultQuestion);

    typeInInput('Article Types', 'paper');

    await selectSuggestion('Paper');
    await selectSuggestion('Journal Paper');

    expectOptionsToBeSelected(['paper', 'journal-paper']);
    expectOptionsNotToBeSelected(['abstract']);
  });

  test('shows journal suggestions even if user has not started typing', async () => {
    openRefineSearchPanel();
    typeQuestion(defaultQuestion);

    focusOnInput('Journal');

    await waitFor(() => {
      mockJournals.forEach((journal) =>
        expect(screen.getByText(journal.title)).toBeInTheDocument()
      );
    });
  });

  test('shows only matching journal suggestions returned by api as user starts typing', async () => {
    openRefineSearchPanel();
    typeQuestion(defaultQuestion);

    const searchTerm = 'science';
    typeInInput('Journal', searchTerm);

    const nonMatchingJournalSuggestion = getSuggestions(
      searchTerm,
      mockJournals.map((j) => j.title),
      'no-match'
    );

    expect(nonMatchingJournalSuggestion.length).toBeGreaterThanOrEqual(1);
    await expectSuggestionsToNotBeVisible(nonMatchingJournalSuggestion);

    const matchingJournalSuggestions = getSuggestions(
      searchTerm,
      mockJournals.map((j) => j.title),
      'match'
    );

    expect(matchingJournalSuggestions.length).toBeGreaterThanOrEqual(1);
    await expectSuggestionsToBeVisible(matchingJournalSuggestions);
  });

  test('shows article type suggestions even if user has not started typing', async () => {
    openRefineSearchPanel();
    typeQuestion(defaultQuestion);

    focusOnInput('Article Types');

    await waitFor(() => {
      mockArticleResponse.forEach((type) =>
        expect(screen.getByText(startCase(type.article_type))).toBeInTheDocument()
      );
    });
  });

  test('shows only matching article types returned by api as user starts typing', async () => {
    openRefineSearchPanel();
    typeQuestion(defaultQuestion);

    const searchTerm = 'paper';
    typeInInput('Article Types', searchTerm);

    const nonMatchingArticleTypes = getSuggestions(
      searchTerm,
      mockArticleResponse.map((a) => a.article_type),
      'no-match'
    );

    expect(nonMatchingArticleTypes.length).toBeGreaterThanOrEqual(1);
    await expectSuggestionsToNotBeVisible(nonMatchingArticleTypes, true);

    const matchingArticleTypes = getSuggestions(
      searchTerm,
      mockArticleResponse.map((a) => a.article_type),
      'match'
    );

    expect(matchingArticleTypes.length).toBeGreaterThanOrEqual(1);
    await expectSuggestionsToBeVisible(matchingArticleTypes, true);
  });

  test('shows author suggestions even if user has not started typing', async () => {
    openRefineSearchPanel();
    typeQuestion(defaultQuestion);

    focusOnInput('Authors');

    await waitFor(() => {
      mockAuthors.forEach((author) => expect(screen.getByText(author.name)).toBeInTheDocument());
    });
  });

  test('shows only matching authors returned by api as user starts typing', async () => {
    openRefineSearchPanel();
    typeQuestion(defaultQuestion);

    const searchTerm = 'Archer';
    typeInInput('Authors', searchTerm);

    const nonMatchingAuthors = getSuggestions(
      searchTerm,
      mockAuthors.map((a) => a.name),
      'no-match'
    );

    expect(nonMatchingAuthors.length).toBeGreaterThanOrEqual(1);
    await expectSuggestionsToNotBeVisible(nonMatchingAuthors);

    const matchingAuthors = getSuggestions(
      searchTerm,
      mockAuthors.map((a) => a.name),
      'match'
    );

    expect(matchingAuthors.length).toBeGreaterThanOrEqual(1);
    await expectSuggestionsToBeVisible(matchingAuthors);
  });

  test('resets advanced search inputs when user clicks the close button', async () => {
    openRefineSearchPanel();
    typeQuestion(defaultQuestion);

    await fillInAdvancedSearchForm();

    closeRefineSearchPanel();
    expect(document.querySelectorAll('input')).toHaveLength(0);

    openRefineSearchPanel();
    await expectQAParamsToBeEmpty();
  });

  test('does not clear question when user closes advanced search panel', async () => {
    openRefineSearchPanel();
    typeQuestion(defaultQuestion);

    typeInInput('Article Types', 'paper');
    closeRefineSearchPanel();

    const questionInput = screen.getByPlaceholderText('Your question');
    expect(questionInput).toHaveValue(defaultQuestion);
  });

  const sendQuestionButton = (
    queryType: 'fail-if-not-found' | 'undefined-if-not-found' = 'fail-if-not-found'
  ) => {
    if (queryType === 'fail-if-not-found') {
      return screen.getByRole('button', { name: new RegExp('Search') });
    }
    return screen.queryByRole('button', { name: new RegExp('Search') });
  };

  const typeQuestion = (question: string) => {
    const questionInput = screen.getByPlaceholderText('Your question');
    fireEvent.change(questionInput, { target: { value: question } });
  };

  const openRefineSearchPanel = () => {
    const refineSearchButton = screen.getByRole('button', { name: 'Filter' });
    fireEvent.click(refineSearchButton);
  };

  const closeRefineSearchPanel = () => {
    const closePanelButton = screen.getByRole('button', { name: /close-parameters/i });
    fireEvent.click(closePanelButton);
  };

  const typeInInput = (inputName: string, text: string) => {
    const autocompleteInput = screen.getByLabelText(inputName, { selector: 'input' });
    fireEvent.change(autocompleteInput, { target: { value: text } });
  };

  const focusOnInput = (inputName: string) => {
    const autocompleteInput = screen.getByLabelText(inputName, { selector: 'input' });
    fireEvent.click(autocompleteInput);
    fireEvent.focus(autocompleteInput);
    fireEvent.mouseDown(autocompleteInput);
  };

  const expectSuggestionsToNotBeVisible = async (
    nonMatchingSuggestions: string[],
    useStartCase?: boolean
  ) => {
    await waitFor(() => {
      nonMatchingSuggestions.forEach((suggestion) =>
        expect(screen.queryByText(useStartCase ? startCase(suggestion) : suggestion)).toBeFalsy()
      );
    });
  };

  const expectSuggestionsToBeVisible = async (
    matchingSuggestions: string[],
    useStartCase?: boolean
  ) => {
    await waitFor(() => {
      matchingSuggestions.forEach((suggestion) =>
        expect(
          screen.getByRole('option', { name: useStartCase ? startCase(suggestion) : suggestion })
        ).toBeInTheDocument()
      );
    });
  };

  const getSuggestions = (
    searchTerm: string,
    allSuggestions: string[],
    criteria: 'match' | 'no-match'
  ) => {
    if (criteria === 'match') {
      return allSuggestions.filter((suggestion) =>
        normalizeString(suggestion).includes(normalizeString(searchTerm))
      );
    }
    return allSuggestions.filter(
      (suggestion) => !normalizeString(suggestion).includes(normalizeString(searchTerm))
    );
  };

  const selectSuggestion = async (optionLabel: string) => {
    const selectedAuthor = await screen.findByRole('option', { name: optionLabel });
    fireEvent.click(selectedAuthor);
    fireEvent.mouseDown(selectedAuthor);
  };

  const selectedOptionsSelector = '.ant-select-selection-item-content';

  const expectOptionsToBeSelected = (options: string[]) => {
    options.forEach((option) => {
      expect(
        // Exact match for "option" but ignore case.
        screen.getByText(new RegExp(`^${option}$`, 'i'), {
          selector: selectedOptionsSelector,
        })
      ).toBeVisible();
    });
  };

  const expectOptionsNotToBeSelected = (options: string[]) => {
    options.forEach((option) => {
      expect(screen.queryByText(option, { selector: selectedOptionsSelector })).toBeFalsy();
    });
  };

  const fillInAdvancedSearchForm = async () => {
    selectTodayAsDate('start');
    selectTodayAsDate('end');

    typeInInput('Article Types', 'paper');
    await selectSuggestion('Paper');

    typeInInput('Authors', 'Archer');
    await selectSuggestion('Sterling Archer');

    focusOnInput('Journal');
    await selectSuggestion('Biology');

    expectOptionsToBeSelected(['Sterling Archer', 'Paper', 'Biology']);
  };

  const expectQAParamsToBeEmpty = async () => {
    expect(document.querySelectorAll(selectedOptionsSelector)).toHaveLength(0);
    expect(screen.getByPlaceholderText('Start date') as HTMLInputElement).toHaveValue('');
    expect(screen.getByPlaceholderText('End date') as HTMLInputElement).toHaveValue('');
  };

  const HydrateAtoms = ({ initialValues, children }: any) => {
    useHydrateAtoms(initialValues);
    return children;
  };

  function TestProvider({ initialValues, children }: any) {
    return (
      <Provider>
        <HydrateAtoms initialValues={initialValues}>{children}</HydrateAtoms>
      </Provider>
    );
  }

  function GenerativeQAInputProvider() {
    return (
      <TestProvider initialValues={[[sessionAtom, { accessToken: 'abc' }]]}>
        <GenerativeQAInputBar />
      </TestProvider>
    );
  }

  const autocompletePlaceholderSelector = '.ant-select-selection-placeholder';
  const defaultQuestion = "'How many neurons are there in the brain?'";
});
