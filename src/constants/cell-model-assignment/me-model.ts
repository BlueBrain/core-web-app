import { MEFeatureWithEModel, DefaultMEModelType } from '@/types/me-model';

export const featureWithEModel: MEFeatureWithEModel = {
  somaDiameter: {
    displayName: 'Soma diameter',
    range: [0, 100],
    step: 1,
    selectedRange: [30, 80],
    eModel: null,
  },
  yyy: {
    displayName: 'YYY',
    range: [0, 100],
    step: 1,
    selectedRange: [30, 80],
    eModel: null,
  },
};

export const DEFAULT_ME_MODEL: DefaultMEModelType = {
  mePairValue: ['L1_DAC', 'bNAC'],
  eModelValue: {
    name: 'EM__66aaeea__bNAC__6',
    id: 'https://bbp.epfl.ch/data/bbp/mmb-point-neuron-framework-model/82632ef0-a084-4fce-a1fc-cb6874a67731',
    eType: 'bNAC',
    mType: 'L1_DAC',
    isOptimizationConfig: false,
    rev: 2,
  },
  brainRegionId: 'http://api.brain-map.org/api/v2/data/Structure/558',
};

export const DEFAULT_ME_MODEL_STORAGE_KEY = 'lastClickedMEModel';
