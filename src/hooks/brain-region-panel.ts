import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useEffect, useMemo } from 'react';
import { unwrap } from 'jotai/utils';
import { useQueryState } from 'nuqs';
import isEqual from 'lodash/isEqual';

import {
  brainRegionHierarchyStateAtom,
  brainRegionsAtom,
  selectedBrainRegionAtom,
  setSelectedBrainRegionAtom,
} from '@/state/brain-regions';
import { sectionAtom } from '@/state/application';
import {
  brainRegionIdQueryParamKey,
  defaultHierarchyTree,
} from '@/constants/explore-section/default-brain-region';
import { generateHierarchyPathTree, getAncestors } from '@/components/BrainTree/util';
import { DefaultBrainRegionType } from '@/state/brain-regions/types';
import {
  DEFAULT_BRAIN_REGION_STORAGE_KEY,
  DEFAULT_BRAIN_REGION,
} from '@/constants/brain-hierarchy';
import { setInitializationValue } from '@/util/utils';

// This hook will handle the selected the brain region if it is passed as query param
export function useBrainRegionFromQuery() {
  const sectionName = useAtomValue(sectionAtom);
  const selectedBrainRegion = useAtomValue(selectedBrainRegionAtom);
  const brainRegions = useAtomValue(useMemo(() => unwrap(brainRegionsAtom), []));
  const [brainRegionIdInQuery, setBrainRegionIdInQuery] = useQueryState(brainRegionIdQueryParamKey);
  const setSelectedBrainRegion = useSetAtom(setSelectedBrainRegionAtom);
  const [brainRegionHierarchyState, setBrainRegionHierarchyState] = useAtom(
    brainRegionHierarchyStateAtom
  );

  useEffect(() => {
    // Setting brain region in app based on query
    if (sectionName !== 'explore') return;
    if (selectedBrainRegion) return;
    if (!brainRegions || !brainRegions.length) return;
    if (!brainRegionIdInQuery) return;

    const decodedId = decodeURIComponent(brainRegionIdInQuery || '');
    const foundBrainRegion = brainRegions.find((brainRegion) => brainRegion.id === decodedId);
    if (!foundBrainRegion) return;

    const { id, title, leaves, representedInAnnotation } = foundBrainRegion;
    setSelectedBrainRegion(id, title, leaves ?? null, representedInAnnotation);
  }, [
    selectedBrainRegion,
    brainRegions,
    sectionName,
    brainRegionIdInQuery,
    setSelectedBrainRegion,
  ]);

  useEffect(() => {
    // set new brain region in query param and save in storage
    if (sectionName !== 'explore') return;
    if (!selectedBrainRegion) return;

    const encodedRegionId = encodeURIComponent(selectedBrainRegion.id);
    if (encodedRegionId === brainRegionIdInQuery) {
      return;
    }
    setBrainRegionIdInQuery(encodedRegionId);
    setInitializationValue(DEFAULT_BRAIN_REGION_STORAGE_KEY, {
      ...DEFAULT_BRAIN_REGION,
      value: selectedBrainRegion,
    } satisfies DefaultBrainRegionType);
  }, [selectedBrainRegion, sectionName, setBrainRegionIdInQuery, brainRegionIdInQuery]);

  useEffect(() => {
    // Opening up the three until selected region
    if (!selectedBrainRegion || !brainRegions || !brainRegions.length) return;
    // change only the first time
    if (!brainRegionHierarchyState || !isEqual(brainRegionHierarchyState, defaultHierarchyTree)) {
      return;
    }

    const ancestors = getAncestors(brainRegions, selectedBrainRegion.id);

    const brainRegionHierarchy = generateHierarchyPathTree(
      ancestors.map((ancestor) => Object.keys(ancestor)[0])
    );

    setBrainRegionHierarchyState(brainRegionHierarchy ?? {});
  }, [
    selectedBrainRegion,
    brainRegions,
    sectionName,
    setBrainRegionIdInQuery,
    brainRegionIdInQuery,
    setBrainRegionHierarchyState,
    brainRegionHierarchyState,
  ]);
}
