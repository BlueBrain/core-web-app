import { atom } from 'jotai/vanilla';
import sessionAtom from './session';
import {
  configPayloadAtom,
  setCompositionOverridesAtom,
} from '@/state/brain-model-config/cell-composition';
import { BrainRegion, MeshDistribution, Composition, CompositionUnit } from '@/types/atlas';
import { getBrainRegionById, getBrainRegionsTree, getDistributions } from '@/api/atlas';
import {
  applyCompositionOverrides,
  brainRegionIdToUri,
  createCompositionOverridesWorkflowConfig,
} from '@/util/brain-hierarchy';
import { sanitizeNodeValues } from '@/app/brain-factory/(main)/cell-composition/configuration/util';

/*
  Atom dependency graph


 ┌────────────────────────┐    ┌────────────────────────┐
 │    BrainRegionsAtom    │    │ MeshDistributionsAtom  │
 └────────────────────────┘    └────────────────────────┘


 ┌────────────────────────┐    ┌────────────────────────┐
 │ BrainRegionIdAtomAtom  │    │  SetBrainRegionIdAtom  │
 └───────────▲────────────┘    └────────────────────────┘
             │
 ┌───────────┴────────────┐
 │     BrainRegionAtom    │
 └───────────▲────────────┘
             │
 ┌───────────┴────────────┐
 │  AtlasCompositionAtom  │
 └───────────▲────────────┘
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
   * AtlasCompositionAtom contains composition based on atlas data
   * CompositionOverridesConfigAtom holds a composition overrides to be consumed by the workflow
   * InitialCompositionAtom's contains atlas composition with applied overrides (previously saved by the user)
*/

export const brainRegionsAtom = atom<Promise<BrainRegion[]> | null>((get) => {
  const session = get(sessionAtom);

  if (!session) return null;

  return getBrainRegionsTree(session.accessToken);
});

export const meshDistributionsAtom = atom<Promise<MeshDistribution[]> | null>((get) => {
  const session = get(sessionAtom);

  if (!session) return null;

  return getDistributions(session.accessToken);
});

const updatedCompositionAtom = atom<Composition | null>(null);

export const brainRegionIdAtom = atom<string | null>(null);

export const setCompositionAtom = atom(null, (get, set, composition: Composition) => {
  const brainRegionId = get(brainRegionIdAtom);

  if (!brainRegionId) return;

  set(updatedCompositionAtom, composition);
  set(
    setCompositionOverridesAtom,
    brainRegionIdToUri(brainRegionId),
    createCompositionOverridesWorkflowConfig(composition)
  );
});

export const setBrainRegionIdAtom = atom(null, (get, set, brainRegionId: string) => {
  set(brainRegionIdAtom, brainRegionId);
  set(updatedCompositionAtom, null);
});

export const brainRegionAtom = atom<Promise<BrainRegion> | null>((get) => {
  const session = get(sessionAtom);
  const brainRegionId = get(brainRegionIdAtom);

  if (!session || !brainRegionId) return null;

  return getBrainRegionById(brainRegionId, session.accessToken);
});

export const atlasCompositionAtom = atom<Promise<Composition | null>>(async (get) => {
  const brainRegion = await get(brainRegionAtom);

  if (!brainRegion) return null;

  return sanitizeNodeValues(brainRegion.composition);
});

const initialComposition = atom<Promise<Composition | null>>(async (get) => {
  const brainRegionId = get(brainRegionIdAtom);
  const compositionConfigPayload = await get(configPayloadAtom);
  const atlasComposition = await get(atlasCompositionAtom);

  if (!brainRegionId || !compositionConfigPayload || !atlasComposition) return null;

  const compositionOverridesWorkflowConfig =
    compositionConfigPayload[brainRegionIdToUri(brainRegionId)]?.configuration.overrides;

  if (!compositionOverridesWorkflowConfig) return atlasComposition;

  const atlasCompositionClone = structuredClone(atlasComposition);

  applyCompositionOverrides(atlasCompositionClone, compositionOverridesWorkflowConfig);

  return atlasComposition;
});

export const compositionAtom = atom<Promise<Composition | null>>(async (get) => {
  const updatedComposition = get(updatedCompositionAtom);

  if (updatedComposition) {
    return updatedComposition;
  }

  return get(initialComposition);
});

export const densityOrCountAtom = atom<keyof CompositionUnit>('count');
