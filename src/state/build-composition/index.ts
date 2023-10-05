import { atom } from 'jotai';
import cloneDeep from 'lodash/cloneDeep';
import filter from 'lodash/filter';

import sessionAtom from '@/state/session';
import calculateCompositions from '@/util/composition/composition-parser';
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
import { OriginalComposition } from '@/types/composition/original';
import { AnalysedComposition, CalculatedCompositionNode } from '@/types/composition/calculation';
import { MModelMenuItem } from '@/types/m-model';
import { EModelMenuItem, MEModelMenuItem } from '@/types/e-model';

// This holds a weak reference to the updatedComposition by it's initial composition
// This allows GC to dispose the object once it is no longer used by current components
const updatedCompositionWeakMapAtom = atom<WeakMap<OriginalComposition, OriginalComposition>>(
  new WeakMap()
);

const initialCompositionAtom = atom<Promise<OriginalComposition | null>>(async (get) => {
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
      } as unknown as OriginalComposition;
      // TODO: add composition converter: internal representation <-> KG format, remove type casting
    }
  }

  return getCompositionData(session.accessToken);
});

const setUpdatedCompositionAtom = atom<null, [OriginalComposition], Promise<void>>(
  null,
  async (get, set, updatedComposition) => {
    const initialComposition = await get(initialCompositionAtom);

    if (!initialComposition) return;

    set(updatedCompositionWeakMapAtom, new WeakMap().set(initialComposition, updatedComposition));
  }
);

export const compositionAtom = atom<Promise<OriginalComposition | null>>(async (get) => {
  const initialComposition = await get(initialCompositionAtom);

  if (!initialComposition) return null;

  const updatedComposition = get(updatedCompositionWeakMapAtom).get(initialComposition);

  return updatedComposition ?? initialComposition;
});

export const analysedCompositionAtom = atom<Promise<AnalysedComposition | null>>(async (get) => {
  const session = get(sessionAtom);
  const selectedBrainRegion = get(selectedBrainRegionAtom);
  const compositionData = await get(compositionAtom);
  const volumes = await get(brainRegionOntologyVolumesAtom);

  if (!session || !selectedBrainRegion || !compositionData || !volumes) return null;
  // TODO: the leaf IDS retrieved from BMO are incorrect. Change the implementation to calculate them here
  const leaves = selectedBrainRegion.leaves
    ? selectedBrainRegion.leaves
    : [`http://api.brain-map.org/api/v2/data/Structure/${selectedBrainRegion.id}`];
  return calculateCompositions(
    compositionData,
    `http://api.brain-map.org/api/v2/data/Structure/${selectedBrainRegion.id}`,
    leaves,
    volumes
  );
});

export const analysedMTypesAtom = atom<Promise<MModelMenuItem[]>>(async (get) => {
  const composition = await get(analysedCompositionAtom);
  return composition !== null
    ? filter(composition.nodes, { about: 'MType' }).map((node) => ({
        label: node.label,
        id: node.id,
      }))
    : [];
});

export const analysedETypesAtom = atom<Promise<MEModelMenuItem>>(async (get) => {
  const analysedMTypes = await get(analysedMTypesAtom);

  // transform the mType info into a map for easier access
  const mTypesMap = new Map<string, MModelMenuItem>();
  analysedMTypes.forEach((mType) => {
    mTypesMap.set(mType.id, mType);
  });

  const composition = await get(analysedCompositionAtom);
  if (!composition) return {};

  const eTypeNodes = filter(composition.nodes, { about: 'EType' });
  // group all e-types per m-type
  return eTypeNodes.reduce((acc, eType) => {
    const mTypeInfo = mTypesMap.get(eType.parentId || '');
    if (!mTypeInfo) return acc;

    const eTypeInfo: EModelMenuItem = {
      name: eType.label,
      id: eType.id,
      eType: eType.label,
      mType: mTypeInfo.label,
      isOptimizationConfig: false,
    };

    const existingMTypeInfo = acc[mTypeInfo.label];
    if (existingMTypeInfo) {
      existingMTypeInfo.eTypeInfo = [...existingMTypeInfo.eTypeInfo, eTypeInfo];
    } else {
      acc[mTypeInfo.label] = {
        mTypeInfo,
        eTypeInfo: [eTypeInfo],
      };
    }

    return acc;
  }, {} as MEModelMenuItem);
});

export const computeAndSetCompositionAtom = atom(
  null,
  async (get, set, modifiedNode: CalculatedCompositionNode, newValue: number) => {
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

export const setCompositionAtom = atom(null, (_get, set, composition: OriginalComposition) => {
  set(setUpdatedCompositionAtom, composition);
});
