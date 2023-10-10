import { atom, Atom } from 'jotai';

import {
  cellCompositionWasBuiltAtom,
  cellPositionWasBuiltAtom,
  emodelAssignmentWasBuiltAtom,
  morphologyAssignmentWasBuiltAtom,
  microConnectomeWasBuiltAtom,
  macroConnectomeWasBuiltAtom,
} from './generated-artifacts';
import { SubConfigName } from '@/types/nexus';

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
  CONNECTOME_MODEL_ASSIGNMENT: 'Connectome model assignment',
} as const;

export type CellCompositionStepGroupValues = (typeof GROUPS)[keyof typeof GROUPS];

export type StatusResponse = typeof STATUS.BUILT | typeof STATUS.TO_BUILD | null;

export type StatusStructureItem = {
  name: CellCompositionStepGroupValues;
  items: {
    name: string;
    statusAtom: Atom<Promise<any>>;
  }[];
  targetConfigName: SubConfigName;
  checked?: boolean;
};

export const statusStructure: StatusStructureItem[] = [
  {
    name: GROUPS.CELL_COMPOSITION,
    items: [
      {
        name: STEPS.DENSITY,
        statusAtom: cellCompositionWasBuiltAtom,
      },
      {
        name: STEPS.DISTRIBUTION,
        statusAtom: cellCompositionWasBuiltAtom,
      },
      {
        name: STEPS.POSITION,
        statusAtom: cellPositionWasBuiltAtom,
      },
    ],
    targetConfigName: 'cellPositionConfig',
  },
  {
    name: GROUPS.CELL_MODEL_ASSIGNMENT,
    items: [
      {
        name: STEPS.E_MODEL,
        statusAtom: emodelAssignmentWasBuiltAtom,
      },
      {
        name: STEPS.M_MODEL,
        statusAtom: morphologyAssignmentWasBuiltAtom,
      },
      {
        name: STEPS.ME_MODEL,
        statusAtom: atom(async (get) => {
          // TODO: replace this for proper atom when we have me-model in pipeline
          const eModelWasBuilt = await get(emodelAssignmentWasBuiltAtom);
          const mModelWasBuilt = await get(morphologyAssignmentWasBuiltAtom);
          return eModelWasBuilt && mModelWasBuilt;
        }),
      },
    ],
    targetConfigName: 'eModelAssignmentConfig',
  },
  {
    name: GROUPS.CONNECTOME_DEFINITION,
    items: [
      {
        name: STEPS.MACRO,
        statusAtom: macroConnectomeWasBuiltAtom,
      },
      {
        name: STEPS.MESO,
        statusAtom: atom(async (get) => {
          // TODO: replace this for proper atom when we have meso in pipeline
          const microWasBuilt = await get(microConnectomeWasBuiltAtom);
          const macroWasBuilt = await get(macroConnectomeWasBuiltAtom);
          return microWasBuilt && macroWasBuilt;
        }),
      },
      {
        name: STEPS.MICRO,
        statusAtom: microConnectomeWasBuiltAtom,
      },
    ],
    targetConfigName: 'microConnectomeConfig',
  },
  {
    name: GROUPS.CONNECTOME_MODEL_ASSIGNMENT,
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
    targetConfigName: 'synapseConfig',
  },
];

export const targetConfigToBuildAtom = atom<SubConfigName | null>(null);
