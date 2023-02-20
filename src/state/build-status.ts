import { atom, Atom } from 'jotai/vanilla';

import { partialCircuitAtom as cellPositionPartialCircuitAtom } from '@/state/brain-model-config/cell-position';
import { cellCompositionAtom as cellCompositionPartialCircuitAtom } from '@/state/brain-model-config/cell-composition';
import { partialCircuitAtom as emodelAssignmentPartialCircuitAtom } from '@/state/brain-model-config/emodel-assignment';
import { partialCircuitAtom as morphologyAssignmentPartialCircuitAtom } from '@/state/brain-model-config/morphology-assignment';

export const STATUS = {
  BUILT: 'Built',
  TO_BUILD: 'To Build',
};

const STEPS = {
  DENSITY: 'Density',
  DISTRIBUTION: 'Distribution',
  POSITION: 'Position',
  M_MODEL: 'M-Model',
  E_MODEL: 'E-Model',
  ME_MODEL: 'ME-Model',
  MACRO: 'Macro',
  MESO: 'Meso',
  MICRO: 'Micro',
};

export const GROUPS = {
  CELL_COMPOSITION: 'Cell composition',
  CELL_MODEL_ASSIGNMENT: 'Cell model assignment',
  CONNECTOME_DEFINITION: 'Connectome definition',
  CONNECTION_MODEL_ASSIGNMENT: 'Connection model assignment',
} as const;

export type CellCompositionStepGroupValues = (typeof GROUPS)[keyof typeof GROUPS];

export type StatusResponse = typeof STATUS.BUILT | typeof STATUS.TO_BUILD | null;

export type StatusStructureItem = {
  name: CellCompositionStepGroupValues;
  items: {
    name: string;
    statusAtom: Atom<Promise<any>>;
  }[];
  checked?: boolean;
};

export const statusStructure: StatusStructureItem[] = [
  {
    name: GROUPS.CELL_COMPOSITION,
    items: [
      {
        name: STEPS.DENSITY,
        statusAtom: cellCompositionPartialCircuitAtom,
      },
      {
        name: STEPS.DISTRIBUTION,
        statusAtom: cellCompositionPartialCircuitAtom,
      },
      {
        name: STEPS.POSITION,
        statusAtom: cellPositionPartialCircuitAtom,
      },
    ],
  },
  {
    name: GROUPS.CELL_MODEL_ASSIGNMENT,
    items: [
      {
        name: STEPS.E_MODEL,
        statusAtom: emodelAssignmentPartialCircuitAtom,
      },
      {
        name: STEPS.M_MODEL,
        statusAtom: morphologyAssignmentPartialCircuitAtom,
      },
      {
        name: STEPS.ME_MODEL,
        statusAtom: atom(() => Promise.resolve(null)),
      },
    ],
  },
  {
    name: GROUPS.CONNECTOME_DEFINITION,
    items: [
      {
        name: STEPS.MACRO,
        statusAtom: atom(() => Promise.resolve(null)),
      },
      {
        name: STEPS.MESO,
        statusAtom: atom(() => Promise.resolve(null)),
      },
      {
        name: STEPS.MICRO,
        statusAtom: atom(() => Promise.resolve(null)),
      },
    ],
  },
  {
    name: GROUPS.CONNECTION_MODEL_ASSIGNMENT,
    items: [
      {
        name: STEPS.MACRO,
        statusAtom: atom(() => Promise.resolve(null)),
      },
      {
        name: STEPS.MESO,
        statusAtom: atom(() => Promise.resolve(null)),
      },
      {
        name: STEPS.MICRO,
        statusAtom: atom(() => Promise.resolve(null)),
      },
    ],
  },
];

export const stepsToBuildAtom = atom<CellCompositionStepGroupValues[]>([]);
