import { useCallback, useMemo } from 'react';
import { useAtomValue } from 'jotai';
import isNumber from 'lodash/isNumber';

import { PathwaySideSelection as Selection, MicroConnectomeEditEntry } from '@/types/connectome';
import { compositionAtom } from '@/state/build-composition';
import { editsLoadableAtom } from '@/state/brain-model-config/micro-connectome';
import {
  brainRegionByIdMapAtom,
  brainRegionByNotationMapAtom,
  brainRegionIdxByNotationMapAtom,
  brainRegionNotationByIdMapAtom,
  brainRegionsUnsortedArrayAtom,
} from '@/state/brain-regions';
import { BrainRegion } from '@/types/ontologies';
import { useLoadable } from '@/hooks/hooks';
import { BASIC_CELL_GROUPS_AND_REGIONS_ID } from '@/constants/brain-hierarchy';

/**
 * A hook to create a map which provides a list of available in the cell composition m-types
 * by a brain region notation (only for leaf nodes that are defined in cell composition config).
 */
export function useLeafBrainRegionMtypeMap(): Map<string, string[]> {
  const brainRegionNotationByIdMap = useAtomValue(brainRegionNotationByIdMapAtom);
  const cellComposition = useAtomValue(compositionAtom);

  const leafBrainRegionMtypeMap = useMemo(() => {
    if (!cellComposition) return new Map();

    return Object.keys(cellComposition?.hasPart ?? {}).reduce((map, brainRegionId) => {
      const brainRegionNotation = brainRegionNotationByIdMap?.get(brainRegionId);

      const mtypes = Object.values(cellComposition?.hasPart[brainRegionId].hasPart ?? {})
        .map((mtypeEntry) => mtypeEntry.label)
        .sort();

      return map.set(brainRegionNotation, mtypes);
    }, new Map());
  }, [cellComposition, brainRegionNotationByIdMap]);

  return leafBrainRegionMtypeMap;
}

/**
 * A hook to create a map which provides a set of available in the cell composition m-types
 * by a brain region notation (including non-leaf nodes)
 */
export function useBrainRegionMtypeMap(): Map<string, Set<string>> {
  const brainRegions = useAtomValue(brainRegionsUnsortedArrayAtom);
  const brainRegionNotationByIdMap = useAtomValue(brainRegionNotationByIdMapAtom);

  const leafBrainRegionMtypeMap = useLeafBrainRegionMtypeMap();

  const brainRegionMtypeMap = useMemo(() => {
    if (!brainRegions) return new Map();

    return brainRegions?.reduce((map, brainRegion) => {
      const mtypeSet: Set<string> = new Set();

      // If the current brain region isn't a leaf node
      brainRegion.leaves?.forEach((leafId) => {
        const notation = brainRegionNotationByIdMap?.get(leafId) as string;
        leafBrainRegionMtypeMap.get(notation)?.forEach((mtype) => mtypeSet.add(mtype));
      });

      // Otherwise
      leafBrainRegionMtypeMap.get(brainRegion.notation)?.forEach((mtype) => mtypeSet.add(mtype));

      return map.set(brainRegion.notation, mtypeSet);
    }, new Map());
  }, [brainRegionNotationByIdMap, brainRegions, leafBrainRegionMtypeMap]);

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
 * A hook providing a sorter function for data of Selection type.
 */
export function useSelectionSorterFn() {
  const brainRegionNotationSorterFn = useBrainRegionNotationSorterFn();

  const sorterFn = useCallback(
    (selectionA: Selection, selectionB: Selection) =>
      brainRegionNotationSorterFn(selectionA.brainRegionNotation, selectionB.brainRegionNotation),
    [brainRegionNotationSorterFn]
  );

  return sorterFn;
}

/**
 * Create a function to construct a map of selection descriptions which is formatted as:
 * `${brainRegionTitle}` or `${brainRegionTitle} - ${mtype}`
 */
export function useCreateBrainRegionNotationTitleMap(): (
  selections: Selection[]
) => Map<string, string> {
  const brainRegionByNotationMap = useAtomValue(brainRegionByNotationMapAtom);

  return useCallback(
    (selections: Selection[]) =>
      selections.reduce((map, selection) => {
        const { brainRegionNotation } = selection;
        const brainRegionTitle = brainRegionByNotationMap?.get(brainRegionNotation)?.title;

        return map.set(brainRegionNotation, brainRegionTitle);
      }, new Map()),
    [brainRegionByNotationMap]
  );
}

export function useGetLeafNodesReduceFn() {
  const brainRegionByNotationMap = useAtomValue(brainRegionByNotationMapAtom);
  const brainRegionByIdMap = useAtomValue(brainRegionByIdMapAtom);

  return useCallback(
    (map: Map<Selection, string[]>, selection: Selection) => {
      const leafNotations = brainRegionByNotationMap
        ?.get(selection.brainRegionNotation)
        ?.leaves?.map((leafId) => brainRegionByIdMap?.get(leafId))
        ?.filter((br) => br?.representedInAnnotation)
        ?.map((br) => br?.notation as string);

      // Skip nodes with all the children not represented in annotations.
      if (Array.isArray(leafNotations) && leafNotations.length === 0) {
        return map;
      }

      return map.set(selection, leafNotations ?? [selection.brainRegionNotation]);
    },
    [brainRegionByNotationMap, brainRegionByIdMap]
  );
}

export function useGetChildSelections() {
  const brainRegionByNotationMap = useAtomValue(brainRegionByNotationMapAtom);
  const brainRegionByIdMap = useAtomValue(brainRegionByIdMapAtom);

  const brainRegionNotationSorterFn = useBrainRegionNotationSorterFn();
  const leafBrainRegionMtypeMap = useLeafBrainRegionMtypeMap();

  return (selection: Selection): Selection[] => {
    if (selection.mtype) {
      return [selection];
    }

    const brainRegion = brainRegionByNotationMap?.get(selection.brainRegionNotation);

    if (!brainRegion) return [];

    const childSelections =
      brainRegion.hasPart
        ?.map((strId) => brainRegionByIdMap?.get(strId) as BrainRegion)
        .filter((br) => br?.representedInAnnotation)
        .map((br) => br?.notation)
        .sort(brainRegionNotationSorterFn)
        .map((brainRegionNotation) => ({ brainRegionNotation })) ??
      leafBrainRegionMtypeMap
        .get(selection.brainRegionNotation)
        ?.map((mtype) => ({ brainRegionNotation: selection.brainRegionNotation, mtype }));

    // Return current selection if all child nodes are not represented in annotation.
    return Array.isArray(childSelections) && childSelections.length !== 0
      ? childSelections
      : [selection];
  };
}

export function useGetParentSelections() {
  const brainRegions = useAtomValue(brainRegionsUnsortedArrayAtom);
  const brainRegionByNotationMap = useAtomValue(brainRegionByNotationMapAtom);
  const brainRegionByIdMap = useAtomValue(brainRegionByIdMapAtom);

  const brainRegionNotationSorterFn = useBrainRegionNotationSorterFn();

  return (selection: Selection): Selection[] => {
    if (!brainRegions) return [];

    const brainRegion = brainRegionByNotationMap?.get(selection.brainRegionNotation);

    if (!brainRegion) {
      throw new Error(`Can not find brain region with notation: ${selection.brainRegionNotation}`);
    }

    const parentSelectionBrainRegionId = selection.mtype ? brainRegion.id : brainRegion?.isPartOf;

    if (!parentSelectionBrainRegionId) {
      throw new Error(`Can not find parent node for brain region id: ${brainRegion.id}`);
    }

    const parentSelectionBrainRegion = brainRegionByIdMap?.get(parentSelectionBrainRegionId);

    const parentSelectionSiblingBrainRegions = brainRegions
      .filter((br) => br.isPartOf === parentSelectionBrainRegion?.isPartOf)
      .filter((br) => br.representedInAnnotation);

    const parentSelections = parentSelectionSiblingBrainRegions
      .map((br) => br.notation)
      .sort(brainRegionNotationSorterFn)
      .map((brainRegionNotation) => ({ brainRegionNotation }));

    return parentSelections;
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
    (selections: Selection[]): boolean => {
      if (!brainRegionByNotationMap) {
        throw new Error('No brainRegionByNotationMap present');
      }

      const brainRegionNotations = selections.map((selection) => selection.brainRegionNotation);
      const mtypes = selections.map((selection) => selection.mtype);

      const nMtypeLevelNodes = mtypes.filter(Boolean).length;

      // Not siblings if nodes belong to different levels (brain region, mtype).
      if (nMtypeLevelNodes > 0 && nMtypeLevelNodes < selections.length) return false;

      const nUniqBrainRegions = new Set(brainRegionNotations).size;

      // Not siblings if all nodes are of the mtype level and they do not share a common brain region.
      if (nMtypeLevelNodes === selections.length && nUniqBrainRegions !== 1) return false;

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
    (selections: Selection[]): boolean => {
      // const parsedLabels = labels.map((label) => label.split('.'));
      const brainRegionNotations = selections.map((selection) => selection.brainRegionNotation);
      const parentBrainRegionIds = brainRegionNotations
        .map(
          (brainRegionNotation) => brainRegionByNotationMap?.get(brainRegionNotation) as BrainRegion
        )
        .map((brainRegion) => brainRegion.isPartOf);

      const nUniqParentBrainRegions = new Set(parentBrainRegionIds).size;

      // TODO create a constant for the Whole Brain region id, replace all hardcoded occurences across the app.
      return (
        nUniqParentBrainRegions === 1 &&
        parentBrainRegionIds[0] === BASIC_CELL_GROUPS_AND_REGIONS_ID
      );
    },
    [brainRegionByNotationMap]
  );
}

export function useValidateEdit() {
  const edits = useLoadable(editsLoadableAtom, []);

  return (edit: Partial<MicroConnectomeEditEntry>) => {
    if (!edit.name) return false;

    const isNameDuplicated = edits?.find(
      (existingEdit) => existingEdit.name === edit.name && existingEdit.id !== edit.id
    );
    if (isNameDuplicated) {
      return false;
    }

    if (
      !edit.srcSelection ||
      !edit.dstSelection ||
      !edit.operation ||
      !edit.variantName ||
      !edit.params
    )
      return false;

    const paramsValid = Object.values(edit.params ?? {}).map((param) =>
      edit.operation === 'setAlgorithm'
        ? isNumber(param)
        : isNumber(param.multiplier) && isNumber(param.offset)
    );
    if (!paramsValid) return false;

    if (edit.operation === 'modifyParams') {
      const zeroTransform = Object.values(edit.params).every(
        (param) => param.multiplier === 1 && param.offset === 0
      );

      if (zeroTransform) return false;
    }

    return true;
  };
}
