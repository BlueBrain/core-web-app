import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';

import { sectionAtom } from '@/state/application';
import { idAtom as brainModelConfigIdAtom } from '@/state/brain-model-config';
import BrainRegions from '@/components/build-section/BrainRegionSelector/BrainRegions';
import sessionAtom from '@/state/session';
import {
  defaultIncreasedTimeout,
  previouslySelectedRegion,
  queryParamRegion,
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

jest.mock('nuqs', () => ({
  __esModule: true,
  useQueryState: () => [queryParamRegion, jest.fn()],
}));

jest.mock('src/util/utils.ts', () => {
  const utils = jest.requireActual('src/util/utils.ts');
  return {
    ...utils,
    getInitializationValue: () => previouslySelectedRegion,
  };
});

const defaultRegion = 'Interbrain';

async function checkDefaultBrainTreeExpanded() {
  const selector = `div[data-tree-id] button > ${regionContainerSelector}`;
  await screen.findByText('Basic Cell Groups and Regions', { selector });
  await screen.findByText('Brain Stem', { selector });
  await screen.findByText('Cerebrum', { selector });
  await screen.findByText('Cerebellum', { selector });
}

describe('Using query param region in explore', () => {
  beforeEach(async () => {
    Object.defineProperty(window, 'location', {
      value: {
        assign: jest.fn(),
        search: `?brainRegion=${queryParamRegion}`,
      },
    });

    await waitFor(() => render(Provider()));
  });

  test('show default expanded tree until query region', async () => {
    await checkDefaultBrainTreeExpanded();

    expect(
      await screen.queryByText(defaultRegion, { selector: `button > ${regionContainerSelector}` })
    ).toBeInTheDocument();
  });

  test('saved value not to be displayed', async () => {
    expect(
      await screen.queryByText(previouslySelectedRegion.value.title, {
        selector: `button > ${regionContainerSelector}`,
      })
    ).not.toBeInTheDocument();
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

describe('Using query param region in buid', () => {
  beforeEach(async () => {
    await waitFor(() => render(Provider()));
  });

  test('show default expanded tree instead of expanding until query region', async () => {
    await checkDefaultBrainTreeExpanded();

    expect(
      await screen.queryByText(defaultRegion, { selector: `button > ${regionContainerSelector}` })
    ).not.toBeInTheDocument();
  });

  test('saved to be displayed', async () => {
    expect(
      await screen.queryByText(previouslySelectedRegion.value.title, {
        selector: `button > ${regionContainerSelector}`,
      })
    ).not.toBeInTheDocument();
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
