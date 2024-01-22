import { render, screen } from '@testing-library/react';
import { Provider, useAtomValue } from 'jotai';
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
    <Provider>
      <HydrateAtoms initialValues={initialValues}>{children}</HydrateAtoms>
    </Provider>
  );
}

describe('Default brain region in explore', () => {
  beforeEach(async () => {
    render(Provider());
  });

  test('show Cerebrum', () => {
    screen.getByText('Cerebrum', { selector: brainRegionSelector });
  });

  test('show opened tree', () => {
    screen.getByText('{"http://api.brain-map.org/api/v2/data/Structure/8":null}', {
      selector: hierarchySelector,
    });
  });

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
    render(Provider());
  });

  test('show no brain region selected', () => {
    screen.getByText('', { selector: brainRegionSelector });
  });

  test('show not opened tree', () => {
    screen.getByText('null', { selector: hierarchySelector });
  });

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
    render(Provider());
  });

  test('do not select any brain region', () => {
    screen.getByText('', { selector: brainRegionSelector });
  });

  test('show opened tree', () => {
    screen.getByText('{"http://api.brain-map.org/api/v2/data/Structure/8":null}', {
      selector: hierarchySelector,
    });
  });

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
