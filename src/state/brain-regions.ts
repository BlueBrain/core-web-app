import { atom } from 'jotai/vanilla';
import { arrayToTree } from 'performant-array-to-tree';
import _ from 'lodash';
import sessionAtom from './session';
import {
  BrainRegion,
  BrainRegionWOComposition,
  AnalysedComposition,
  Composition,
  CompositionUnit,
  MeshDistribution,
  Node,
} from '@/types/atlas';
import { getBrainRegions, getCompositionData, getDistributions } from '@/api/atlas';
import analyseComposition from '@/util/composition-parser';
import computeModifiedComposition from '@/util/composition-modifier';

/*
  Atom dependency graph


 ┌────────────────────────┐    ┌─────────────────────────┐    ┌────────────────────────┐
 │    BrainRegionsAtom    │    │ BrainRegionFlatListAtom │    │ MeshDistributionsAtom  │
 └────────────────────────┘    └─────────────────────────┘    └────────────────────────┘


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

export const brainRegionFlatListAtom = atom<Promise<BrainRegionWOComposition[]> | null>((get) => {
  const session = get(sessionAtom);

  if (!session) return null;

  return getBrainRegions(session.accessToken);
});

export const brainRegionsAtom = atom<Promise<BrainRegion[] | null>>(async (get) => {
  const brainRegionFlatList = await get(brainRegionFlatListAtom);
  if (!brainRegionFlatList) return null;

  return arrayToTree(brainRegionFlatList, {
    dataField: null,
    parentId: 'parentId',
    childrenField: 'items',
  }) as BrainRegion[];
});

export const meshDistributionsAtom = atom<Promise<MeshDistribution[]> | null>((get) => {
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
  const leaves =
    selectedBrainRegion.leaves !== null
      ? selectedBrainRegion.leaves
      : [`http://api.brain-map.org/api/v2/data/Structure/${selectedBrainRegion.id}`];

  return analyseComposition(compositionData, leaves);
});

export const compositionHistoryAtom = atom<Composition[]>([]);
export const compositionHistoryIndexAtom = atom<number>(0);

export const computeAndSetCompositionAtom = atom(
  null,
  async (get, set, modifiedNode: Node, newValue: number, lockedIds: string[]) => {
    const analysedComposition = await get(analysedCompositionAtom);
    if (!analysedComposition || !modifiedNode.composition) {
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
