import { Provider } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { usePathname } from 'next/navigation';

import { selectedBrainRegionAtom, literatureSelectedBrainRegionAtom } from '@/state/brain-regions';
import { literatureResultAtom } from '@/state/literature';
import { GenerativeQA, SucceededGenerativeQA } from '@/types/literature';
import { SelectedBrainRegion } from '@/state/brain-regions/types';
import { QAContainer } from '@/components/explore-section/Literature/components';
import { getGenerativeQA } from '@/components/explore-section/Literature/api';
import { getArticle } from '__tests__/__utils__/Literature';

const navigateBackMock = jest.fn();

jest.mock('next/navigation', () => ({
  __esModule: true,
  usePathname: jest.fn(),
  useSearchParams: jest.fn(),
  useRouter: () => ({
    replace: jest.fn(),
    back: navigateBackMock,
  }),
}));

jest.mock('@/components/explore-section/Literature/api.ts', () => {
  const actual = jest.requireActual('@/components/explore-section/Literature/api.ts');
  return {
    ...actual,
    getGenerativeQA: jest.fn(),
  };
});

describe('QAContainer', () => {
  beforeAll(() => {
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
    window.HTMLElement.prototype.scrollTo = jest.fn();
  });

  test('shows all QAs in build section by default', () => {
    renderComponent();
    expectQuestionToBeVisible(MatchingBrainRegionQuestion);
    expectQuestionToBeVisible(NoBrainRegionQuestion);
    expectQuestionToBeVisible(DifferentBrainRegionQuestion);
  });

  test('removes selected brain region when user toggles on "Ignore current context"', () => {
    renderComponent();
    expect(screen.getByTestId('selected-brain-region').innerHTML).toEqual(mockBrainRegion.title);

    fireEvent.click(searchInBrainRegionSwitch());

    expect(screen.queryByTestId('selected-brain-region')?.innerHTML).toEqual('All regions');
  });

  test('reuses previously selected brain region when user turns on the toggle', () => {
    renderComponent();
    expect(screen.getByTestId('selected-brain-region').innerHTML).toEqual(mockBrainRegion.title);

    fireEvent.click(searchInBrainRegionSwitch()); // Turn toggle off
    fireEvent.click(searchInBrainRegionSwitch()); // Turn toggle on

    expect(screen.getByTestId('selected-brain-region').innerHTML).toEqual(mockBrainRegion.title);
  });

  test('navigates back when "Back to configuration" button is clicked', () => {
    renderComponent();
    const backButton = screen.getByText('Back to configuration');
    fireEvent.click(backButton);
    expect(navigateBackMock).toHaveBeenCalled();
  });

  test('shows controls for brain regions in explore', () => {
    renderComponent('/explore/literature');

    expect(screen.getByTestId('selected-brain-region').innerHTML).toEqual(mockBrainRegion.title);
    expect(searchInBrainRegionSwitch()).toBeInTheDocument();
  });

  test('does not show back to configuration button in explore', () => {
    renderComponent('/explore/literature');

    expect(screen.queryByText(/Back to configuration/i)).not.toBeInTheDocument();
  });

  test('shows initial active filters count', async () => {
    renderComponent();

    const allActiveFilters = screen.getAllByTestId('active-filters');
    expect(allActiveFilters).toHaveLength(3);

    allActiveFilters.forEach((element) => {
      expect(element.textContent).toEqual('0filters');
    });
  });

  test('updates active filters count for selected question with filters', async () => {
    renderComponent();

    const [question1Filter, question2Filter, question3Filter] = screen.getAllByRole('button', {
      name: /filters/,
    });
    fireEvent.click(question1Filter);

    await applyFilter('Authors', 'Dr. Algernop Krieger');
    expect(question1Filter.textContent).toEqual('1filters');

    expect(question2Filter.textContent).toEqual('0filters');
    expect(question3Filter.textContent).toEqual('0filters');
  });

  test('resets count for previously selected question', async () => {
    renderComponent();

    const [question1Filter, question2Filter] = screen.getAllByRole('button', { name: /filters/ });

    fireEvent.click(question1Filter);
    await applyFilter('Authors', 'Dr. Algernop Krieger');
    expect(question1Filter.textContent).toEqual('1filters');

    fireEvent.click(question2Filter);
    expect(question1Filter.textContent).toEqual('0filters');
  });

  const applyFilter = async (inputName: string, optionToSelect: string) => {
    await showSuggestionsFor(inputName);
    await selectSuggestion(optionToSelect);
    fireEvent.click(screen.getByText('Apply'));
  };

  const selectSuggestion = async (optionLabel: string) => {
    fireEvent.click(
      screen.getByText(optionLabel, { selector: 'div.ant-select-item-option-content' })
    );
  };

  const click = (element: HTMLElement) => {
    act(() => {
      fireEvent.click(element);
      fireEvent.focus(element);
      fireEvent.mouseDown(element);
    });
  };

  const showSuggestionsFor = async (inputName: string) => {
    const collapsibleHeader = screen.getByRole('button', { name: new RegExp(inputName, 'i') });
    click(collapsibleHeader);

    const autocompleteInput = await screen.getByText(new RegExp(`Search for ${inputName}`, 'i'));
    click(autocompleteInput);
    return autocompleteInput;
  };

  const searchInBrainRegionSwitch = () => screen.getByLabelText('Ignore current context');

  const expectQuestionToBeVisible = (question: string) => {
    expect(screen.getByText(question, { selector: QuestionResultSelector })).toBeVisible();
    expect(screen.getByText(question, { selector: QuestionNavigationSelector })).toBeVisible();
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

  function QAContainerProvider(qa: GenerativeQA[], brainRegion: SelectedBrainRegion | null) {
    return (
      <TestProvider
        initialValues={[
          [literatureResultAtom, qa],
          [selectedBrainRegionAtom, brainRegion],
          [literatureSelectedBrainRegionAtom, brainRegion],
        ]}
      >
        <QAContainer />
      </TestProvider>
    );
  }

  const renderComponent = (path = '/build/literature') => {
    const selectedBrainRegion = { ...mockBrainRegion };
    const QAs: GenerativeQA[] = [
      mockQA({ question: NoBrainRegionQuestion, id: '1' }),
      mockQA({
        question: MatchingBrainRegionQuestion,
        brainRegion: { ...selectedBrainRegion },
        id: '2',
      }),
      mockQA({
        question: DifferentBrainRegionQuestion,
        brainRegion: {
          ...selectedBrainRegion,
          id: 'some other brain region',
          title: 'Different BR',
        },
        id: '3',
      }),
    ];

    (usePathname as jest.Mock).mockReturnValue(path);
    (getGenerativeQA as jest.Mock).mockImplementation((data: FormData) => {
      const requestedQuestion = String(data.get('gqa-question'));
      return Promise.resolve(QAs.find((q) => q.question === requestedQuestion));
    });
    return render(QAContainerProvider(QAs, selectedBrainRegion));
  };

  const QuestionNavigationSelector = 'div[data-testid="question-navigation-item"]';
  const QuestionResultSelector = 'span[data-testid="question-result"]';

  const MatchingBrainRegionQuestion = 'Matching brain region question';
  const NoBrainRegionQuestion = 'No brain region question';
  const DifferentBrainRegionQuestion = 'Different brain region question';

  const mockQA = (extra: Partial<GenerativeQA>): SucceededGenerativeQA => ({
    id: '1',
    askedAt: new Date(),
    question: 'How many neurons are there in brain',
    answer: '10k',
    rawAnswer: 'blah blah blah',
    articles: [getArticle(1, {}), getArticle(2, {}), getArticle(3, {})],
    isNotFound: false as any,
    streamed: true,
    ...extra,
  });

  const mockBrainRegion: SelectedBrainRegion = {
    id: 'Abducens nucleus',
    title: 'Abducens nucleus',
    leaves: null,
  };
});
