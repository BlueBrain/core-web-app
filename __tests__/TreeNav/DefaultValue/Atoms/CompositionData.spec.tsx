import { render, screen, waitFor } from '@testing-library/react';
import { Provider, useAtomValue } from 'jotai';
import { unwrap, useHydrateAtoms } from 'jotai/utils';

import { useMemo } from 'react';
import { selectedBrainRegionAtom } from '@/state/brain-regions';
import { sectionAtom } from '@/state/application';
import { idAtom as brainModelConfigIdAtom } from '@/state/brain-model-config';
import { analysedCompositionAtom } from '@/state/build-composition';
import sessionAtom from '@/state/session';
import { IDPrefix, mockBrainRegions } from '__tests__/__utils__/SelectedBrainRegions';
import { defaultExploreRegion } from '@/constants/explore-section/default-brain-region';
import { useSetBrainRegionFromQuery, useSetBrainRegionToQuery } from '@/hooks/brain-region-panel';
import { useQueryState } from 'nuqs';

jest.mock('src/api/nexus', () => {
  const actual = jest.requireActual('src/api/nexus');
  return {
    ...actual,
    fetchResourceById: (id: string) => {
      return nexusResourceForBrainRegion(id);
    },
    fetchJsonFileByUrl: (url: string) => ({ ...compositionFileMock(url) }),
  };
});

jest.mock('nuqs', () => {
  let mockQueryParam = '';
  return {
    useQueryState: () => [
      decodeURIComponent(mockQueryParam),
      (id: string) => (mockQueryParam = id),
    ],
  };
});

describe('Default composition data', () => {
  test('Fetches composition data for (new) users', async () => {
    await renderDefaultBrainRegionFirstTimeUser();

    await screen.findByText(defaultExploreRegion.title);

    const brainRegionIdSelectedInQuery = screen.getByTestId('brain-region-in-query').textContent;
    expect(defaultExploreRegion.id).toEqual(brainRegionIdSelectedInQuery);

    expect(leavesCount()).toEqual('1');

    await screen.findByText(defaultExploreRegion.title);

    const expectedComposition =
      mockChild1.composition.neuron.density + mockChild2.composition.neuron.density;
    expect(compositionData()).toEqual(`${expectedComposition}`);
  });

  const leavesCount = () => screen.getByTestId('default-region-leaves').textContent;
  const compositionData = () => screen.getByTestId('composition-data').textContent;

  const renderDefaultBrainRegionFirstTimeUser = async () => {
    const defaultBrainRegion = mockBrainRegions.find((br) => br.id === defaultExploreRegion.id)!;
    expect(defaultBrainRegion).toBeDefined();

    await waitFor(() => render(ProviderComponent()));
  };

  function ProviderComponent() {
    const defaultBrainRegion = mockBrainRegions.find((br) => br.id === defaultExploreRegion.id)!;
    expect(defaultBrainRegion).toBeDefined();

    return (
      <TestProvider
        initialValues={[
          [sessionAtom, { accessToken: 'abc' }],
          [sectionAtom, 'explore'],
          [brainModelConfigIdAtom, '123'],
          [selectedBrainRegionAtom, null],
        ]}
      >
        <TestComponentFirstTimeUserComposition />
      </TestProvider>
    );
  }
});

function TestProvider({ initialValues, children }: any) {
  return (
    <Provider>
      <HydrateAtoms initialValues={initialValues}>{children}</HydrateAtoms>
    </Provider>
  );
}

const HydrateAtoms = ({ initialValues, children }: any) => {
  useHydrateAtoms(initialValues);
  return children;
};

function TestComponentFirstTimeUserComposition() {
  const selectedBrainRegion = useAtomValue(selectedBrainRegionAtom);
  const composition = useAtomValue(useMemo(() => unwrap(analysedCompositionAtom), []));
  const [brainRegionIdInQuery] = useQueryState('');
  useSetBrainRegionFromQuery();
  useSetBrainRegionToQuery();

  return (
    <>
      <div>{selectedBrainRegion?.title}</div>
      <div data-testid="brain-region-in-query">{brainRegionIdInQuery}</div>
      <div data-testid="default-region-leaves">{selectedBrainRegion?.leaves?.length}</div>
      <div data-testid="composition-data">{composition?.totalComposition.neuron.count}</div>
    </>
  );
}

const mockChild1 = {
  label: 'bNAC',
  about: 'EType',
  composition: {
    neuron: {
      density: 30,
    },
  },
};

const mockChild2 = {
  label: 'cNAC',
  about: 'EType',
  composition: {
    neuron: {
      density: 20,
    },
  },
};

const compositionFileMock = (url: string) => ({
  [url]: {
    configuration: {
      version: 1,
      unitCode: {
        density: 'mm^-3',
      },
      overrides: {
        // leaf nodes only
        [`${IDPrefix}/577`]: {
          label: 'Primary somatosensory area, upper limb, layer 4',
          about: 'BrainRegion',
          hasPart: {
            A: {
              label: 'L1_DAC',
              about: 'MType',
              hasPart: {
                D: {
                  ...mockChild1,
                },
                E: {
                  ...mockChild2,
                },
              },
            },
          },
        },
      },
    },
  },
});

const nexusResourceForBrainRegion = (id: string) => {
  return {
    '@context': ['https://bbp.neuroshapes.org'],
    '@id': id,
    _self: id,
    brainLocation: {
      brainRegion: {
        '@id': 'mba:997',
        label: 'root',
      },
    },
    circuitConfigPath: {
      '@type': 'DataDownload',
      url: 'file:///bbp.ch/data/mock-config.json',
    },
    description: 'Mock description',
    name: 'Mock Name',
    distribution: {
      '@type': 'DataDownload',
      contentSize: {
        unitCode: 'bytes',
        value: 282,
      },
      contentUrl: 'mock-url',
      name: 'cell-position-config.json',
    },
    configs: {
      cellCompositionConfig: {
        '@id': 'mock-cell-id',
        '@type': ['CellCompositionConfig', 'Entity'],
      },
    },
  };
};
