import { useAtom, useAtomValue } from 'jotai';
import { useEffect, useMemo } from 'react';
import lodashMap from 'lodash/map';
import omit from 'lodash/omit';
import intersection from 'lodash/intersection';
import { unwrap } from 'jotai/utils';

import {
  brainRegionsAtom,
  dataBrainRegionsAtom,
  selectedBrainRegionAtom,
  selectedBrainRegionsWithChildrenAtom,
} from '@/state/brain-regions';
import { sectionAtom } from '@/state/application';
import { getBrainRegionDescendants } from '@/state/brain-regions/descendants';
import { generateHierarchyPathTree, getAncestors } from '@/components/BrainTree/util';
import { setInitializationValue } from '@/util/utils';
import {
  DEFAULT_BRAIN_REGION_STORAGE_KEY,
  DEFAULT_BRAIN_REGION,
} from '@/constants/brain-hierarchy';
import { DefaultBrainRegionType } from '@/state/brain-regions/types';

export function useCollectExperimentalData() {
  const sectionName = useAtomValue(sectionAtom);
  const selectedBrainRegion = useAtomValue(selectedBrainRegionAtom);
  const [dataBrainRegions, setDataBrainRegions] = useAtom(dataBrainRegionsAtom);
  const id = selectedBrainRegion?.id;
  const brainRegions = useAtomValue(
    useMemo(() => unwrap(getBrainRegionDescendants(id ? [id] : [])), [id])
  );
  const selectedBrainRegionsAndChildren = useAtomValue(selectedBrainRegionsWithChildrenAtom);

  useEffect(() => {
    if (!selectedBrainRegion || !id || !dataBrainRegions || !brainRegions) return;
    if (dataBrainRegions?.[id]) return;
    if (sectionName !== 'explore') return;

    const childrenOfCurrent = lodashMap(brainRegions, 'id');

    let updatedDataBrainRegions: Record<string, string[]>;

    if (selectedBrainRegionsAndChildren.includes(id)) {
      const brainRegionsToRemove = [id, ...childrenOfCurrent];

      // Remove manually selected brainRegions
      updatedDataBrainRegions = omit(dataBrainRegions, brainRegionsToRemove);

      // Remove automatically selected brainRegions (which are present inside the arrays of `dataBrainRegions`)
      Object.entries(updatedDataBrainRegions).forEach(([parent, children]) => {
        if (intersection(children, brainRegionsToRemove).length > 0) {
          updatedDataBrainRegions[parent] = children.filter(
            (child) => !brainRegionsToRemove.includes(child)
          );
        }
      });
    } else {
      updatedDataBrainRegions = { [id]: [...childrenOfCurrent] };
    }

    setDataBrainRegions(updatedDataBrainRegions);
  }, [
    selectedBrainRegion,
    brainRegions,
    dataBrainRegions,
    id,
    selectedBrainRegionsAndChildren,
    setDataBrainRegions,
    sectionName,
  ]);
}

export function useSaveHierarchy() {
  const sectionName = useAtomValue(sectionAtom);
  const selectedBrainRegion = useAtomValue(selectedBrainRegionAtom);
  const brainRegions = useAtomValue(unwrap(brainRegionsAtom));

  useEffect(() => {
    if (!brainRegions || !selectedBrainRegion || !sectionName) return;

    const ancestors = getAncestors(brainRegions, selectedBrainRegion.id);

    const brainRegionHierarchy = generateHierarchyPathTree(
      ancestors.map((ancestor) => Object.keys(ancestor)[0])
    );

    setInitializationValue(DEFAULT_BRAIN_REGION_STORAGE_KEY, {
      ...DEFAULT_BRAIN_REGION,
      value: selectedBrainRegion,
      // keep only the selected region path in the tree
      brainRegionHierarchyState: brainRegionHierarchy ?? {},
    } satisfies DefaultBrainRegionType);
  }, [selectedBrainRegion, brainRegions, sectionName]);
}
