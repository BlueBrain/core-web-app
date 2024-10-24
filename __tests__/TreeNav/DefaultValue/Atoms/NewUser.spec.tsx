import { render, screen, waitFor } from '@testing-library/react';
import { Provider as JotaiProvider, useAtomValue } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';

import { selectedBrainRegionAtom, brainRegionHierarchyStateAtom } from '@/state/brain-regions';
import { sectionAtom } from '@/state/application';
import { idAtom as brainModelConfigIdAtom } from '@/state/brain-model-config';
import {
  brainRegionSelector,
  brainRegionSelectorId,
  hierarchySelector,
  hierarchySelectorId,
} from '__tests__/__utils__/BrainRegionPanel/constants';

const HydrateAtoms = ({ initialValues, children }: any) => {
  useHydrateAtoms(initialValues);
  return children;
};

function TestProvider({ initialValues, children }: any) {
  return (
    <JotaiProvider>
      <HydrateAtoms initialValues={initialValues}>{children}</HydrateAtoms>
    </JotaiProvider>
  );
}

function showDefaultOpenRegionTree() {
  screen.getByText('{"http://api.brain-map.org/api/v2/data/Structure/8":null}', {
    selector: hierarchySelector,
  });
}

describe('Default brain region in explore', () => {
  beforeEach(async () => {
    await waitFor(() => render(Provider()));
  });

  test('show Cerebrum', () => {
    /*
     * as brain region is set later with the proper leaves (for calculating the composition)
     * by the hook useSetBrainRegionFromQuery (src/hooks/brain-region-panel.ts) the atom is not null
     */
    screen.getByText('', { selector: brainRegionSelector });
  });

  test('show opened tree', showDefaultOpenRegionTree);

  function Provider() {
    return (
      <TestProvider
        initialValues={[
          [sectionAtom, 'explore'],
          [brainModelConfigIdAtom, '123'],
        ]}
      >
        <TestComponent />
      </TestProvider>
    );
  }
});

describe('No section set', () => {
  beforeEach(async () => {
    await waitFor(() => render(Provider()));
  });

  test('show no brain region selected', () => {
    screen.getByText('', { selector: brainRegionSelector });
  });

  test('show opened tree', showDefaultOpenRegionTree);

  function Provider() {
    return (
      <TestProvider initialValues={[]}>
        <TestComponent />
      </TestProvider>
    );
  }
});

describe('Default brain region in build', () => {
  beforeEach(async () => {
    await waitFor(() => render(Provider()));
  });

  test('do not select any brain region', () => {
    screen.getByText('', { selector: brainRegionSelector });
  });

  test('show opened tree', showDefaultOpenRegionTree);

  function Provider() {
    return (
      <TestProvider
        initialValues={[
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

  return (
    <>
      <div id={brainRegionSelectorId}>{selectedBrainRegion?.title}</div>
      <div id={hierarchySelectorId}>{JSON.stringify(brainRegionHierarchyState)}</div>
    </>
  );
}
