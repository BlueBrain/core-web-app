import { render, screen } from '@testing-library/react';
import { Provider } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';

import { sectionAtom } from '@/state/application';
import { brainRegionHierarchyStateAtom } from '@/state/brain-regions';
import { idAtom as brainModelConfigIdAtom } from '@/state/brain-model-config';
import BrainRegions from '@/components/build-section/BrainRegionSelector/BrainRegions';
import sessionAtom from '@/state/session';
import {
  defaultIncreasedTimeout,
  regionContainerSelector,
} from '__tests__/__utils__/BrainRegionPanel/constants';

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

jest.mock(
  'src/api/ontologies/index.ts',
  () => jest.requireActual('__tests__/__utils__/Ontology').defaultOntologyMock
);

global.ResizeObserver = class MockedResizeObserver {
  observe = jest.fn();

  unobserve = jest.fn();

  disconnect = jest.fn();
};

describe('Default brain region panel in explore', () => {
  beforeEach(() => {
    render(Provider());
  });

  const defaultRegion = 'Cerebrum';

  test('show Cerebrum in search', async () => {
    await screen.findByText(
      defaultRegion,
      { selector: `button > ${regionContainerSelector}` },
      { timeout: defaultIncreasedTimeout }
    );
  });

  test('show expanded tree', async () => {
    const selector = `div[data-tree-id] button > ${regionContainerSelector}`;
    await screen.findByText('Basic Cell Groups and Regions', { selector });
    await screen.findByText('Brain Stem', { selector });
    await screen.findByText('Cerebrum', { selector });
    await screen.findByText('Cerebellum', { selector });
  });

  function Provider() {
    return (
      <TestProvider
        initialValues={[
          [sessionAtom, { accessToken: 'abc' }],
          [sectionAtom, 'explore'],
          [
            brainRegionHierarchyStateAtom,
            {
              'http://api.brain-map.org/api/v2/data/Structure/8': null,
            },
          ],
          [brainModelConfigIdAtom, '123'],
        ]}
      >
        <BrainRegions />
      </TestProvider>
    );
  }
});

describe('Default brain region panel with no atoms', () => {
  beforeEach(() => {
    render(Provider());
  });

  test('show empty search', async () => {
    await screen.findByText('Search region...', { selector: `div.ant-select span:not([title])` });
  });

  test('show only root in tree', async () => {
    await screen.findByText('Basic Cell Groups and Regions');
    expect(screen.queryByText('Cerebrum')).not.toBeInTheDocument();
    expect(screen.queryByText('Cerebellum')).not.toBeInTheDocument();
  });

  function Provider() {
    return (
      <TestProvider
        initialValues={[
          [sessionAtom, { accessToken: 'abc' }],
          [sectionAtom, 'test'],
          [brainRegionHierarchyStateAtom, {}],
        ]}
      >
        <BrainRegions />
      </TestProvider>
    );
  }
});

describe('Default brain region panel in buid', () => {
  beforeEach(() => {
    render(Provider());
  });

  test('show empty search', async () => {
    await screen.findByText('Search region...', { selector: `span:not([title])` });
  });

  test('show only root in tree', async () => {
    await screen.findByText('Basic Cell Groups and Regions');
    expect(screen.queryByText('Cerebrum')).not.toBeInTheDocument();
    expect(screen.queryByText('Cerebellum')).not.toBeInTheDocument();
  });

  function Provider() {
    return (
      <TestProvider
        initialValues={[
          [sessionAtom, { accessToken: 'abc' }],
          [sectionAtom, 'build'],
          [brainRegionHierarchyStateAtom, {}],
        ]}
      >
        <BrainRegions />
      </TestProvider>
    );
  }
});
