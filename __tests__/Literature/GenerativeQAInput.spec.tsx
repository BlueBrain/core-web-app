import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useHydrateAtoms } from 'jotai/utils';
import { Provider } from 'jotai';
import startCase from 'lodash/startCase';
import GenerativeQAInputBar from '@/components/explore-section/Literature/components/GenerativeQAInput';
import sessionAtom from '@/state/session';
import { AuthorSuggestionResponse, JournalSuggestionResponse } from '@/types/literature';
import { normalizeString } from '@/util/utils';
import { selectTodayAsDate } from '__tests__/__utils__/utils';

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
  beforeEach(() => {
    render(GenerativeQAInputProvider());
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

    const searchBtn = sendRefinedQuestionButton();
    expect(searchBtn).toBeDisabled();
  });

  test('shows search button as enabled if the user typed a question', () => {
    openRefineSearchPanel();

    typeQuestion(defaultQuestion);
    selectTodayAsDate('start');

    const searchBtn = sendRefinedQuestionButton();
    expect(searchBtn).toBeEnabled();
  });

  test('shows both, normal send button and refined question button when user opens search panel', () => {
    typeQuestion(defaultQuestion);
    expect(sendQuestionWithoutParamsButton()).toBeVisible();

    openRefineSearchPanel();

    expect(sendQuestionWithoutParamsButton()).toBeVisible();
    expect(sendRefinedQuestionButton()).toBeVisible();
  });

  test('closes parameters panel when user clicks the close button', () => {
    openRefineSearchPanel();

    typeQuestion(defaultQuestion);
    expect(sendRefinedQuestionButton()).toBeVisible();

    closeRefineSearchPanel();

    expect(sendRefinedQuestionButton('undefined-if-not-found')).toBeFalsy();
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

    expectOptionsToBeSelected(['paper', 'journal paper'].map(startCase));
    expectOptionsNotToBeSelected(['abstract'].map(startCase));
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

  const sendQuestionWithoutParamsButton = () => screen.queryByRole('button', { name: 'send' });

  const sendRefinedQuestionButton = (
    queryType: 'fail-if-not-found' | 'undefined-if-not-found' = 'fail-if-not-found'
  ) => {
    if (queryType === 'fail-if-not-found') {
      return screen.getByRole('button', { name: 'Search send' });
    }
    return screen.queryByRole('button', { name: 'Search' });
  };

  const typeQuestion = (question: string) => {
    const questionInput = screen.getByPlaceholderText('Your question');
    fireEvent.change(questionInput, { target: { value: question } });
  };

  const openRefineSearchPanel = () => {
    const refineSearchButton = screen.getByRole('button', { name: 'Parameters' });
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

  const expectOptionsToBeSelected = (options: string[]) => {
    options.forEach((option) => {
      expect(
        screen.getByText(option, { selector: '.ant-select-selection-item-content' })
      ).toBeVisible();
    });
  };

  const expectOptionsNotToBeSelected = (options: string[]) => {
    options.forEach((option) => {
      expect(
        screen.queryByText(option, { selector: '.ant-select-selection-item-content' })
      ).toBeFalsy();
    });
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

const createMockAuthor = (name: string) => ({
  name,
  docs_in_db: 1,
});

export const mockAuthors: AuthorSuggestionResponse = [
  createMockAuthor('Sterling Archer'),
  createMockAuthor('Lana Kane'),
  createMockAuthor('Cheryl Tunt'),
  createMockAuthor('Malory Archer'),
  createMockAuthor('Dr. Krieger'),
];

const mockArticleResponse: { article_type: string; docs_in_db: number }[] = [
  { article_type: 'abstract', docs_in_db: 1 },
  { article_type: 'journal-paper', docs_in_db: 1 },
  { article_type: 'paper', docs_in_db: 1 },
];

const createMockJournal = (title: string, index: number) => ({
  title,
  citescore: 1,
  eissn: `${index}`,
  print_issn: `${index}`,
});

const mockJournals: JournalSuggestionResponse = [
  createMockJournal('Science', 1),
  createMockJournal('BioTech', 2),
  createMockJournal('NeuroScience', 3),
  createMockJournal('Biology', 4),
  createMockJournal('Botany', 5),
];
