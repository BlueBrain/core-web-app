import { fireEvent, render, screen } from '@testing-library/react';
import { useHydrateAtoms } from 'jotai/utils';
import { Provider } from 'jotai';
import { format } from 'date-fns';
import GenerativeQAInputBar from '@/components/explore-section/Literature/components/GenerativeQAInput';

jest.mock('@/components/explore-section/Literature/actions.ts', () => ({
  __esModule: true,
  getGenerativeQAAction: jest.fn(),
}));

fdescribe('GenerativeQAInput', () => {
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

  const sendQuestionWithoutParamsButton = () => screen.queryByRole('button', { name: 'send' });

  const sendRefinedQuestionButton = () => screen.getByRole('button', { name: 'Search send' });

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
      <TestProvider initialValues={[]}>
        <GenerativeQAInputBar />
      </TestProvider>
    );
  }

  const autocompletePlaceholderSelector = '.ant-select-selection-placeholder';
  const defaultQuestion = "'How many neurons are there in the brain?'";
});
