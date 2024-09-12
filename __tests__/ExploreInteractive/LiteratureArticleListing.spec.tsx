import { useHydrateAtoms } from 'jotai/utils';
import { Provider } from 'jotai';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import isUndefined from 'lodash/isUndefined';
import userEvent, { UserEvent } from '@testing-library/user-event';
import LiteratureArticleListingPage from '@/app/explore/(interactive)/interactive/literature/[experiment-data-type]/page';
import { selectedBrainRegionAtom } from '@/state/brain-regions';
import { SelectedBrainRegion } from '@/state/brain-regions/types';
import { ArticleItem } from '@/api/explore-section/resources';
import { mockBrainRegions } from '__tests__/__utils__/SelectedBrainRegions';
import { DataType } from '@/constants/explore-section/list-views';
import { findButton, getButton, selectTodayAsDate } from '__tests__/__utils__/utils';
import { ARTICLES_PER_PAGE } from '@/components/explore-section/Literature/components/ArticleList/ArticlesListing';
import { mockArticleResponse, mockAuthors, mockJournals } from '__tests__/__utils__/Literature';
import { normalizeString } from '@/util/utils';
import { ArticleListFilters } from '@/components/explore-section/Literature/api';
import sessionAtom from '@/state/session';
import { articleListingFilterPanelOpenAtom } from '@/state/explore-section/literature-filters';
import { EXPERIMENT_DATA_TYPES } from '@/constants/explore-section/data-types/experiment-data-types';
import { DATA_TYPES_TO_CONFIGS } from '@/constants/explore-section/data-types';

const ML_DATE_FORMAT = 'yyyy-MM-dd';
const UI_DATE_FORMAT = 'dd-MM-yyyy';
const EXPERIMENT_TYPES_BTN = 'experiment-types-button';
const BrainRegionQueryParams = mockBrainRegions.at(1)?.id;
jest.setTimeout(20_000);

jest.mock('next/navigation', () => {
  const actual = jest.requireActual('next/navigation');

  return {
    ...actual,
    useParams: jest.fn(),
    useRouter: jest.fn(),
    notFound: jest.fn().mockReturnValue('Invalid experiment type selected.'),
  };
});

jest.mock('nuqs', () => ({
  ...jest.requireActual('nuqs'),
  useQueryState: (value: string) => {
    if (value === 'brainRegion') return [BrainRegionQueryParams, () => {}];
    if (value === 'brainRegionTitle') return [BrainRegionQueryParams, () => {}];
  },
}));

jest.mock('deepdash-es/standalone', () => ({
  __esModule: true,
  reduceDeep: (arr: any[]) => [arr],
  findDeep: (flatTree: any, findFn: any) => ({
    value: flatTree.find(findFn) ?? flatTree[0].items.find(findFn),
  }),
}));

const createMockArticle = (
  title: string,
  doi: string,
  abstract: string,
  date?: string
): ArticleItem => ({
  title,
  doi,
  abstract,
  authors: ['Cheryl Tunt', 'Malory Archer'],
  publicationDate: date ?? '2020-12-12',
});

const mockFetchArticlesForBrainRegionAndExperiment = jest.fn().mockImplementation(
  (experimentName, brainRegions, page: number, filters: ArticleListFilters) =>
    new Promise((resolve) => {
      const mockResponse: ArticleItem[] = [...Array(50).keys()].map((_, index) =>
        createMockArticle(
          `Mock title ${index}`,
          `${index}`,
          'Mock abstract',
          filters.publicationDate?.gte
            ? format(filters.publicationDate?.gte, ML_DATE_FORMAT)
            : undefined
        )
      );
      resolve({ articles: mockResponse, total: 100, currentPage: page, pages: 2 });
    })
);
const mockAuthorsSuggestions = jest.fn().mockImplementation(
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
);

jest.mock('src/components/explore-section/Literature/api.ts', () => {
  const actual = jest.requireActual('src/components/explore-section/Literature/api.ts');

  return {
    ...actual,
    fetchArticlesForBrainRegionAndExperiment: jest
      .fn()
      .mockImplementation((name, brainRegions, page: number, filters: ArticleListFilters) =>
        mockFetchArticlesForBrainRegionAndExperiment(name, brainRegions, page, filters)
      ),
    fetchAuthorSuggestions: jest
      .fn()
      .mockImplementation((searchTerm: string) => mockAuthorsSuggestions(searchTerm)),
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
  };
});

describe('LiteratureArticleListingPage', () => {
  beforeEach(() => {
    mockFetchArticlesForBrainRegionAndExperiment.mockClear();
    mockAuthorsSuggestions.mockClear();
  });

  test('shows error message when user navigates to incorrect experiment detail', async () => {
    renderComponentWithRoute('invalid-experiment-name');
    screen.getByText(/No articles were found for this experiment type./i);
  });

  test('shows error message when no experiment detail is provided in the route', async () => {
    renderComponentWithRoute(undefined);
    screen.getByText(/No articles were found for this experiment type./i);
  });

  test('shows current experiment as selected in the keywords menu', async () => {
    await renderComponentWithRoute(neuronDensity.name, { waitForArticles: true });
    const expTypesMenuButton = await selectExperimentTypesBtn();
    expect(expTypesMenuButton.textContent).toContain(neuronDensity.title);
  });

  test('shows all experiment types as options', async () => {
    const user = await renderComponentWithRoute(neuronDensity.name, { waitForArticles: true });

    const expTypesMenuButton = await selectExperimentTypesBtn();
    await user.click(expTypesMenuButton);

    const options = screen.getAllByRole('menuitem');
    expect(options.length).toEqual(Object.keys(EXPERIMENT_DATA_TYPES).length);
  });

  test('navigates to route selected by user', async () => {
    const mockRouter = {
      push: jest.fn(),
    };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    const user = await renderComponentWithRoute(neuronDensity.name, { waitForArticles: true });

    const expTypesMenuButton = await selectExperimentTypesBtn();
    await user.click(expTypesMenuButton);

    const electrophysiologyExperiment =
      DATA_TYPES_TO_CONFIGS[DataType.ExperimentalElectroPhysiology];
    const electrophysiologyOption = screen.getByRole('menuitem', {
      name: electrophysiologyExperiment.title,
    });

    await user.click(electrophysiologyOption);

    expect(mockRouter.push).toHaveBeenCalledWith(
      `/explore/interactive/literature/electrophysiology?brainRegion=${encodeURIComponent(
        BrainRegionQueryParams!
      )}`
    );
  });

  test('shows total count of articles', async () => {
    renderComponentWithRoute(neuronDensity.name);

    const articleCount = await screen.findByTestId('total-article-count', {}, { timeout: 3000 });
    expect(articleCount.textContent).toMatch(/100/);
  });

  test('shows articles for page 1 by default', async () => {
    renderComponentWithRoute(neuronDensity.name);

    const allArticles = await screen.findAllByText(/mock title/i);
    expect(allArticles.length).toBeLessThanOrEqual(100);

    allArticles.forEach((article) => {
      expect(article.textContent).toMatch(/Mock title/);
    });
  });

  test('does not show load more indicator when more articles are not available', async () => {
    mockFetchArticlesForBrainRegionAndExperiment.mockImplementationOnce(
      (token, name, brainRegions, page: number) =>
        new Promise((resolve) => {
          const mockResponse: ArticleItem[] = [...Array(10).keys()].map((_, index) =>
            createMockArticle(`Only 10 articles available ${index}`, `${index}`, 'Mock abstract')
          );
          resolve({ articles: mockResponse, total: 10, currentPage: page, pages: 1 });
        })
    );

    renderComponentWithRoute(neuronDensity.name);
    await screen.findAllByText(/only 10 articles available/i);
    expect(screen.queryByTestId('load more articles')).not.toBeInTheDocument();
  });

  test('shows load more indicator when more articles are available', async () => {
    renderComponentWithRoute(neuronDensity.name);

    await screen.findAllByText(/mock title/i);

    screen.getByTestId('load more articles');
  });

  test('opens filter panel without reloading data', async () => {
    const user = await renderComponentWithRoute(neuronDensity.name);

    await openFilterPanel(user);

    screen.getByTestId('article-list-filters');

    expect(screen.queryByTestId(articleListLoadingTestId)).not.toBeInTheDocument();
    // The api was only called once for the initial render.
    expect(mockFetchArticlesForBrainRegionAndExperiment).toHaveBeenCalledTimes(1);
  });

  test('filters articles by date', async () => {
    const user = await renderComponentWithRoute(neuronDensity.name);
    await openFilterPanel(user);

    expect(mockFetchArticlesForBrainRegionAndExperiment).toHaveBeenCalledTimes(1);
    mockFetchArticlesForBrainRegionAndExperiment.mockClear();

    const selectedDate = selectTodayAsDate('start');
    await applyFilters(user);

    expect(mockFetchArticlesForBrainRegionAndExperiment).toHaveBeenCalledTimes(1);
    const dateParams = filtersPassedToApi().publicationDate;
    expect(format(dateParams!.gte as Date, ML_DATE_FORMAT)).toEqual(selectedDate);
    expect(dateParams?.lte).toBeNull();

    const displayedDate = format(new Date(selectedDate), UI_DATE_FORMAT);
    const dates = await screen.findAllByText(displayedDate);
    expect(dates).toHaveLength(ARTICLES_PER_PAGE);
  });

  test('calls api with the right value if end date is selected', async () => {
    const user = await renderComponentWithRoute(neuronDensity.name);
    await openFilterPanel(user);

    expect(mockFetchArticlesForBrainRegionAndExperiment).toHaveBeenCalledTimes(1);
    mockFetchArticlesForBrainRegionAndExperiment.mockClear();

    const selectedDate = selectTodayAsDate('end');
    await applyFilters(user);

    expect(mockFetchArticlesForBrainRegionAndExperiment).toHaveBeenCalledTimes(1);
    const dateParams = filtersPassedToApi().publicationDate;
    expect(format(dateParams!.lte as Date, ML_DATE_FORMAT)).toEqual(selectedDate);
    expect(dateParams?.gte).toBeNull();
  });

  test('filters articles by authors', async () => {
    const user = await renderComponentWithRoute(neuronDensity.name);
    await openFilterPanel(user);
    mockFetchArticlesForBrainRegionAndExperiment.mockClear();
    typeInInput('Authors', 'Tunt');
    await selectSuggestion('Tunt');

    await applyFilters(user);

    expect(mockFetchArticlesForBrainRegionAndExperiment).toHaveBeenCalledTimes(1);
    const authorParamsPassed = filtersPassedToApi().authors;
    expect(authorParamsPassed).toEqual(['Cheryl Tunt']);

    await waitFor(() =>
      expect(screen.queryByTestId('initial data loading')).not.toBeInTheDocument()
    );
    expect(screen.queryByTestId('article-listing-error')).not.toBeInTheDocument();
  });

  test('does not call author suggestions endpoint again if author is not selected', async () => {
    const user = await renderComponentWithRoute(neuronDensity.name);
    await openFilterPanel(user);

    // Called once to load initial suggestions
    expect(mockAuthorsSuggestions).toHaveBeenCalledTimes(1);
    mockAuthorsSuggestions.mockClear();

    selectTodayAsDate('end');
    await applyFilters(user);
    expect(mockAuthorsSuggestions).not.toHaveBeenCalled();
  });

  test('resets filters', async () => {
    const user = await renderComponentWithRoute(neuronDensity.name);
    await openFilterPanel(user);

    selectTodayAsDate('start');

    typeInInput('Authors', 'Tunt');
    await selectSuggestion('Tunt');

    await applyFilters(user);
    await expectActiveFiltersCount(2);

    await openFilterPanel(user);

    const resetFiltersButton = getButton('Clear filters');
    await user.click(resetFiltersButton);

    await expectActiveFiltersCount(0);

    const authorInputAfter = screen.getByLabelText('Authors', {
      selector: 'input',
    }) as HTMLInputElement;
    expect(authorInputAfter.value).toBeFalsy();
  });

  test('resets filters that are not applied', async () => {
    const user = await renderComponentWithRoute(neuronDensity.name);
    await openFilterPanel(user);

    selectTodayAsDate('start');

    typeInInput('Authors', 'Tunt');
    await selectSuggestion('Tunt');

    const clearFiltersButton = await findButton('Clear filters');
    user.click(clearFiltersButton);

    const authorInputAfter = screen.getByLabelText('Authors', {
      selector: 'input',
    }) as HTMLInputElement;
    expect(authorInputAfter.value).toBeFalsy();
    await expectActiveFiltersCount(0);
  });

  test('shows applied filters when panel is reopened', async () => {
    const user = await renderComponentWithRoute(neuronDensity.name);
    await openFilterPanel(user);

    const date = selectTodayAsDate('start');

    typeInInput('Authors', 'Tunt');
    await selectSuggestion('Tunt');

    typeInInput('Journal', 'NeuroScience');
    await selectSuggestion('NeuroScience');

    typeInInput('Article type', 'abstract');
    await selectSuggestion('abstract');

    await applyFilters(user);
    await expectActiveFiltersCount(4);

    await openFilterPanel(user);

    const dateInput = screen.getByPlaceholderText('Start date');
    expect(dateInput).toHaveValue(format(new Date(date), UI_DATE_FORMAT));

    expect(getSelectedFilterOptions('Authors')!.item(0).textContent).toEqual('Cheryl Tunt');
    expect(getSelectedFilterOptions('Journals')!.item(0).textContent).toEqual('NeuroScience');
    expect(getSelectedFilterOptions('Article type')!.item(0).textContent).toEqual('abstract');
  });

  test('component renders for unauthenticated users also', async () => {
    await renderComponentWithRoute(neuronDensity.name, {
      authenticatedUser: false,
    });
    const articleCount = await screen.findByTestId('total-article-count', {}, { timeout: 3000 });
    expect(articleCount.textContent).toMatch(/100/);
  });

  const getSelectedFilterOptions = (filterName: 'Authors' | 'Journals' | 'Article type') => {
    switch (filterName) {
      case 'Authors':
        return document.querySelectorAll(`[data-testid="author-input"] ${selectedItemSelector}`);
      case 'Journals':
        return document.querySelectorAll(`[data-testid="journal-input"] ${selectedItemSelector}`);
      case 'Article type':
        return document.querySelectorAll(
          `[data-testid="article-type-input"] ${selectedItemSelector}`
        );
      default:
        document.querySelectorAll(selectedItemSelector);
    }
  };

  const expectActiveFiltersCount = async (expectedCount: number) => {
    const actualCount = (await screen.findByTestId('active-filters-count')).textContent;
    expect(actualCount).toEqual(`${expectedCount}`);
  };

  const filtersPassedToApi = (callNumber: number = 0): ArticleListFilters => {
    // 3rd argument contains the filters that are passed as query params to the api
    return mockFetchArticlesForBrainRegionAndExperiment.mock.calls[callNumber][3];
  };

  const applyFilters = async (user: UserEvent) => {
    await user.click(getButton('Apply'));
  };

  const typeInInput = (inputName: string, text: string) => {
    const autocompleteInput = screen.getByLabelText(inputName, { selector: 'input' });
    fireEvent.change(autocompleteInput, { target: { value: text } });
  };

  const selectSuggestion = async (optionLabel: string) => {
    const selectedAuthor = await screen.findByRole('option', {
      name: new RegExp(optionLabel, 'i'),
    });
    fireEvent.click(selectedAuthor);
    fireEvent.mouseDown(selectedAuthor);
  };

  const openFilterPanel = async (user: UserEvent) => {
    const filterBtn = await findButton('filter');
    await user.click(filterBtn);
  };

  const selectExperimentTypesBtn = async () => await screen.findByTestId(EXPERIMENT_TYPES_BTN);
  const articleListLoadingTestId = 'initial data loading';

  const neuronDensity = DATA_TYPES_TO_CONFIGS[DataType.ExperimentalNeuronDensity];

  const selectedItemSelector = '.ant-select-selection-item-content';

  const renderComponentWithRoute = async (
    name?: string,
    config?: { waitForArticles?: boolean; authenticatedUser?: boolean }
  ) => {
    const user = userEvent.setup();

    const spy = useParams as unknown as jest.Mock;
    spy.mockReturnValue({ 'experiment-data-type': name });

    await waitFor(() =>
      render(
        LiteratureArticleListingPageProvider(
          isUndefined(config?.authenticatedUser) ? true : config?.authenticatedUser
        )
      )
    );
    if (config?.waitForArticles) {
      await screen.findByTestId('total-article-count', {}, { timeout: 5000 });
    }
    return user;
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

  function LiteratureArticleListingPageProvider(authenticatedUser?: boolean) {
    const initialAtoms: any[] = [
      [
        selectedBrainRegionAtom,
        {
          id: mockBrainRegions[1].id,
          title: mockBrainRegions[1].title,
          leaves: mockBrainRegions[1].leaves,
        } as SelectedBrainRegion,
      ],
      [articleListingFilterPanelOpenAtom, false],
    ];
    if (authenticatedUser) {
      initialAtoms.push([sessionAtom, { accessToken: 'abc' }]);
    }
    return (
      <TestProvider initialValues={initialAtoms}>
        <LiteratureArticleListingPage />
      </TestProvider>
    );
  }
});
