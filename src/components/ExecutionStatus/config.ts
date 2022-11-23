export const STATUS = {
  BUILT: 'Built',
  MODIFIED: 'Modified',
  CONFIGURED: 'Configured',
  NEED_ACTION: 'Need action',
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

const GROUPS = {
  CELL_COMPOSITION: 'Cell composition',
  CELL_MODEL_ASSIGNMENT: 'Cell model assignment',
  CONNECTOME_DEFINITION: 'Connectome definition',
  CONNECTION_MODEL_ASSIGNMENT: 'Connection model assignment',
};

export const statusStructure = [
  {
    groupName: GROUPS.CELL_COMPOSITION,
    items: [
      {
        stepName: STEPS.DENSITY,
        status: STATUS.BUILT,
      },
      {
        stepName: STEPS.DISTRIBUTION,
        status: STATUS.MODIFIED,
      },
      {
        stepName: STEPS.POSITION,
        status: STATUS.CONFIGURED,
      },
    ],
  },
  {
    groupName: GROUPS.CELL_MODEL_ASSIGNMENT,
    items: [
      {
        stepName: STEPS.M_MODEL,
        status: STATUS.CONFIGURED,
      },
      {
        stepName: STEPS.E_MODEL,
        status: STATUS.CONFIGURED,
      },
      {
        stepName: STEPS.ME_MODEL,
        status: STATUS.CONFIGURED,
      },
    ],
  },
  {
    groupName: GROUPS.CONNECTOME_DEFINITION,
    items: [
      {
        stepName: STEPS.MACRO,
        status: STATUS.NEED_ACTION,
      },
      {
        stepName: STEPS.MESO,
        status: STATUS.CONFIGURED,
      },
      {
        stepName: STEPS.MICRO,
        status: STATUS.CONFIGURED,
      },
    ],
  },
  {
    groupName: GROUPS.CONNECTION_MODEL_ASSIGNMENT,
    items: [
      {
        stepName: STEPS.MACRO,
        status: STATUS.CONFIGURED,
      },
      {
        stepName: STEPS.MESO,
        status: STATUS.CONFIGURED,
      },
      {
        stepName: STEPS.MICRO,
        status: STATUS.CONFIGURED,
      },
    ],
  },
];
