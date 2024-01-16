import { fireEvent, render, screen } from '@testing-library/react';
import { useHydrateAtoms } from 'jotai/utils';
import { Provider } from 'jotai';

import { GArticle, GenerativeQA } from '@/types/literature';
import { literatureAtom, literatureResultAtom } from '@/state/literature';
import FilterPanel from '@/components/explore-section/Literature/components/FilterPanel';

describe('GenerativeQAResults', () => {
  beforeAll(() => {
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
    window.HTMLElement.prototype.scrollTo = jest.fn();
  });

  it('shows exhaustive filter suggestions for authors', () => {
    renderComponent([
      getArticle(1, { authors: ['Malory Archer', 'Woodhouse'] }),
      getArticle(1, { authors: ['Pam Poovey'] }),
      getArticle(1, { authors: ['Sterling Archer', 'Cheryl Tunt'] }),
    ]);

    showSuggestionsFor('Authors');

    expectSuggestionsToBeVisible([
      'Malory Archer',
      'Woodhouse',
      'Pam Poovey',
      'Sterling Archer',
      'Cheryl Tunt',
    ]);
  });

  it('shows matching suggestions as user starts typing', () => {
    renderComponent([
      getArticle(1, { authors: ['Malory Archer', 'Woodhouse'] }),
      getArticle(1, { authors: ['Pam Poovey'] }),
      getArticle(1, { authors: ['Sterling Archer', 'Cheryl Tunt'] }),
    ]);

    const searhcTerm = 'Archer';
    const authorInput = showSuggestionsFor('Authors');
    fireEvent.change(authorInput, { target: { value: searhcTerm } });

    expectSuggestionsToBeVisible(['Malory Archer', 'Sterling Archer']);
  });

  const renderComponent = (articles: GArticle[]) => render(FilterPanelProvider(articles));

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

  function FilterPanelProvider(articles: GArticle[]) {
    const qa: GenerativeQA[] = [
      {
        id: '1',
        askedAt: new Date(),
        question: 'How many neurons are there in brain',
        answer: '10k',
        rawAnswer: 'blah blah blah',
        isNotFound: false,
        articles,
        streamed: true,
      },
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
        ]}
      >
        <FilterPanel />
      </TestProvider>
    );
  }

  const DropdownOptionSelector = 'div.ant-select-item-option-content';

  const expectSuggestionsToBeVisible = (expectedSuggestions: string[]) => {
    const actualSuggestions = document.querySelectorAll(DropdownOptionSelector);
    expect(actualSuggestions).toHaveLength(expectedSuggestions.length);

    expectedSuggestions.forEach((suggestion) => {
      screen.getByText(suggestion, { selector: DropdownOptionSelector });
    });
  };

  const showSuggestionsFor = (inputName: string) => {
    const collapsibleHeader = screen.getByRole('button', { name: new RegExp(inputName, 'i') });
    fireEvent.click(collapsibleHeader);

    const autocompleteInput = document.querySelector('input')!;
    fireEvent.click(autocompleteInput);
    fireEvent.focus(autocompleteInput);
    fireEvent.mouseDown(autocompleteInput);
    return autocompleteInput;
  };
});

const getArticle = (id: number, extra: Partial<GArticle>): GArticle => {
  const randomId = getRandomID();
  return {
    id: `${id}`,
    doi: `doi - ${randomId}`,
    title: `Title ${randomId}`,
    authors: ['Malory Archer', 'Dr. Algernop Krieger'],
    journal: 'Kreiger experiments',
    paragraph:
      'The effects of the Krieger Kleanse are, as described, vivid "mind shredding" hallucinations, followed by a near-comatose state.',
    paragraphId: `paragraph ${randomId}`,
    section: 'The experiments are done in 3 stages: Pigley I, Pigley II, and Piggley III',
    abstract: 'Results of strong irradiation by plutonium rods on a pig',
    articleType: 'editorial notes',
    publicationDate: '2023-02-20',
    citationsCount: 2,
    impactFactor: 3,
    ...extra,
  };
};

const MIN_ID = 100;
const MAX_ID = 201;

// The maximum is exclusive and the minimum is inclusive
const getRandomID = (minId = MIN_ID, maxId = MAX_ID) => {
  const min = Math.ceil(minId);
  const max = Math.floor(maxId);
  return Math.floor(Math.random() * (max - min) + min);
};
