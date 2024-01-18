import { act, render, screen, waitFor } from '@testing-library/react';
import { Provider, useAtomValue } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';

import { selectedBrainRegionAtom, brainRegionHierarchyStateAtom } from '@/state/brain-regions';
import { sectionAtom } from '@/state/application';
import { idAtom as brainModelConfigIdAtom } from '@/state/brain-model-config';
import {
  brainRegionSelector,
  brainRegionSelectorId,
  brainTreeUntilIsocortex,
  hierarchySelector,
  hierarchySelectorId,
  previouslySelectedRegion,
} from '__tests__/__utils__/BrainRegionPanel/constants';
import { useSetBrainRegionFromQuery, useExpandRegionTree } from '@/hooks/brain-region-panel';
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

jest.mock('src/util/utils.ts', () => ({
  setInitializationValue: () => {},
  getInitializationValue: () => previouslySelectedRegion,
}));

async function showSavedOpenRegionTree() {
  await screen.findByText(JSON.stringify(brainTreeUntilIsocortex), { selector: hierarchySelector });
}

describe('Show previous chosen brain region in explore', () => {
  beforeEach(async () => {
    await waitFor(() => render(Provider()));
  });

  test('show saved brain region', () => {
    screen.getByText(previouslySelectedRegion.value.title, { selector: brainRegionSelector });
  });

  test('show opened region tree based on saved', showSavedOpenRegionTree);

  function Provider() {
    return (
      <TestProvider
        initialValues={[
          [sessionAtom, { accessToken: 'abc' }],
          [sectionAtom, 'explore'],
          [brainModelConfigIdAtom, '123'],
        ]}
      >
        <TestComponent />
      </TestProvider>
    );
  }
});

describe('Show previous chosen brain region in build', () => {
  beforeEach(async () => {
    await waitFor(() => render(Provider()));
  });

  test('show saved brain region', () => {
    screen.getByText(previouslySelectedRegion.value.title, { selector: brainRegionSelector });
  });

  test('show opened region tree based on saved', showSavedOpenRegionTree);

  function Provider() {
    return (
      <TestProvider
        initialValues={[
          [sessionAtom, { accessToken: 'abc' }],
          [sectionAtom, 'build'],
          [brainModelConfigIdAtom, '123'],
        ]}
      >
        <TestComponent />
      </TestProvider>
    );
  }
});

function TestComponent() {
  const selectedBrainRegion = useAtomValue(selectedBrainRegionAtom);
  const brainRegionHierarchyState = useAtomValue(brainRegionHierarchyStateAtom);
  useSetBrainRegionFromQuery();
  useExpandRegionTree();

  return (
    <>
      <div id={brainRegionSelectorId}>{selectedBrainRegion?.title}</div>
      <div id={hierarchySelectorId}>{JSON.stringify(brainRegionHierarchyState)}</div>
    </>
  );
}
