import { atom } from 'jotai/vanilla';
import { arrayToTree } from 'performant-array-to-tree';
import _ from 'lodash';

import sessionAtom from './session';
import {
  configPayloadAtom,
  setCompositionPayloadConfigurationAtom,
} from './brain-model-config/cell-composition';
import { BrainRegion, Mesh } from '@/types/ontologies';
import { Composition, CompositionUnit, CompositionNode } from '@/types/composition';
import analyseComposition from '@/util/composition/composition-parser';
import computeModifiedComposition from '@/util/composition/composition-modifier';
import { getBrainRegions, getCompositionData, getDistributions } from '@/api/ontologies';
import { AnalysedComposition } from '@/util/composition/types';
import { extendCompositionWithOverrideProps } from '@/util/brain-hierarchy';

/*
  Atom dependency graph


 ┌───────────────────────────────────┐    ┌──────────────────────────────┐    ┌─────────────────────┐
 │    brainRegionsFilteredArrayAtom  ├────► BrainRegionsFilteredTreeAtom ├────►   BrainRegionsAtom  │
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

export const densityOrCountAtom = atom<keyof CompositionUnit>('count');

/**
 * Recursively unravels a brain region tree to an array
 * @param brainRegion
 * @param result
 * @param ancestors
 */
const treeToArray = (brainRegion: BrainRegion, result: BrainRegion[], ancestors: string[]) => {
  brainRegion.items?.forEach((br) => {
    const newRegion = { ...br };
    delete newRegion.items;
    const newAncestors = [...ancestors, brainRegion.id];
    newRegion.ancestors = newAncestors;
    result.push(newRegion);
    treeToArray(br, result, newAncestors);
  });
};

export const brainRegionsAtom = atom<Promise<BrainRegion[] | null>>(async (get) => {
  const session = get(sessionAtom);

  if (!session) return null;

  return getBrainRegions(session.accessToken);
});

export const idsToBrainRegionsAtom = atom(async (get) => {
  const brainRegionFlatList = (await get(brainRegionsAtom)) || [];
  const idsToBrainRegions: { [id: string]: BrainRegion } = {};

  brainRegionFlatList.forEach((br) => {
    idsToBrainRegions[br.id] = br;
  });

  return idsToBrainRegions;
});

export const brainRegionsFilteredTreeAtom = atom<Promise<BrainRegion[] | null>>(async (get) => {
  const brainRegions = await get(brainRegionsAtom);
  if (!brainRegions) return null;

  const tree = arrayToTree(brainRegions, {
    dataField: null,
    parentId: 'parentId',
    childrenField: 'items',
  }) as BrainRegion[];
  // if the tree is successfully created, make region 8 the root and flatten it
  // back to array. This is done in order to remove the brain regions that are
  // siblings or parents of region 8
  if (tree.length > 0) {
    const newRoot = tree[0].items?.find((region: BrainRegion) => region.id === '8');
    return newRoot ? [newRoot] : null;
  }
  return tree;
});

/**
 * This atom returns the filtered brain regions as array
 */
export const brainRegionsFilteredArrayAtom = atom<Promise<BrainRegion[] | null>>(async (get) => {
  const tree = await get(brainRegionsFilteredTreeAtom);
  // if the tree is successfully created, make region 8 the root and flatten it
  // back to array. This is done in order to remove the brain regions that are
  // siblings or parents of region 8
  if (tree) {
    const root = { ...tree[0] };
    if (root) {
      const flattenedRegions: BrainRegion[] = [];
      treeToArray(root, flattenedRegions, []);
      delete root.items;
      root.parentId = null;
      return flattenedRegions.sort((a, b) => a.id.localeCompare(b.id));
    }
  }
  return tree;
});

export const meshDistributionsAtom = atom<Promise<{ [id: string]: Mesh } | null>>(async (get) => {
  const session = get(sessionAtom);

  if (!session) return null;
  return getDistributions(session.accessToken);
});

const updatedCompositionAtom = atom<Composition | null>(null);

type SelectedBrainRegion = {
  id: string;
  title: string;
  leaves: string[] | null;
};

export const selectedBrainRegionAtom = atom<SelectedBrainRegion | null>(null);
export const selectedPreBrainRegionIdsAtom = atom(new Set<string>());
export const selectedPostBrainRegionIdsAtom = atom(new Set<string>());

export const selectedPreBrainRegionsAtom = atom(async (get) => {
  const set = get(selectedPreBrainRegionIdsAtom);
  const idsToBrainRegions = await get(idsToBrainRegionsAtom);
  return Array.from(set).map((id) => idsToBrainRegions[id]);
});

export const selectedPostBrainRegionsAtom = atom(async (get) => {
  const set = get(selectedPostBrainRegionIdsAtom);
  const idsToBrainRegions = await get(idsToBrainRegionsAtom);
  return Array.from(set).map((id) => idsToBrainRegions[id]);
});

export const setSelectedBrainRegionAtom = atom(
  null,
  (
    get,
    set,
    selectedBrainRegionId: string,
    selectedBrainRegionTitle: string,
    selectedBrainRegionLeaves: string[] | null
  ) => {
    set(selectedBrainRegionAtom, {
      id: selectedBrainRegionId,
      title: selectedBrainRegionTitle,
      leaves: selectedBrainRegionLeaves,
    });
    set(updatedCompositionAtom, null);
  }
);

export const setSelectedPreBrainRegionAtom = atom(
  null,
  (get, set, selectedBrainRegionId: string) => {
    const newSet = new Set(get(selectedPreBrainRegionIdsAtom));

    if (newSet.has(selectedBrainRegionId)) newSet.delete(selectedBrainRegionId);
    else newSet.add(selectedBrainRegionId);

    set(selectedPreBrainRegionIdsAtom, newSet);
  }
);

export const setSelectedPostBrainRegionAtom = atom(
  null,
  (get, set, selectedBrainRegionId: string) => {
    const newSet = new Set(get(selectedPostBrainRegionIdsAtom));

    if (newSet.has(selectedBrainRegionId)) newSet.delete(selectedBrainRegionId);
    else newSet.add(selectedBrainRegionId);

    set(selectedPostBrainRegionIdsAtom, newSet);
  }
);

const initialCompositionAtom = atom<Promise<Composition | null>>(async (get) => {
  const session = get(sessionAtom);

  if (!session) return null;

  const compositionPayload = await get(configPayloadAtom);
  if (compositionPayload) {
    // TODO: create a focus-/selectAtom under cell-composition state to directly contain configuration
    const config = Object.values(compositionPayload)[0].configuration;

    // This is a safeguard to discard and eventually overwrite configurations of older format.
    if (config.unitCode) {
      return {
        version: config.version,
        unitCode: config.unitCode,
        hasPart: config.overrides,
      } as unknown as Composition;
      // TODO: add composition converter: internal representation <-> KG format, remove type casting
    }
  }

  return getCompositionData(session.accessToken);
});

// This holds a weak reference to the updatedComposition by it's initial composition
// This allows GC to dispose the object once it is no longer used by current components
const updatedCompositionWeakMapAtom = atom<WeakMap<Composition, Composition>>(new WeakMap());

const setUpdatedCompositionAtom = atom<null, [Composition], Promise<void>>(
  null,
  async (get, set, updatedComposition) => {
    const initialComposition = await get(initialCompositionAtom);

    if (!initialComposition) return;

    set(updatedCompositionWeakMapAtom, new WeakMap().set(initialComposition, updatedComposition));
  }
);

export const compositionAtom = atom<Promise<Composition | null>>(async (get) => {
  const initialComposition = await get(initialCompositionAtom);

  if (!initialComposition) return null;

  const updatedComposition = get(updatedCompositionWeakMapAtom).get(initialComposition);

  return updatedComposition ?? initialComposition;
});

export const analysedCompositionAtom = atom<Promise<AnalysedComposition | null>>(async (get) => {
  const session = get(sessionAtom);
  const selectedBrainRegion = get(selectedBrainRegionAtom);
  const compositionData = await get(compositionAtom);

  if (!session || !selectedBrainRegion || !compositionData) return null;

  const leaves = selectedBrainRegion.leaves
    ? selectedBrainRegion.leaves
    : [`http://api.brain-map.org/api/v2/data/Structure/${selectedBrainRegion.id}`];
  return analyseComposition(compositionData, leaves);
});

export const compositionHistoryAtom = atom<Composition[]>([]);
export const compositionHistoryIndexAtom = atom<number>(0);

export const computeAndSetCompositionAtom = atom(
  null,
  async (get, set, modifiedNode: CompositionNode, newValue: number, lockedIds: string[]) => {
    const analysedComposition = await get(analysedCompositionAtom);
    if (!analysedComposition || modifiedNode.composition === undefined) {
      return;
    }
    const { volumes, composition } = analysedComposition;
    const densityOrCount = get(densityOrCountAtom);

    const valueDifference = newValue - modifiedNode.composition;
    const compositionHistory = get(compositionHistoryAtom);
    const historyIndex = get(compositionHistoryIndexAtom);

    const modifiedComposition = computeModifiedComposition(
      modifiedNode,
      valueDifference,
      modifiedNode.leaves,
      volumes,
      composition,
      lockedIds,
      densityOrCount
    );
    set(setUpdatedCompositionAtom, modifiedComposition);

    const compositionClone = _.cloneDeep(modifiedComposition);
    extendCompositionWithOverrideProps(compositionClone);

    set(setCompositionPayloadConfigurationAtom, compositionClone);

    // whenever there is a change, we also update the history
    const newHistory = [...compositionHistory.slice(0, historyIndex + 1), compositionClone];
    set(compositionHistoryAtom, newHistory);
    set(compositionHistoryIndexAtom, newHistory.length - 1);
  }
);

export const setCompositionAtom = atom(null, (get, set, composition: Composition) => {
  set(updatedCompositionAtom, composition);
});
