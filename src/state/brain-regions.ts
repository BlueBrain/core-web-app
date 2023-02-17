import { atom } from 'jotai/vanilla';
import { arrayToTree } from 'performant-array-to-tree';
import _ from 'lodash';
import sessionAtom from './session';
import { BrainRegion, Mesh } from '@/types/ontologies';
import { Composition, CompositionUnit, CompositionNode } from '@/types/composition';
import analyseComposition from '@/util/composition/composition-parser';
import computeModifiedComposition from '@/util/composition/composition-modifier';
import { getBrainRegions, getCompositionData, getDistributions } from '@/api/ontologies';
import { AnalysedComposition } from '@/util/composition/types';

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

const initialCompositionAtom = atom((get) => {
  const session = get(sessionAtom);

  if (!session) return null;

  return getCompositionData(session.accessToken);
});

export const compositionAtom = atom<Promise<Composition>>(async (get) => {
  const updatedComposition = get(updatedCompositionAtom);

  if (updatedComposition) {
    return updatedComposition;
  }

  return get(initialCompositionAtom);
});

export const analysedCompositionAtom = atom<Promise<AnalysedComposition | null>>(async (get) => {
  const session = get(sessionAtom);
  const selectedBrainRegion = get(selectedBrainRegionAtom);
  const compositionData = await get(compositionAtom);

  if (!session || !selectedBrainRegion) return null;
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
    set(updatedCompositionAtom, modifiedComposition);

    // whenever there is a change, we also update the history
    const compositionClone = _.cloneDeep(modifiedComposition);
    const newHistory = [...compositionHistory.slice(0, historyIndex + 1), compositionClone];
    set(compositionHistoryAtom, newHistory);
    set(compositionHistoryIndexAtom, newHistory.length - 1);
  }
);

export const setCompositionAtom = atom(null, (get, set, composition: Composition) => {
  set(updatedCompositionAtom, composition);
});
