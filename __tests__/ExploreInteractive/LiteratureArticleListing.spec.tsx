import { useHydrateAtoms } from 'jotai/utils';
import { Provider } from 'jotai';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { useParams, useRouter } from 'next/navigation';
import sessionAtom from '@/state/session';
import LiteratureArticleListingPage from '@/app/explore/(interactive)/interactive/literature/[experiment-data-type]/page';
import { BrainRegionOntology } from '@/types/ontologies';
import { selectedBrainRegionAtom, visibleBrainRegionsAtom } from '@/state/brain-regions';
import { SelectedBrainRegion } from '@/state/brain-regions/types';
import { EXPERIMENT_TYPE_DETAILS } from '@/constants/explore-section/experiment-types';
import { ArticleItem } from '@/api/explore-section/resources';
import { mockBrainRegions } from '__tests__/__utils__/SelectedBrainRegions';

jest.mock('next/navigation', () => ({
  __esModule: true,
  useParams: jest.fn(),
  useRouter: jest.fn(),
  notFound: jest.fn().mockReturnValue('Invalid experiment type selected.'),
}));

jest.mock('deepdash-es/standalone', () => ({
  __esModule: true,
  reduceDeep: (arr: any[]) => [arr],
  findDeep: (flatTree: any, findFn: any) => ({
    value: flatTree.find(findFn) ?? flatTree[0].items.find(findFn),
  }),
}));

jest.mock('src/api/ontologies/index.ts', () => ({
  __esModule: true,
  getBrainRegionOntology: jest.fn().mockImplementation(
    () =>
      new Promise((resolve) => {
        const mockResponse: BrainRegionOntology = {
          brainRegions: mockBrainRegions,
          views: [
            {
              id: 'https://neuroshapes.org/BrainRegion',
              leafProperty: 'hasLeafRegionPart',
              parentProperty: 'isPartOf',
              childrenProperty: 'hasPart',
              title: 'BrainRegion',
            },
          ],
          volumes: {},
        };
        resolve(mockResponse);
      })
  ),
}));

const createMockArticle = (title: string, doi: string, abstract: string): ArticleItem => ({
  title,
  doi,
  abstract,
});

jest.mock('src/components/explore-section/Literature/api.ts', () => ({
  __esModule: true,
  fetchArticlesForBrainRegionAndExperiment: jest.fn().mockImplementation(
    () =>
      new Promise((resolve) => {
        const mockResponse: ArticleItem[] = [...Array(100).keys()].map((_, index) =>
          createMockArticle(`Mock title ${index}`, `${index}`, 'Mock abstract')
        );
        resolve(mockResponse);
      })
  ),
}));

describe('LiteratureArticleListingPage', () => {
  test('shows error message when user navigates to incorrect experiment detail', async () => {
    renderComponentWithRoute('invalid-experiment-name');
    screen.getByText(/No articles were found for this experiment type./i);
  });

  test('shows error message when no experiment detail is provided in the route', async () => {
    renderComponentWithRoute(undefined);
    screen.getByText(/No articles were found for this experiment type./i);
  });

  test('shows current experiment as selected in the keywords menu', async () => {
    await renderComponentWithRoute(NEURON_DENSITY.name, true);

    const keywordsMenu = await screen.findByRole('combobox', { name: 'keywords' });
    click(keywordsMenu);

    const selectedOption = screen.getByRole('option', { selected: true });
    expect(selectedOption.textContent).toContain(NEURON_DENSITY.title);
  });

  test('shows all experiment types as options', async () => {
    await renderComponentWithRoute(NEURON_DENSITY.name, true);

    const keywordsMenu = await screen.findByRole('combobox', { name: 'keywords' });
    click(keywordsMenu);

    const options = screen.getAllByRole('option');

    expect(options.length).toEqual(EXPERIMENT_TYPE_DETAILS.length);
  });

  test('navigates to route selected by user', async () => {
    const mockRouter = {
      push: jest.fn(),
    };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    await renderComponentWithRoute(NEURON_DENSITY.name, true);

    const keywordsMenu = await screen.findByRole('combobox', { name: 'keywords' });
    click(keywordsMenu);

    const electrophysiologyExperiment = EXPERIMENT_TYPE_DETAILS.find(
      (experiment) => experiment.name === 'electrophysiology'
    )!;
    const electrophysiologyOption = screen.getByRole('option', {
      name: electrophysiologyExperiment.title,
    });
    click(electrophysiologyOption);

    expect(mockRouter.push).toHaveBeenCalledWith(
      '/explore/interactive/literature/electrophysiology'
    );
  });

  test('shows total count of articles', async () => {
    renderComponentWithRoute(NEURON_DENSITY.name);

    const articleCount = await screen.findByTestId('total-article-count', {}, { timeout: 3000 });
    expect(articleCount.textContent).toMatch(/100/);
  });

  test('shows articles for page 1 by default', async () => {
    renderComponentWithRoute(NEURON_DENSITY.name);

    const allArticles = await screen.findAllByText(/mock title/i);
    expect(allArticles.length).toBeLessThanOrEqual(100);

    allArticles.forEach((article) => {
      expect(article.textContent).toMatch(/Mock title/);
    });
  });

  const NEURON_DENSITY = EXPERIMENT_TYPE_DETAILS.find(
    (experiment) => experiment.name === 'neuron-density'
  )!;

  const renderComponentWithRoute = async (name?: string, waitForArticles?: boolean) => {
    const spy = useParams as unknown as jest.Mock;

    spy.mockReturnValue({ 'experiment-data-type': name });
    render(LiteratureArticleListingPageProvider());

    if (waitForArticles) {
      await screen.findByTestId('total-article-count', {}, { timeout: 3000 });
    }
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

  function LiteratureArticleListingPageProvider() {
    return (
      <TestProvider
        initialValues={[
          [sessionAtom, { accessToken: 'abc' }],
          [
            selectedBrainRegionAtom,
            {
              id: mockBrainRegions[1].id,
              title: mockBrainRegions[1].title,
              leaves: mockBrainRegions[1].leaves,
              representedInAnnotation: mockBrainRegions[1].representedInAnnotation,
            } as SelectedBrainRegion,
          ],
          [visibleBrainRegionsAtom('explore'), [mockBrainRegions[1].id]],
        ]}
      >
        <LiteratureArticleListingPage />
      </TestProvider>
    );
  }
});

const click = (element: HTMLElement) => {
  act(() => {
    fireEvent.click(element);
    fireEvent.focus(element);
    fireEvent.mouseDown(element);
  });
};
