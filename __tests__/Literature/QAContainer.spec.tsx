import { Provider } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';
import { fireEvent, render, screen } from '@testing-library/react';
import { usePathname } from 'next/navigation';

import { selectedBrainRegionAtom, literatureSelectedBrainRegionAtom } from '@/state/brain-regions';
import { literatureResultAtom } from '@/state/literature';
import { GenerativeQA, SucceededGenerativeQA } from '@/types/literature';
import { SelectedBrainRegion } from '@/state/brain-regions/types';
import { QAContainer } from '@/components/explore-section/Literature/components';
import { getGenerativeQA } from '@/components/explore-section/Literature/api';

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

  beforeEach(() => {
    renderComponent();
  });

  test('shows all QAs in build section by default', () => {
    expectQuestionToBeVisible(MatchingBrainRegionQuestion);
    expectQuestionToBeVisible(NoBrainRegionQuestion);
    expectQuestionToBeVisible(DifferentBrainRegionQuestion);
  });

  test('removes selected brain region when user toggles on "Ignore current context"', () => {
    expect(screen.getByTestId('selected-brain-region').innerHTML).toEqual(mockBrainRegion.title);

    fireEvent.click(searchInBrainRegionSwitch());

    expect(screen.queryByTestId('selected-brain-region')?.innerHTML).toEqual('All regions');
  });

  test('navigates back when "Back to configuration" button is clicked', () => {
    const backButton = screen.getByText('Back to configuration');
    fireEvent.click(backButton);
    expect(navigateBackMock).toHaveBeenCalled();
  });

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

  const renderComponent = () => {
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

    (usePathname as jest.Mock).mockReturnValue('/build/literature');
    (getGenerativeQA as jest.Mock).mockImplementation((data: FormData) => {
      const requestedQuestion = String(data.get('gqa-question'));
      return Promise.resolve(QAs.find((q) => q.question === requestedQuestion));
    });
    render(QAContainerProvider(QAs, selectedBrainRegion));
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
    articles: [],
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
