/* eslint-disable no-restricted-syntax */
import { act, fireEvent, render, screen } from '@testing-library/react';
import { Provider, useAtom } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';
import sessionAtom from '@/state/session';
import { BrainRegion, BrainRegionOntology } from '@/types/ontologies';
import SelectedBrainRegionPanel from '@/components/explore-section/ExploreInteractive/SelectedBrainRegionPanel';
import { selectedBrainRegionAtom, visibleBrainRegionsAtom } from '@/state/brain-regions';
import { SelectedBrainRegion } from '@/state/brain-regions/types';
import { EXPERIMENT_DATA_TYPES } from '@/constants/explore-section/experiment-types';
import { mockBrainRegions } from '__tests__/__utils__/SelectedBrainRegions';

jest.mock('next/navigation', () => ({
  __esModule: true,
  useRouter: () => ({
    push: jest.fn(),
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

const mockCountForExperiment = (experimentUrl: string, brainRegionsIdCount: number) => {
  const ExperimentCountForOneRegion = 10;
  return ExperimentCountForOneRegion * brainRegionsIdCount + experimentUrl.length;
};

jest.mock('src/api/explore-section/resources.ts', () => ({
  __esModule: true,
  fetchExperimentDatasetCountForBrainRegion: jest.fn().mockImplementation(
    (accessToken, experimentUrl, brainRegions: BrainRegion[]) =>
      new Promise((resolve) => {
        resolve({
          total: mockCountForExperiment(experimentUrl, brainRegions.length),
          experimentUrl,
        });
      })
  ),
}));

jest.mock('src/components/explore-section/Literature/api.ts', () => ({
  _esModule: true,
  fetchParagraphCountForBrainRegionAndExperiment: jest.fn().mockImplementation(
    (token, experimentType) =>
      new Promise((resolve) => {
        resolve({
          total: Math.floor(Math.random() * 30),
          experimentUrl: experimentType.id,
        });
      })
  ),
}));

jest.mock('deepdash-es/standalone', () => ({
  __esModule: true,
  reduceDeep: (arr: any[]) => [arr],
  findDeep: (flatTree: any, findFn: any) => ({
    value: flatTree.find(findFn) ?? flatTree[0].items.find(findFn),
  }),
}));

describe('SelectedBrainRegionPanel', () => {
  beforeEach(async () => {
    render(SelectedBrainRegionPanelProvider());
  });

  test('does not show any tab if no brain region is selected to be visualized', () => {
    removeRegionFromVisualization([defaultVisualizedRegion]);
    const tab = screen.queryByRole('tab');
    expect(tab).not.toBeInTheDocument();
  });

  test('shows count of dataset for all experiment types', async () => {
    const brainRegionsToVisualize = [mockBrainRegions[0], mockBrainRegions[1], mockBrainRegions[2]];

    visualizeBrainRegions(brainRegionsToVisualize);

    await screen.findByRole('heading', { name: /Experimental data/i });

    for await (const [id, config] of Object.entries(EXPERIMENT_DATA_TYPES)) {
      const experimentEle = await screen.findByTestId(`experiment-dataset-${id}`);
      expect(experimentEle.textContent).toContain(config.title);
      expect(experimentEle.textContent).toContain(
        `${mockCountForExperiment(id, brainRegionsToVisualize.length)}`
      );
    }
  });

  test('shows literature articles count for all experiment types', async () => {
    await screen.findByRole('heading', { name: /Literature/i });

    for await (const [id, config] of Object.entries(EXPERIMENT_DATA_TYPES)) {
      const experimentEle = await screen.findByTestId(`literature-articles-${id}`);
      expect(experimentEle.textContent).toContain(config.title);
    }
  });

  const removeRegionFromVisualization = (brainRegions: BrainRegion[]) => {
    brainRegions.forEach((brainRegion) => {
      act(() => {
        const addBtn = screen.getByRole('button', { name: `Remove ${brainRegion.id}` });
        fireEvent.click(addBtn);
      });
    });
  };

  const visualizeBrainRegions = (brainRegions: BrainRegion[]) => {
    brainRegions.forEach((brainRegion) => {
      const addBtn = screen.getByRole('button', { name: `Add ${brainRegion.id}` });
      fireEvent.click(addBtn);
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

  function SelectedBrainRegionPanelProvider() {
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
          [visibleBrainRegionsAtom('explore'), [defaultVisualizedRegion.id]],
        ]}
      >
        {mockBrainRegions.map((brainRegion) => (
          <VizButtons key={brainRegion.id} brainRegion={brainRegion} />
        ))}
        <SelectedBrainRegionPanel />
      </TestProvider>
    );
  }

  function VizButtons({ brainRegion }: { brainRegion: BrainRegion }) {
    const [visualizedBrainRegions, setVisualizedBrainRegions] = useAtom(
      visibleBrainRegionsAtom('explore')
    );
    return (
      <div key={brainRegion.id}>
        {brainRegion.id}
        {brainRegion.title}
        <button
          type="button"
          onClick={() => {
            setVisualizedBrainRegions(
              Array.from(new Set([...visualizedBrainRegions, brainRegion.id]))
            );
          }}
        >
          Add {brainRegion.id}
        </button>
        <button
          type="button"
          onClick={() =>
            setVisualizedBrainRegions(
              visualizedBrainRegions.filter((_id) => _id !== brainRegion.id)
            )
          }
        >
          Remove {brainRegion.id}
        </button>
      </div>
    );
  }
});

const defaultVisualizedRegion = mockBrainRegions[0];
