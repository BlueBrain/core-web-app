import { act, render, renderHook, screen, waitFor } from '@testing-library/react';
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
import { useSetBrainRegionFromQuery } from '@/hooks/brain-region-panel';

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
window.HTMLElement.prototype.scrollIntoView = jest.fn();

const queryParamRegionName = 'Interbrain';

async function checkDefaultBrainTreeExpanded() {
  const selector = `div[data-tree-id] button > ${regionContainerSelector}`;
  await screen.findByText(
    'Basic Cell Groups and Regions',
    { selector },
    { timeout: defaultIncreasedTimeout }
  );
  await screen.findByText('Brain Stem', { selector });
  await screen.findByText('Cerebrum', { selector });
  await screen.findByText('Cerebellum', { selector });
}

describe('Using query param region in explore', () => {
  beforeEach(async () => {
    Object.defineProperty(window, 'location', {
      value: {
        assign: jest.fn(),
        search: `?brainRegion=${queryParamRegionName}`,
      },
    });

    await waitFor(() => render(Provider()));
  });

  test('show default expanded tree until query region', async () => {
    await checkDefaultBrainTreeExpanded();

    expect(
      screen.queryByText(queryParamRegionName, { selector: `button > ${regionContainerSelector}` })
    ).toBeInTheDocument();
  });

  test('saved brain region not to be displayed (query param has priority)', async () => {
    expect(
      screen.queryByText(previouslySelectedRegion.value.title, {
        selector: `button > ${regionContainerSelector}`,
      })
    ).not.toBeInTheDocument();
  });

  function ExploreContext() {
    useSetBrainRegionFromQuery();
    return null;
  }

  function Provider() {
    return (
      <TestProvider
        initialValues={[
          [sessionAtom, { accessToken: 'abc' }],
          [sectionAtom, 'explore'],
          [brainModelConfigIdAtom, '123'],
        ]}
      >
        <ExploreContext />
        <BrainRegions />
      </TestProvider>
    );
  }
});

describe('Using query param region in build', () => {
  beforeEach(async () => {
    Object.defineProperty(window, 'location', {
      value: {
        assign: jest.fn(),
        search: `?brainRegion=${queryParamRegionName}`,
      },
    });
    await waitFor(() => render(Provider()));
  });

  test('show saved region tree instead of query param region', async () => {
    await checkDefaultBrainTreeExpanded();

    expect(
      screen.queryByText(queryParamRegionName, { selector: `button > ${regionContainerSelector}` })
    ).not.toBeInTheDocument();

    expect(
      screen.queryByText(previouslySelectedRegion.value.title, {
        selector: `button > ${regionContainerSelector}`,
      })
    ).toBeInTheDocument();
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
