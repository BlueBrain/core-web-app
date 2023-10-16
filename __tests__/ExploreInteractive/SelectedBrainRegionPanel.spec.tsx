/* eslint-disable no-restricted-syntax */
import { act, fireEvent, render, screen } from '@testing-library/react';
import { Provider, useAtom } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';
import { visibleExploreBrainRegionsAtom } from '@/state/explore-section/interactive';
import sessionAtom from '@/state/session';
import { BrainRegion, BrainRegionOntology } from '@/types/ontologies';
import SelectedBrainRegionPanel, {
  defaultTabColor,
} from '@/components/explore-section/ExploreInteractive/SelectedBrainRegionPanel';
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
          views: null,
          volumes: {},
        };
        resolve(mockResponse);
      })
  ),
}));

const mockCountForExperiment = (experimentId: string) => experimentId.length;

jest.mock('src/api/explore-section/resources.ts', () => ({
  __esModule: true,
  fetchExperimentDatasetCountForBrainRegion: jest.fn().mockImplementation(
    (accessToken, experimentUrl, brainRegionId) =>
      new Promise((resolve) => {
        resolve({
          total: mockCountForExperiment(experimentUrl),
          brainRegionId,
          experimentUrl,
        });
      })
  ),
}));

describe('SelectedBrainRegionPanel', () => {
  beforeEach(async () => {
    render(SelectedBrainRegionPanelProvider());
  });

  test('shows tabs for every selected brain region', async () => {
    const brainRegionsToVisualize = [mockBrainRegions[0], mockBrainRegions[1], mockBrainRegions[2]];

    visualizeBrainRegions(brainRegionsToVisualize);

    for await (const mockBrainRegion of brainRegionsToVisualize) {
      await screen.findByText(mockBrainRegion.title);
    }
  });

  test('does not show any tab if no brain region is selected to be visualized', () => {
    removeRegionFromVisualization([defaultVisualizedRegion]);
    const tab = screen.queryByRole('tab');
    expect(tab).not.toBeInTheDocument();
  });

  test('shows count of dataset for all experiment types', async () => {
    await screen.findByRole('heading', { name: /Experimental data/i });

    for await (const experimentType of EXPERIMENT_TYPE_DETAILS) {
      const experimentEle = await screen.findByTestId(`experiment-dataset-${experimentType.id}`);
      expect(experimentEle.textContent).toContain(experimentType.title);
      expect(experimentEle.textContent).toContain(`${mockCountForExperiment(experimentType.id)}`);
    }
  });

  test('shows literature articles count for all experiment types', async () => {
    await screen.findByRole('heading', { name: /Literature/i });

    for await (const experimentType of EXPERIMENT_TYPE_DETAILS) {
      const experimentEle = await screen.findByTestId(`literature-articles-${experimentType.id}`);
      expect(experimentEle.textContent).toContain(experimentType.title);
    }
  });

  test('only active tab has color of active brain region', async () => {
    const brainRegionsToVisualize = [mockBrainRegions[0], mockBrainRegions[1], mockBrainRegions[2]];
    visualizeBrainRegions(brainRegionsToVisualize);

    const activeTab = await screen.findByRole('tab', { selected: true });

    expect(getComputedStyle(activeTab).color).toEqual(toRGB(brainRegionsToVisualize[0].colorCode));

    await expectInactiveTabsHaveColor(defaultTabColor, 2);
  });

  test('active tab color changes when new tab is activated', async () => {
    const brainRegionsToVisualize = [mockBrainRegions[0], mockBrainRegions[1], mockBrainRegions[2]];
    visualizeBrainRegions(brainRegionsToVisualize);

    await expectTabColorsToBe(brainRegionsToVisualize[0].colorCode, 2); // default active tab is the first tab

    await clickOnBrainRegionTab(brainRegionsToVisualize[1].title);
    await expectTabColorsToBe(brainRegionsToVisualize[1].colorCode, 2);

    await clickOnBrainRegionTab(brainRegionsToVisualize[2].title);
    await expectTabColorsToBe(brainRegionsToVisualize[2].colorCode, 2);
  });

  const expectTabColorsToBe = async (
    activeTabColor: string,
    inactiveTabsCount: number,
    inactiveTabColor: string = defaultTabColor
  ) => {
    expect(await getActiveTabColor()).toEqual(toRGB(activeTabColor));
    expectInactiveTabsHaveColor(inactiveTabColor, inactiveTabsCount);
  };

  const expectInactiveTabsHaveColor = async (color: string, count: number) => {
    const inactiveTabs = await screen.findAllByRole('tab', { selected: false });
    expect(inactiveTabs.length).toEqual(count);

    inactiveTabs.forEach((inactiveTab) => {
      const labelText = inactiveTab.querySelector('span[data-testid="brain-region-tab-label"]');
      expect(getComputedStyle(labelText!).color).toEqual(toRGB(color));
    });
  };

  const getActiveTabColor = async () => {
    const activeTab = await screen.findByRole('tab', { selected: true });
    return getComputedStyle(activeTab).color;
  };

  const clickOnBrainRegionTab = async (tabTitle: string) => {
    const brainRegionTab = await screen.findByRole('tab', { name: tabTitle });
    fireEvent.click(brainRegionTab);
  };

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

const getMockBrainRegion = (
  name: string,
  id: string,
  colorCode: string = '#40A666'
): BrainRegion => ({
  id,
  colorCode,
  title: name,
  isPartOf: '48',
  isLayerPartOf: null,
  notation: 'ACAv5',
  representedInAnnotation: true,
  view: 'https://neuroshapes.org/BrainRegion',
  hasLayerPart: [],
  hasPart: [],
});

export const mockBrainRegions: BrainRegion[] = [
  getMockBrainRegion('Anterior cingulate area, ventral part, layer 5', '1', '#0802A3'),
  getMockBrainRegion('Agranular insular area, posterior part, layer 2', '2', '#FF4B91'),
  getMockBrainRegion('Isocortex', '3', '#FF7676'),
  getMockBrainRegion('Ventral posterolateral nucleus of the thalamus', '718', '#FFCD4B'),
  getMockBrainRegion('Cerebrum', '6', '#98E4FF'),
];

const defaultVisualizedRegion = mockBrainRegions[0];

const toRGB = (color: string) => {
  const { style } = new Option();
  style.color = color;
  return style.color;
};
