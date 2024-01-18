/* eslint-disable no-restricted-syntax */
import { render, screen } from '@testing-library/react';
import { Provider } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';

import sessionAtom from '@/state/session';
import { BrainRegion } from '@/types/ontologies';
import SelectedBrainRegionPanel from '@/components/explore-section/ExploreInteractive/SelectedBrainRegionPanel';
import { selectedBrainRegionAtom } from '@/state/brain-regions';
import { SelectedBrainRegion } from '@/state/brain-regions/types';
import { DATA_TYPES } from '@/constants/explore-section/experiment-types';
import { mockBrainRegions } from '__tests__/__utils__/SelectedBrainRegions';

jest.mock('next/navigation', () => ({
  __esModule: true,
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

const mockCountForExperiment = 10;

jest.mock('src/api/explore-section/resources.ts', () => ({
  __esModule: true,
  fetchTotalByExperimentAndRegions: jest.fn().mockImplementation(
    () =>
      new Promise((resolve) => {
        resolve(mockCountForExperiment);
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
    const tab = screen.queryByRole('tab');
    expect(tab).not.toBeInTheDocument();
  });

  test('shows count of dataset for all experiment types', async () => {
    await screen.findByRole('heading', { name: /Experimental data/i });

    for await (const [id, config] of Object.entries(DATA_TYPES)) {
      const experimentEle = await screen.findByTestId(`experiment-dataset-${id}`);
      expect(experimentEle.textContent).toContain(config.title);
      expect(experimentEle.textContent).toContain(`${mockCountForExperiment}`);
    }
  });

  test('shows literature articles count for all experiment types', async () => {
    await screen.findByRole('heading', { name: /Literature/i });

    for await (const [id, config] of Object.entries(DATA_TYPES)) {
      const experimentEle = await screen.findByTestId(`literature-articles-${id}`);
      expect(experimentEle.textContent).toContain(config.title);
    }
  });

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
    return (
      <div key={brainRegion.id}>
        {brainRegion.id}
        {brainRegion.title}
      </div>
    );
  }
});
