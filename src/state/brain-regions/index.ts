import { atom } from 'jotai';
import { atomWithDefault, selectAtom } from 'jotai/utils';
import { arrayToTree } from 'performant-array-to-tree';
import cloneDeep from 'lodash/cloneDeep';
import uniqBy from 'lodash/uniqBy';
import { findDeep, reduceDeep } from 'deepdash-es/standalone';
import sessionAtom from '@/state/session';
import {
  BrainRegion,
  BrainRegionOntology,
  BrainRegionOntologyView,
  BrainRegionWithRepresentation,
  BrainViewId,
  Mesh,
} from '@/types/ontologies';
import { getBrainRegionOntology, getDistributions } from '@/api/ontologies';
import { buildAlternateChildren, buildAlternateTree } from '@/state/brain-regions/alternate-view';
import { DefaultBrainRegionType, NavValue, SelectedBrainRegion } from '@/state/brain-regions/types';
import {
  compositionHistoryAtom,
  compositionHistoryIndexAtom,
} from '@/state/build-composition/composition-history';
import {
  flattenBrainRegionsTree,
  getInAnnotationBrainRegionsReducer,
} from '@/util/brain-hierarchy';
import {
  BASIC_CELL_GROUPS_AND_REGIONS_ID,
  DEFAULT_BRAIN_REGION_STORAGE_KEY,
  ROOT_BRAIN_REGION_URI,
} from '@/constants/brain-hierarchy';
import { getInitializationValue, setInitializationValue } from '@/util/utils';
import { sectionAtom } from '@/state/application';
import {
  brainRegionIdQueryParamKey,
  defaultHierarchyTree,
} from '@/constants/explore-section/default-brain-region';

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

export const densityOrCountLabelAtom = atom<'Counts [N]' | 'Densities [/mm³]' | ''>((get) => {
  const densityOrCount = get(densityOrCountAtom);
  switch (densityOrCount) {
    case 'count':
      return 'Counts [N]';
    case 'density':
      return 'Densities [/mm³]';
    default:
      return '';
  }
});

export const brainRegionOntologyAtom = atom(getBrainRegionOntology);

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

export const brainRegionsWithRepresentationAtom = selectAtom<
  Promise<BrainRegion[] | null>,
  BrainRegionWithRepresentation[] | null
>(brainRegionsAtom, (brainRegions) => {
  const inAnnotationBrainRegionsReducer = brainRegions
    ? getInAnnotationBrainRegionsReducer(brainRegions)
    : null;

  return !!brainRegions && inAnnotationBrainRegionsReducer
    ? brainRegions?.reduce<BrainRegionWithRepresentation[]>(inAnnotationBrainRegionsReducer, [])
    : null;
});

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
  const brainRegions = await get(brainRegionsWithRepresentationAtom);
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

export const selectedAlternateViews = atom<Record<string, BrainViewId>>({});

export const brainRegionsAlternateTreeAtom = atom<Promise<BrainRegion[] | null | undefined>>(
  async (get) => {
    const brainRegions = await get(brainRegionsWithRepresentationAtom);
    const defaultTree = await get(brainRegionsFilteredTreeAtom);
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

export const addOrRemoveSelectedAlternateView = atom(
  null,
  async (get, set, viewId: BrainViewId, brainRegionId: string) => {
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

export const selectedBrainRegionAtom = atomWithDefault<SelectedBrainRegion | null>((get) => {
  const sectionName = get(sectionAtom);
  if (!sectionName) return null;

  const initializationBrainRegion = getInitializationValue<DefaultBrainRegionType>(
    DEFAULT_BRAIN_REGION_STORAGE_KEY
  );

  const isExplore = sectionName === 'explore';

  const searchParams = new URLSearchParams(window.location.search);
  const brainRegionIdQueryParam = searchParams.get(brainRegionIdQueryParamKey);
  if (brainRegionIdQueryParam && isExplore) {
    if (
      !initializationBrainRegion ||
      initializationBrainRegion.value.id !== decodeURIComponent(brainRegionIdQueryParam)
    ) {
      // do not set initial value, wait until the brain region is
      // set by the hook based on query param
      return null;
    }
  }

  return initializationBrainRegion ? initializationBrainRegion.value : null;
});

export const selectedPreBrainRegionsAtom = atom(new Map<string, string>());
export const selectedPostBrainRegionsAtom = atom(new Map<string, string>());
export const literatureSelectedBrainRegionAtom = atomWithDefault<SelectedBrainRegion | null>(
  (get) => get(selectedBrainRegionAtom)
);

export const setSelectedBrainRegionAtom = atom(
  null,
  (
    _get,
    set,
    selectedBrainRegionId: string,
    selectedBrainRegionTitle: string,
    selectedBrainRegionLeaves: string[] | null
  ) => {
    const brainRegion = {
      id: selectedBrainRegionId,
      title: selectedBrainRegionTitle,
      leaves: selectedBrainRegionLeaves,
    };

    set(selectedBrainRegionAtom, brainRegion);
    set(literatureSelectedBrainRegionAtom, brainRegion);
    set(compositionHistoryAtom, []);
    set(compositionHistoryIndexAtom, 0);
  }
);

export const resetSelectedBrainRegionAtom = atom(null, (_get, set) => {
  set(selectedBrainRegionAtom, null);
  set(literatureSelectedBrainRegionAtom, null);
  set(compositionHistoryAtom, []);
  set(compositionHistoryIndexAtom, 0);
  setInitializationValue(DEFAULT_BRAIN_REGION_STORAGE_KEY, null);
});

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

/**
 * Returns the descendants of a list of brain regions based on their id
 */
export const getBrainRegionDescendantsAndAncestors = (brainRegionIds: string[]) =>
  atom(async (get) => {
    const brainRegionTree = await get(brainRegionsFilteredTreeAtom);
    if (!brainRegionTree) return undefined;
    // returns unique brain regions (in case there is an overlap of brain regions)
    return uniqBy(
      brainRegionIds.reduce((totalDescendants: BrainRegion[], brainRegionId: string) => {
        // first search for the actual brain region in the tree
        const brainRegion: BrainRegion = findDeep(
          brainRegionTree,
          (region) => region.id === brainRegionId,
          {
            pathFormat: 'array',
            childrenPath: ['items'],
          }
        )?.value;
        // if not found, return empty array
        if (!brainRegion) return [];
        // iterate over the children of the brain region (items) and construct array of descendants
        const descendants = reduceDeep(
          brainRegion,
          (acc, value: BrainRegion) => {
            if (value.items) {
              return [...acc, ...value.items];
            }
            return acc;
          },
          [],
          { pathFormat: 'array', childrenPath: ['items'] }
        );
        // create a list of the ancestor objects to have uniform format with the rest of the brain regions
        const ancestors =
          brainRegion.ancestors?.map((item: Record<string, any>) => ({
            id: Object.keys(item)[0],
          })) || [];

        // appends the brain region along with the descendants
        return [...totalDescendants, ...descendants, ...ancestors, brainRegion];
      }, []),
      'id'
    );
  });

/**
 * An array containing the selected brain region along with all the descendants
 */
export const selectedBrainRegionWithDescendantsAndAncestorsAtom = atom<Promise<string[]>>(
  async (get) => {
    const selectedBrainRegion = get(selectedBrainRegionAtom);
    if (!selectedBrainRegion) return [];
    const descendants = await get(getBrainRegionDescendantsAndAncestors([selectedBrainRegion.id]));

    return descendants?.map((d) => d.id) || [];
  }
);

/**
 * Keeps track of the hierarchy tree of the brain regions
 * It will be expanded based on region selected in useBrainRegionFromQuery hook.
 */
export const brainRegionHierarchyStateAtom = atomWithDefault<NavValue | null>((get) => {
  const selectedBrainRegion = get(selectedBrainRegionAtom);
  return selectedBrainRegion ? null : defaultHierarchyTree;
});

brainRegionHierarchyStateAtom.debugLabel = 'brainRegionHierarchyStateAtom';
brainRegionSidebarIsCollapsedAtom.debugLabel = 'brainRegionSidebarIsCollapsedAtom';
selectedBrainRegionAtom.debugLabel = 'selectedBrainRegionAtom';
setSelectedBrainRegionAtom.debugLabel = 'setSelectedBrainRegionAtom';
brainRegionsAlternateTreeAtom.debugLabel = 'brainRegionsAlternateTreeAtom';
selectedAlternateViews.debugLabel = 'selectedAlternateViews';
brainRegionsAtom.debugLabel = 'brainRegionsAtom';
brainRegionOntologyAtom.debugLabel = 'brainRegionOntologyAtom';
