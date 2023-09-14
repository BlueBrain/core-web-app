import { fireEvent, render, screen } from '@testing-library/react';
import { useHydrateAtoms } from 'jotai/utils';
import { Provider } from 'jotai';
import { format } from 'date-fns';
import GenerativeQAInputBar from '@/components/explore-section/Literature/components/GenerativeQAInput';
import sessionAtom from '@/state/session';
import { ArticleTypeSuggestion, AuthorSuggestionResponse } from '@/types/literature';

jest.mock('@/components/explore-section/Literature/api.ts', () => ({
  _esModule: true,
  fetchAuthorSuggestions: jest.fn().mockImplementation(
    () =>
      new Promise((resolve) => {
        resolve(mockAuthors);
      })
  ),
}));

jest.mock('@/components/explore-section/Literature/actions.ts', () => ({
  __esModule: true,
  getGenerativeQAAction: jest.fn(),
  getArticleTypes: jest.fn().mockImplementation(
    () =>
      new Promise((resolve) => {
        resolve(mockArticleTypes);
      })
  ),
}));

describe('GenerativeQAInput', () => {
  beforeEach(() => {
    render(GenerativeQAInputProvider());
  });

  test('shows input for typing question', () => {
    const questionInput = screen.getByPlaceholderText('Send your question');
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

  test('hides normal send button when the user clicks on refine question button', () => {
    typeQuestion(defaultQuestion);
    expect(sendQuestionWithoutParamsButton()).toBeVisible();

    openRefineSearchPanel();

    expect(sendQuestionWithoutParamsButton()).toBeFalsy();
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

    await selectSuggestion('paper');
    await selectSuggestion('journal paper');

    expectOptionsToBeSelected(['paper', 'journal paper']);
    expectOptionsNotToBeSelected(['abstract']);
  });

  const sendQuestionWithoutParamsButton = () => screen.queryByRole('button', { name: 'send' });

  const sendRefinedQuestionButton = (
    queryType: 'fail-if-not-found' | 'undefined-if-not-found' = 'fail-if-not-found'
  ) => {
    if (queryType === 'fail-if-not-found') {
      return screen.getByRole('button', { name: 'Search send' });
    }
    return screen.queryByRole('button', { name: 'Search send' });
  };

  const typeQuestion = (question: string) => {
    const questionInput = screen.getByPlaceholderText('Send your question');
    fireEvent.change(questionInput, { target: { value: question } });
  };

  const selectTodayAsDate = (type: 'start' | 'end') => {
    const dateInput = screen.getByPlaceholderText(type === 'start' ? 'Start date' : 'End date');
    fireEvent.mouseDown(dateInput);
    fireEvent.click(dateInput);

    const today = format(new Date(), 'yyyy-MM-dd');

    const todayCell = document.querySelector(`td[title="${today}"]`)!;
    expect(todayCell).toBeInTheDocument();
    fireEvent.click(todayCell);

    const dateInputAfter = screen.getByPlaceholderText(
      type === 'start' ? 'Start date' : 'End date'
    );
    expect(dateInputAfter).toHaveValue(today);

    const questionInput = screen.getByPlaceholderText('Send your question');
    fireEvent.click(questionInput);
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
    const authorInput = screen.getByLabelText(inputName, { selector: 'input' });
    fireEvent.change(authorInput, { target: { value: text } });
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

const createMockOption = (name: string) => ({
  name,
  docs_in_db: 1,
});

const mockAuthors: AuthorSuggestionResponse = [
  createMockOption('Sterling Archer'),
  createMockOption('Lana Kane'),
  createMockOption('Cheryl Tunt'),
  createMockOption('Malory Archer'),
  createMockOption('Dr. Krieger'),
];

const mockArticleTypes: ArticleTypeSuggestion[] = [
  { articleType: 'abstract', docCount: 1 },
  { articleType: 'journal paper', docCount: 1 },
  { articleType: 'paper', docCount: 1 },
];
