import { render, screen } from '@testing-library/react';
import { Provider } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';

import { sectionAtom } from '@/state/application';
import { idAtom as brainModelConfigIdAtom } from '@/state/brain-model-config';
import BrainRegions from '@/components/build-section/BrainRegionSelector/BrainRegions';
import sessionAtom from '@/state/session';

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
    await screen.findByText(defaultRegion, { selector: `span[title=${defaultRegion}]` }, { timeout: 10_000 });
  });

  test('show Cerebrum in tree', async () => {
    await screen.findByText(defaultRegion, { selector: `:not(span[title=${defaultRegion}])` });
  });

  test('show expanded tree', async () => {
    const selector = 'div[data-tree-id] span';
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
          [sectionAtom, 'test'],
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
        ]}
      >
        <BrainRegions />
      </TestProvider>
    );
  }
});
