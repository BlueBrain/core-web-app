/* eslint-disable no-restricted-syntax */
import { act, fireEvent, render, screen } from '@testing-library/react';
import { Provider, useAtom } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';
import { visibleExploreBrainRegionsAtom } from '@/state/explore-section/interactive';
import sessionAtom from '@/state/session';
import { BrainRegion, BrainRegionOntology } from '@/types/ontologies';
import SelectedBrainRegionPanel from '@/components/explore-section/ExploreInteractive/SelectedBrainRegionPanel';
import { selectedBrainRegionAtom } from '@/state/brain-regions';
import { SelectedBrainRegion } from '@/state/brain-regions/types';
import { EXPERIMENT_TYPE_DETAILS } from '@/constants/explore-section/experiment-types';

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

    for await (const experimentType of EXPERIMENT_TYPE_DETAILS) {
      const experimentEle = await screen.findByTestId(`experiment-dataset-${experimentType.id}`);
      expect(experimentEle.textContent).toContain(experimentType.title);
      expect(experimentEle.textContent).toContain(
        `${mockCountForExperiment(experimentType.id, brainRegionsToVisualize.length)}`
      );
    }
  });

  test('shows literature articles count for all experiment types', async () => {
    await screen.findByRole('heading', { name: /Literature/i });

    for await (const experimentType of EXPERIMENT_TYPE_DETAILS) {
      const experimentEle = await screen.findByTestId(`literature-articles-${experimentType.id}`);
      expect(experimentEle.textContent).toContain(experimentType.title);
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
          [visibleExploreBrainRegionsAtom, [defaultVisualizedRegion.id]],
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
      visibleExploreBrainRegionsAtom
    );
    return (
      <div key={brainRegion.id}>
        {brainRegion.id}
        {brainRegion.title}
        <button
          type="button"
          onClick={() =>
            setVisualizedBrainRegions(
              Array.from(new Set([...visualizedBrainRegions, brainRegion.id]))
            )
          }
        >
          Add {brainRegion.id}
        </button>
        <button
          type="button"
          onClick={() =>
            setVisualizedBrainRegions(visualizedBrainRegions.filter((br) => br !== brainRegion.id))
          }
        >
          Remove {brainRegion.id}
        </button>
      </div>
    );
  }
});

const IDPrefix = 'http://api.brain-map.org/api/v2/data/Structure';

const getMockBrainRegion = (
  name: string,
  id: string,
  colorCode: string = '#40A666',
  extra: Partial<BrainRegion> = {}
): BrainRegion => ({
  id: `${IDPrefix}/${id}`,
  colorCode,
  title: name,
  isPartOf: `${IDPrefix}/48`,
  isLayerPartOf: null,
  notation: 'ACAv5',
  representedInAnnotation: true,
  view: 'https://neuroshapes.org/BrainRegion',
  hasLayerPart: [],
  hasPart: [],
  items: undefined,
  ...extra,
  // items: isRoot ? [getMockBrainRegion('Roots child', '8', '#000')] : undefined
});

export const mockBrainRegions: BrainRegion[] = [
  getMockBrainRegion('Anterior cingulate area, ventral part, layer 5', '1', '#0802A3', {
    isPartOf: `${IDPrefix}/8`,
  }),
  getMockBrainRegion('Agranular insular area, posterior part, layer 2', '2', '#FF4B91', {
    isPartOf: `${IDPrefix}/8`,
  }),
  getMockBrainRegion('Isocortex', '3', '#FF7676', { isPartOf: `${IDPrefix}/8` }),
  getMockBrainRegion('Ventral posterolateral nucleus of the thalamus', '718', '#FFCD4B', {
    isPartOf: `${IDPrefix}/8`,
  }),
  getMockBrainRegion('Cerebrum', '6', '#98E4FF', { isPartOf: `${IDPrefix}/8` }),
  getMockBrainRegion('Child of root', '8', '#000', { isPartOf: `${IDPrefix}/997` }),
  getMockBrainRegion('Root Brain Region', '997', '#98E4FF', {
    isPartOf: null,
    isLayerPartOf: null,
    hasPart: [`${IDPrefix}/8`],
  }),
];
const defaultVisualizedRegion = mockBrainRegions[0];
