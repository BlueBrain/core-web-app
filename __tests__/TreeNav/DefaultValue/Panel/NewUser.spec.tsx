import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';

import { sectionAtom } from '@/state/application';
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

window.HTMLElement.prototype.scrollIntoView = jest.fn();

global.ResizeObserver = class MockedResizeObserver {
  observe = jest.fn();

  unobserve = jest.fn();

  disconnect = jest.fn();
};

async function checkDefaultBrainTreeExpanded() {
  const selector = `div[data-tree-id] button > ${regionContainerSelector}`;
  await screen.findByText('Basic Cell Groups and Regions', { selector });
  await screen.findByText('Brain Stem', { selector });
  await screen.findByText('Cerebrum', { selector });
  await screen.findByText('Cerebellum', { selector });
}

describe('Default brain region panel in explore', () => {
  beforeEach(async () => {
    await waitFor(() => render(Provider()));
  });

  const defaultRegion = 'Cerebrum';

  test('show Cerebrum region tree', async () => {
    await screen.findByText(
      defaultRegion,
      { selector: `button > ${regionContainerSelector}` },
      { timeout: defaultIncreasedTimeout }
    );
  });

  test('show expanded tree', checkDefaultBrainTreeExpanded);

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
  beforeEach(async () => {
    await waitFor(() => render(Provider()));
  });

  test('show empty search', async () => {
    await screen.findByText('Search region...', { selector: `div.ant-select span:not([title])` });
  });

  test('show default region tree', checkDefaultBrainTreeExpanded);

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
  beforeEach(async () => {
    await waitFor(() => render(Provider()));
  });

  test('show empty search', async () => {
    await screen.findByText('Search region...', { selector: `span:not([title])` });
  });

  test('show default region tree', checkDefaultBrainTreeExpanded);

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
