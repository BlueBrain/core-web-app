import { atom, Atom } from 'jotai/vanilla';

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

export type CellCompositionStepGroupValues = typeof GROUPS[keyof typeof GROUPS];

export type StatusResponse = typeof STATUS.BUILT | typeof STATUS.TO_BUILD | null;

function fakeStatusFetch(): Promise<StatusResponse> {
  return new Promise((resolve) => {
    const statuses = [STATUS.BUILT, STATUS.TO_BUILD];
    // resolve in different times from 1 to 6 seconds
    setTimeout(() => {
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      resolve(randomStatus);
    }, Math.random() * (6000 - 1000) + 1000);
  });
}

export const getStatusAtom = (): Atom<Promise<StatusResponse>> =>
  atom(() => fakeStatusFetch().then((status) => status));

export type StatusStructureItem = {
  name: CellCompositionStepGroupValues;
  items: {
    name: string;
    status: Atom<Promise<StatusResponse>>;
  }[];
  checked?: boolean;
};

export const statusStructure: StatusStructureItem[] = [
  {
    name: GROUPS.CELL_COMPOSITION,
    items: [
      {
        name: STEPS.DENSITY,
        status: getStatusAtom(),
      },
      {
        name: STEPS.DISTRIBUTION,
        status: getStatusAtom(),
      },
      {
        name: STEPS.POSITION,
        status: getStatusAtom(),
      },
    ],
  },
  {
    name: GROUPS.CELL_MODEL_ASSIGNMENT,
    items: [
      {
        name: STEPS.M_MODEL,
        status: getStatusAtom(),
      },
      {
        name: STEPS.E_MODEL,
        status: getStatusAtom(),
      },
      {
        name: STEPS.ME_MODEL,
        status: getStatusAtom(),
      },
    ],
  },
  {
    name: GROUPS.CONNECTOME_DEFINITION,
    items: [
      {
        name: STEPS.MACRO,
        status: getStatusAtom(),
      },
      {
        name: STEPS.MESO,
        status: getStatusAtom(),
      },
      {
        name: STEPS.MICRO,
        status: getStatusAtom(),
      },
    ],
  },
  {
    name: GROUPS.CONNECTION_MODEL_ASSIGNMENT,
    items: [
      {
        name: STEPS.MACRO,
        status: getStatusAtom(),
      },
      {
        name: STEPS.MESO,
        status: getStatusAtom(),
      },
      {
        name: STEPS.MICRO,
        status: getStatusAtom(),
      },
    ],
  },
];
