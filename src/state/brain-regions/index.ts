import { atom } from 'jotai';
import { atomWithReset, selectAtom } from 'jotai/utils';
import { arrayToTree } from 'performant-array-to-tree';
import cloneDeep from 'lodash/cloneDeep';

import sessionAtom from '@/state/session';
import {
  BrainRegion,
  BrainRegionOntology,
  BrainRegionOntologyView,
  Mesh,
} from '@/types/ontologies';
import { getBrainRegionOntology, getDistributions } from '@/api/ontologies';
import { buildAlternateChildren, buildAlternateTree } from '@/state/brain-regions/alternate-view';
import { SelectedBrainRegion } from '@/state/brain-regions/types';
import {
  compositionHistoryAtom,
  compositionHistoryIndexAtom,
} from '@/state/build-composition/composition-history';
import { itemsInAnnotationReducer, flattenBrainRegionsTree } from '@/util/brain-hierarchy';
import {
  BASIC_CELL_GROUPS_AND_REGIONS_ID,
  ROOT_BRAIN_REGION_URI,
} from '@/constants/brain-hierarchy';

/*
  Atom dependency graph


 ┌───────────────────────────────────┐    ┌──────────────────────────────┐    ┌─────────────────────┐
 │    brainRegionsFilteredArrayAtom  ├────► brainRegionsFilteredTreeAtom ├────►   brainRegionsAtom  │
 └───────────────────────────────────┘    └──────────────────────────────┘    └─────────────────────┘

 ┌─────────────────────────┐    ┌────────────────────────────┐
 │ selectedBrainRegionAtom │    │ setSelectedBrainRegionAtom │
 └───────────▲─────────────┘    └────────────────────────────┘
             │
 ┌───────────┴────────────┐    ┌────────────────────────────────┐
 │ InitialCompositionAtom ├────► CompositionOverridesConfigAtom │
 └───────────▲────────────┘    └────────────────────────────────┘
             │
 ┌───────────┴────────────┐    ┌────────────────────────────────┐   ┌──────────────────────┐
 │    CompositionAtom     ├────►     UpdatedCompositionAtom     │   │  SetCompositionAtom  │
 └────────────────────────┘    └────────────────────────────────┘   └──────────────────────┘


 ┌───┐
 │   │ - Atoms
 └───┘

  ───► - Dependencies


   Details:
   * CompositionOverridesConfigAtom holds a composition overrides to be consumed by the workflow
   * InitialCompositionAtom's contains atlas composition with applied overrides (previously saved by the user)
*/

export const densityOrCountAtom = atom<'density' | 'count'>('count');

const brainRegionOntologyAtom = atom<Promise<BrainRegionOntology | null>>(async (get) => {
  const session = get(sessionAtom);

  return session && getBrainRegionOntology(session.accessToken);
});

export const brainRegionOntologyViewsAtom = selectAtom<
  Promise<BrainRegionOntology | null>,
  BrainRegionOntologyView[] | null
>(brainRegionOntologyAtom, (brainRegionOntology) => brainRegionOntology?.views ?? null);

export const brainRegionOntologyVolumesAtom = selectAtom<
  Promise<BrainRegionOntology | null>,
  { [key: string]: number } | null
>(brainRegionOntologyAtom, (brainRegionOntology) => brainRegionOntology?.volumes ?? null);

export const defaultBrainRegionOntologyViewAtom = selectAtom<
  Promise<BrainRegionOntologyView[] | null>,
  BrainRegionOntologyView | null | undefined
>(brainRegionOntologyViewsAtom, (views) =>
  views ? views.find((view) => view.id === 'https://neuroshapes.org/BrainRegion') : views
);

export const brainRegionsAtom = selectAtom<
  Promise<BrainRegionOntology | null>,
  BrainRegion[] | null
>(
  brainRegionOntologyAtom,
  (brainRegionOntology) =>
    brainRegionOntology?.brainRegions.map(({ view, ...br }) => ({
      ...br,
      view: 'https://neuroshapes.org/BrainRegion',
    })) ?? null
);

type BrainRegionId = string;
type BrainRegionNotation = string;

export const brainRegionIdByNotationMapAtom = selectAtom<
  Promise<BrainRegion[] | null>,
  Map<string, string> | null
>(
  brainRegionsAtom,
  (brainRegions) =>
    brainRegions?.reduce(
      (idByNotationMap, brainRegion) => idByNotationMap.set(brainRegion.notation, brainRegion.id),
      new Map()
    ) ?? null
);

export const brainRegionByNotationMapAtom = selectAtom<
  Promise<BrainRegion[] | null>,
  Map<BrainRegionNotation, BrainRegion> | null
>(
  brainRegionsAtom,
  (brainRegions) =>
    brainRegions?.reduce(
      (map, brainRegion) => map.set(brainRegion.notation, brainRegion),
      new Map()
    ) ?? null
);

export const brainRegionNotationByIdMapAtom = selectAtom<
  Promise<BrainRegion[] | null>,
  Map<BrainRegionId, BrainRegionNotation> | null
>(
  brainRegionsAtom,
  (brainRegions) =>
    brainRegions?.reduce(
      (map, brainRegion) => map.set(brainRegion.id, brainRegion.notation),
      new Map()
    ) ?? null
);

export const brainRegionByIdMapAtom = selectAtom<
  Promise<BrainRegion[] | null>,
  Map<BrainRegionNotation, BrainRegion> | null
>(
  brainRegionsAtom,
  (brainRegions) =>
    brainRegions?.reduce((map, brainRegion) => map.set(brainRegion.id, brainRegion), new Map()) ??
    null
);

export const brainRegionsFilteredTreeAtom = atom<Promise<BrainRegion[] | null>>(async (get) => {
  const brainRegions = await get(brainRegionsAtom);
  const defaultView = await get(defaultBrainRegionOntologyViewAtom);
  if (!brainRegions || !defaultView) return null;
  const tree = arrayToTree(brainRegions, {
    dataField: null,
    parentId: defaultView?.parentProperty,
    childrenField: 'items',
  }) as BrainRegion[];
  // if the tree is successfully created, make region 8 the root and flatten it
  // back to array. This is done in order to remove the brain regions that are
  // siblings or parents of region 8
  if (tree.length > 0) {
    // find the root and select the new root
    const newRoot = tree
      .find((region: BrainRegion) => region.id === ROOT_BRAIN_REGION_URI)
      ?.items?.find((region: BrainRegion) => region.id === BASIC_CELL_GROUPS_AND_REGIONS_ID);
    return newRoot ? [newRoot] : null;
  }
  return tree;
});

export const brainRegionsTreeWithRepresentationAtom = selectAtom<
  Promise<BrainRegion[] | null>,
  BrainRegion[] | null
>(
  brainRegionsFilteredTreeAtom,
  (brainRegionsTree) => brainRegionsTree?.reduce(itemsInAnnotationReducer, []) ?? null
);

export const selectedAlternateViews = atom<Record<string, string>>({});

export const brainRegionsAlternateTreeAtom = atom<Promise<BrainRegion[] | null | undefined>>(
  async (get) => {
    const brainRegions = await get(brainRegionsAtom);
    const defaultTree = await get(brainRegionsTreeWithRepresentationAtom);
    const views = await get(brainRegionOntologyViewsAtom);
    const selectedViews = get(selectedAlternateViews);

    const alternateTree = cloneDeep(defaultTree);

    // iterate over the currently modified views and apply the alternative children
    Object.entries(selectedViews).forEach(([brainRegionId, viewId]) => {
      const view = views?.find((v) => v.id === viewId);
      if (view && brainRegions && alternateTree) {
        // first get the children of the brain region id based on the applied view
        const alternateChildren = buildAlternateChildren(
          brainRegionId,
          view.parentProperty,
          brainRegions,
          viewId
        );

        // then replace the children of the changed node with the new ones
        buildAlternateTree(alternateTree[0], brainRegionId, alternateChildren, viewId);
      }
    });
    return alternateTree;
  }
);

export const alternateTreeWithRepresentationAtom = selectAtom<
  Promise<BrainRegion[] | null | undefined>,
  BrainRegion[] | null
>(
  brainRegionsAlternateTreeAtom,
  (alternateTree) => alternateTree?.reduce(itemsInAnnotationReducer, []) ?? null
);

export const alternateArrayWithRepresentationAtom = selectAtom<
  Promise<BrainRegion[] | null>,
  BrainRegion[] | null
>(alternateTreeWithRepresentationAtom, (tree) => flattenBrainRegionsTree(tree));

export const addOrRemoveSelectedAlternateView = atom(
  null,
  async (get, set, viewId: string, brainRegionId: string) => {
    const selectedViews = get(selectedAlternateViews);
    const brainRegionViews = await get(brainRegionOntologyViewsAtom);
    const defaultView = await get(defaultBrainRegionOntologyViewAtom);
    if (brainRegionViews && viewId && brainRegionId) {
      // if selecting the default view, remove it
      // in any other case, add it
      if (viewId === defaultView?.id && brainRegionId in selectedViews) {
        delete selectedViews[brainRegionId];
      } else {
        selectedViews[brainRegionId] = viewId;
      }
      set(selectedAlternateViews, { ...selectedViews });
    }
  }
);

/**
 * This atom returns the filtered brain regions as array, preserving the original ordering
 */
export const brainRegionsUnsortedArrayAtom = selectAtom<
  Promise<BrainRegion[] | null>,
  BrainRegion[] | null
>(brainRegionsFilteredTreeAtom, (tree) => flattenBrainRegionsTree(tree));

export const brainRegionIdxByNotationMapAtom = selectAtom<
  Promise<BrainRegion[] | null>,
  Map<BrainRegionId, number> | null
>(
  brainRegionsUnsortedArrayAtom,
  (brainRegionsUnsorted) =>
    brainRegionsUnsorted?.reduce(
      (idxByNotationMap, brainRegion, idx) => idxByNotationMap.set(brainRegion.notation, idx),
      new Map()
    ) ?? null
);

export const leafIdsByRegionIdAtom = selectAtom<
  Promise<BrainRegion[] | null>,
  { [id: string]: string[] }
>(
  brainRegionsUnsortedArrayAtom,
  (brainRegions) =>
    brainRegions?.reduce(
      (map, br) => ({
        ...map,
        [br.id]: br.leaves ?? [],
      }),
      {} // Pass in the empty map as the initial value
    ) ?? {} // Return an empty object in the event that brainRegions is null and can't be iterated
);

/**
 * This atom returns the filtered brain region leaves as an array, preserving the original ordering
 */
export const brainRegionLeavesUnsortedArrayAtom = selectAtom<
  Promise<BrainRegion[] | null>,
  BrainRegion[] | null
>(
  brainRegionsUnsortedArrayAtom,
  (brainRegionsUnsorted) =>
    brainRegionsUnsorted?.filter((brainRegion) => !brainRegion.leaves) ?? null
);

export const brainRegionLeaveIdxByNotationMapAtom = selectAtom<
  Promise<BrainRegion[] | null>,
  Map<BrainRegionId, number> | null
>(
  brainRegionLeavesUnsortedArrayAtom,
  (brainRegionLeaves) =>
    brainRegionLeaves?.reduce(
      (idxByNotationMap, brainRegion, idx) => idxByNotationMap.set(brainRegion.notation, idx),
      new Map()
    ) ?? null
);

export const brainRegionLeaveIdxByIdAtom = selectAtom<
  Promise<BrainRegion[] | null>,
  Record<BrainRegionId, number> | null
>(
  brainRegionLeavesUnsortedArrayAtom,
  (brainRegionLeaves) =>
    brainRegionLeaves?.reduce(
      (idxByNotation, brainRegion, idx) => Object.assign(idxByNotation, { [brainRegion.id]: idx }),
      {}
    ) ?? null
);

/**
 * This atom returns the filtered brain regions as array sorted by id
 */
export const brainRegionsFilteredArrayAtom = selectAtom<
  Promise<BrainRegion[] | null>,
  BrainRegion[] | null | undefined
>(brainRegionsUnsortedArrayAtom, (flattenedRegions) =>
  flattenedRegions ? [...flattenedRegions].sort((a, b) => a.id.localeCompare(b.id)) : null
);

export const meshDistributionsAtom = atom<Promise<{ [id: string]: Mesh } | null>>(async (get) => {
  const session = get(sessionAtom);

  if (!session) return null;

  return getDistributions(session.accessToken);
});

export const selectedBrainRegionAtom = atom<SelectedBrainRegion | null>(null);
export const selectedPreBrainRegionsAtom = atom(new Map<string, string>());
export const selectedPostBrainRegionsAtom = atom(new Map<string, string>());
export const literatureSelectedBrainRegionAtom = atomWithReset<SelectedBrainRegion | null>(null);

export const setSelectedBrainRegionAtom = atom(
  null,
  (
    _get,
    set,
    selectedBrainRegionId: string,
    selectedBrainRegionTitle: string,
    selectedBrainRegionLeaves: string[] | null,
    selectedBrainRegionRepresentedInAnnotation: boolean
  ) => {
    const brainRegion = {
      id: selectedBrainRegionId,
      title: selectedBrainRegionTitle,
      leaves: selectedBrainRegionLeaves,
      representedInAnnotation: selectedBrainRegionRepresentedInAnnotation,
    };
    set(selectedBrainRegionAtom, brainRegion);
    set(literatureSelectedBrainRegionAtom, brainRegion);
    set(compositionHistoryAtom, []);
    set(compositionHistoryIndexAtom, 0);
  }
);

export const setSelectedPreBrainRegionAtom = atom(null, (get, set, id: string, title: string) => {
  const selections = new Map(get(selectedPreBrainRegionsAtom));

  if (selections.has(id)) selections.delete(id);
  else selections.set(id, title);

  set(selectedPreBrainRegionsAtom, selections);
});

export const setSelectedPostBrainRegionAtom = atom(null, (get, set, id: string, title: string) => {
  const selections = new Map(get(selectedPostBrainRegionsAtom));

  if (selections.has(id)) selections.delete(id);
  else selections.set(id, title);

  set(selectedPostBrainRegionsAtom, selections);
});

export const brainRegionSidebarIsCollapsedAtom = atom(false);
