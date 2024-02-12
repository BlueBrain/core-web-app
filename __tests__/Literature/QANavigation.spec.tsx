import { render, screen } from '@testing-library/react';
import { useHydrateAtoms } from 'jotai/utils';
import { Provider } from 'jotai';

import { GenerativeQA } from '@/types/literature';
import { literatureAtom, literatureResultAtom } from '@/state/literature';
import { getArticle } from '__tests__/__utils__/Literature';
import QAHistoryNavigation from '@/components/explore-section/Literature/components/QANavigation';
import { brainRegionSidebarIsCollapsedAtom } from '@/state/brain-regions';

describe('QANavigation', () => {
  beforeAll(() => {
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
    window.HTMLElement.prototype.scrollTo = jest.fn();
  });

  it('shows question titles by default', () => {
    renderComponent({});
    expect(screen.getAllByText('How many neurons are there in brain')).toHaveLength(5);
  });

  it('replaces question titles with dots when brain region bar is expanded', () => {
    renderComponent({ brainRegionBarCollapsed: false });
    expect(screen.queryAllByText('How many neurons are there in brain')).toHaveLength(0);
    expect(screen.getAllByTestId('minimal-question-item')).toHaveLength(5);
  });

  it('shows question as title in the dot', () => {
    renderComponent({ brainRegionBarCollapsed: false });
    screen.getAllByTestId('minimal-question-item').forEach((dot) => {
      expect(dot.title).toEqual('How many neurons are there in brain');
    });
  });

  const renderComponent = ({ brainRegionBarCollapsed }: { brainRegionBarCollapsed?: boolean }) =>
    render(QANavigationProvider(brainRegionBarCollapsed ?? true));

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

  function QANavigationProvider(brainRegionBarCollapsed: boolean) {
    const qa: GenerativeQA[] = [
      getQuestion('1'),
      getQuestion('2'),
      getQuestion('3'),
      getQuestion('4'),
      getQuestion('5'),
    ];
    const literatureAtomInitialValues = {
      id: null,
      query: '',
      answer: '',
      selectedQuestionForFilter: '1',
      showOnlyBrainRegionQuestions: false,
      isFilterPanelOpen: true,
      filterValues: null,
      isGenerating: false,
    };

    return (
      <TestProvider
        initialValues={[
          [literatureResultAtom, qa],
          [literatureAtom, literatureAtomInitialValues],
          [brainRegionSidebarIsCollapsedAtom, brainRegionBarCollapsed],
        ]}
      >
        <QAHistoryNavigation />
      </TestProvider>
    );
  }
});

const getQuestion = (id: string): GenerativeQA => {
  return {
    id,
    isNotFound: false,
    askedAt: new Date(),
    question: 'How many neurons are there in brain',
    answer: '10k',
    rawAnswer: 'blah blah blah',
    articles: [getArticle(1, {})],
    streamed: true,
  };
};
