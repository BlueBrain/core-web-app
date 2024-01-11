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
  previouslySelectedRegion,
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

jest.mock('src/util/utils.ts', () => ({
  getInitializationValue: () => previouslySelectedRegion,
}));

describe('Show previous chosen brain region in explore', () => {
  beforeEach(async () => {
    render(Provider());
  });

  test('show saved if new not new user', () => {
    screen.getByText(previouslySelectedRegion.value.title, { selector: brainRegionSelector });
  });

  test('show opened based on previously selected brain region', () => {
    screen.getByText(JSON.stringify(previouslySelectedRegion.brainRegionHierarchyState), {
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

describe('Show previous chosen brain region in build', () => {
  beforeEach(async () => {
    render(Provider());
  });

  test('show saved if new not new user', () => {
    screen.getByText(previouslySelectedRegion.value.title, { selector: brainRegionSelector });
  });

  test('show opened based on previously selected brain region', () => {
    screen.getByText(JSON.stringify(previouslySelectedRegion.brainRegionHierarchyState), {
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
