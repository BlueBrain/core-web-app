import { useCallback, useMemo } from 'react';
import { useAtomValue } from 'jotai';

import { compositionAtom } from '@/state/build-composition';
import {
  brainRegionByIdMapAtom,
  brainRegionByNotationMapAtom,
  brainRegionIdxByNotationMapAtom,
  brainRegionNotationByIdMapAtom,
  brainRegionsUnsortedArrayAtom,
} from '@/state/brain-regions';
import { BrainRegion } from '@/types/ontologies';

/**
 * A hook to create a map which provides a list of available in the cell composition m-types
 * by a brain region notation.
 */
export function useBrainRegionMtypeMap(): Map<string, string[]> {
  const brainRegionNotationByIdMap = useAtomValue(brainRegionNotationByIdMapAtom);
  const cellComposition = useAtomValue(compositionAtom);

  const brainRegionMtypeMap = useMemo(() => {
    if (!cellComposition) return new Map();

    return Object.keys(cellComposition?.hasPart ?? {}).reduce((map, brainRegionFullId) => {
      const id = brainRegionFullId.split('/').reverse()[0];

      const brainRegionNotation = brainRegionNotationByIdMap?.get(id);

      const mtypes = Object.values(cellComposition?.hasPart[brainRegionFullId].hasPart ?? {})
        .map((mtypeEntry) => mtypeEntry.label)
        .sort();

      return map.set(brainRegionNotation, mtypes);
    }, new Map());
  }, [cellComposition, brainRegionNotationByIdMap]);

  return brainRegionMtypeMap;
}

/**
 * A hook to sort a list of brain region notations according their initial ordering in the brain hierarchy.
 */
export function useBrainRegionNotationSorterFn() {
  const brainRegionIdxByNotationMap = useAtomValue(brainRegionIdxByNotationMapAtom);

  const sorterFn = useCallback(
    (brainRegionNotationA: string, brainRegionNotationB: string) => {
      if (!brainRegionIdxByNotationMap) return 0;

      const idxA = brainRegionIdxByNotationMap.get(brainRegionNotationB);
      const idxB = brainRegionIdxByNotationMap.get(brainRegionNotationA);

      if (typeof idxA !== 'number' || typeof idxB !== 'number') {
        throw new Error(
          `Failed to get idx for one of brain regions: ${brainRegionNotationA}, ${brainRegionNotationB}`
        );
      }

      return idxB - idxA;
    },
    [brainRegionIdxByNotationMap]
  );

  return sorterFn;
}

/**
 * Create a function to construct a map of label descriptions such as:
 * * Label has one of the following format:
 *   * `${brainRegionNotation}`
 *   * `${brainRegionNotation}.${mtype}`
 * * Description is formatted accordingly as:
 *   * `${brainRegionTitle}`
 *   * `${brainRegionTitle} - ${mtype}`
 */
export function useCreateLabelDescriptionMap(): (labels: string[]) => Map<string, string> {
  const brainRegionByNotationMap = useAtomValue(brainRegionByNotationMapAtom);

  return useCallback(
    (labels: string[]) =>
      labels.reduce((map, label) => {
        const [brainRegionNotation, mtype] = label.split('.');

        const brainRegionTitle = brainRegionByNotationMap?.get(brainRegionNotation)?.title;
        const mtypeSuffix = mtype ? ` - ${mtype}` : '';

        return map.set(label, `${brainRegionTitle}${mtypeSuffix}`);
      }, new Map()),
    [brainRegionByNotationMap]
  );
}

export function useGetLeafNodesReduceFn() {
  const brainRegionByNotationMap = useAtomValue(brainRegionByNotationMapAtom);
  const brainRegionByIdMap = useAtomValue(brainRegionByIdMapAtom);

  return useCallback(
    (map: Map<string, string[]>, notation: string) => {
      const leafNotations = brainRegionByNotationMap
        ?.get(notation)
        ?.leaves?.map((leaf) => brainRegionByIdMap?.get(leaf.split('/').reverse()[0]))
        ?.filter((br) => br?.representedInAnnotation)
        ?.map((br) => br?.notation as string);

      // Skip nodes with all the children not represented in annotations.
      if (Array.isArray(leafNotations) && leafNotations.length === 0) {
        return map;
      }

      return map.set(notation, leafNotations ?? [notation]);
    },
    [brainRegionByNotationMap, brainRegionByIdMap]
  );
}

export function useGetChildNotations() {
  const brainRegionByNotationMap = useAtomValue(brainRegionByNotationMapAtom);
  const brainRegionByIdMap = useAtomValue(brainRegionByIdMapAtom);

  const brainRegionNotationSorterFn = useBrainRegionNotationSorterFn();
  const brainRegionMtypeMap = useBrainRegionMtypeMap();

  return (brainRegionNotation: string): string[] => {
    if (brainRegionNotation.includes('.')) {
      return [brainRegionNotation];
    }

    const brainRegion = brainRegionByNotationMap?.get(brainRegionNotation);

    if (!brainRegion) return [];

    const childNotations =
      brainRegion.hasPart
        ?.map((strId) => brainRegionByIdMap?.get(strId.split('/').at(-1) as string) as BrainRegion)
        .filter((br) => br?.representedInAnnotation)
        .map((br) => br?.notation)
        .sort(brainRegionNotationSorterFn) ??
      brainRegionMtypeMap
        .get(brainRegionNotation)
        ?.map((mtype) => `${brainRegionNotation}.${mtype}`);

    return childNotations;
  };
}

export function useGetHigherLevelNodes() {
  const brainRegions = useAtomValue(brainRegionsUnsortedArrayAtom);
  const brainRegionByNotationMap = useAtomValue(brainRegionByNotationMapAtom);
  const brainRegionByIdMap = useAtomValue(brainRegionByIdMapAtom);

  const brainRegionNotationSorterFn = useBrainRegionNotationSorterFn();

  return (brainRegionNotation: string): string[] => {
    if (!brainRegions) return [];

    const brainRegion = brainRegionByNotationMap?.get(brainRegionNotation);

    if (!brainRegion) {
      throw new Error(`Can not find brain region with notation: ${brainRegionNotation}`);
    }

    const parentBrainRegionId = brainRegion?.isPartOf;

    if (!parentBrainRegionId) {
      throw new Error(`Can not find parent node for brain region id: ${brainRegion.id}`);
    }

    const parentBrainRegion = brainRegionByIdMap?.get(parentBrainRegionId);

    return brainRegions
      .filter((br) => br.isPartOf === parentBrainRegion?.isPartOf)
      .filter((br) => br.representedInAnnotation)
      .map((br) => br.notation)
      .sort(brainRegionNotationSorterFn);
  };
}

/**
 * A hook to detect if nodes represented by their labels are siblings.
 *
 * Label format: `${brainRegionNotation}.${mtype}`, with m-type part being optional.
 */
export function useAreSiblings() {
  const brainRegionByNotationMap = useAtomValue(brainRegionByNotationMapAtom);

  return useCallback(
    (labels: string[]): boolean => {
      if (!brainRegionByNotationMap) {
        throw new Error('No brainRegionByNotationMap present');
      }

      const parsedLabels = labels.map((label) => label.split('.'));

      const brainRegionNotations = parsedLabels.map(([brainRegionNotation]) => brainRegionNotation);
      const mtypes = parsedLabels.map(([, mtype]) => mtype);

      const nMtypeLevelNodes = mtypes.filter(Boolean).length;

      // Not siblings if nodes belong to different levels (brain region, mtype).
      if (nMtypeLevelNodes > 0 && nMtypeLevelNodes < parsedLabels.length) return false;

      const nUniqBrainRegions = new Set(brainRegionNotations).size;

      // Not siblings if all nodes are of the mtype level and they do not share a common brain region.
      if (nMtypeLevelNodes === parsedLabels.length && nUniqBrainRegions !== 1) return false;

      const parentBrainRegionIds = brainRegionNotations
        .map(
          (brainRegionNotation) => brainRegionByNotationMap?.get(brainRegionNotation) as BrainRegion
        )
        .map((brainRegion) => brainRegion.isPartOf);

      const nUniqParentBrainRegions = new Set(parentBrainRegionIds).size;

      // Not siblings if all nodes are of the brain region level and they do not share a common parent brain region.
      if (nMtypeLevelNodes === 0 && nUniqParentBrainRegions !== 1) return false;

      return true;
    },
    [brainRegionByNotationMap]
  );
}

export function useAreTopLevelNodes() {
  const brainRegionByNotationMap = useAtomValue(brainRegionByNotationMapAtom);

  return useCallback(
    (labels: string[]): boolean => {
      const parsedLabels = labels.map((label) => label.split('.'));
      const brainRegionNotations = parsedLabels.map(([brainRegionNotation]) => brainRegionNotation);
      const parentBrainRegionIds = brainRegionNotations
        .map(
          (brainRegionNotation) => brainRegionByNotationMap?.get(brainRegionNotation) as BrainRegion
        )
        .map((brainRegion) => brainRegion.isPartOf);

      const nUniqParentBrainRegions = new Set(parentBrainRegionIds).size;

      // TODO create a constant for the Whole Brain region id, replace all hardcoded occurences across the app.
      return nUniqParentBrainRegions === 1 && parentBrainRegionIds[0] === '8';
    },
    [brainRegionByNotationMap]
  );
}
