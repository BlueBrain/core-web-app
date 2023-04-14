import { atom } from 'jotai';
import cloneDeep from 'lodash/cloneDeep';
import { Composition, CompositionNode } from '@/types/composition';
import { AnalysedComposition } from '@/util/composition/types';
import sessionAtom from '@/state/session';
import analyseComposition from '@/util/composition/composition-parser';
import computeModifiedComposition from '@/util/composition/composition-modifier';
import { extendCompositionWithOverrideProps } from '@/util/brain-hierarchy';
import { setCompositionPayloadConfigurationAtom } from '@/state/brain-model-config/cell-composition/extra';
import { configPayloadAtom } from '@/state/brain-model-config/cell-composition';
import { getCompositionData } from '@/api/ontologies';
import {
  brainRegionOntologyVolumesAtom,
  densityOrCountAtom,
  selectedBrainRegionAtom,
} from '@/state/brain-regions';
import {
  compositionHistoryAtom,
  compositionHistoryIndexAtom,
} from '@/state/build-composition/composition-history';

// This holds a weak reference to the updatedComposition by it's initial composition
// This allows GC to dispose the object once it is no longer used by current components
const updatedCompositionWeakMapAtom = atom<WeakMap<Composition, Composition>>(new WeakMap());

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

export const computeAndSetCompositionAtom = atom(
  null,
  async (get, set, modifiedNode: CompositionNode, newValue: number, lockedIds: string[]) => {
    const analysedComposition = await get(analysedCompositionAtom);
    const volumes = await get(brainRegionOntologyVolumesAtom);
    if (!analysedComposition || modifiedNode.composition === undefined) {
      return;
    }
    const { composition } = analysedComposition;
    const densityOrCount = get(densityOrCountAtom);

    const valueDifference = newValue - modifiedNode.composition;
    const compositionHistory = get(compositionHistoryAtom);
    const historyIndex = get(compositionHistoryIndexAtom);
    const selectedBrainRegion = get(selectedBrainRegionAtom);

    if (selectedBrainRegion && volumes) {
      const modifiedComposition = computeModifiedComposition(
        modifiedNode,
        valueDifference,
        modifiedNode.leaves,
        composition,
        lockedIds,
        densityOrCount,
        volumes,
        `http://api.brain-map.org/api/v2/data/Structure/${selectedBrainRegion?.id}`
      );
      set(setUpdatedCompositionAtom, modifiedComposition);

      const compositionClone = cloneDeep(modifiedComposition);
      extendCompositionWithOverrideProps(compositionClone);

      set(setCompositionPayloadConfigurationAtom, compositionClone);

      // whenever there is a change, we also update the history
      const newHistory = [...compositionHistory.slice(0, historyIndex + 1), compositionClone];
      set(compositionHistoryAtom, newHistory);
      set(compositionHistoryIndexAtom, newHistory.length - 1);
    }
  }
);

export const setCompositionAtom = atom(null, (_get, set, composition: Composition) => {
  set(setUpdatedCompositionAtom, composition);
});
