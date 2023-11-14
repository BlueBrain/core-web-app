import { MEFeatureWithEModel } from '@/types/me-model';
import { MEModelConfigPayload } from '@/types/nexus';

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

export const defaultMEModelConfigPayload: MEModelConfigPayload = {
  variantDefinition: {
    neurons_me_model: {
      algorithm: 'neurons_me_model',
      version: 'v1',
    },
  },
  defaults: {
    neurons_me_model: {
      '@id':
        'https://bbp.epfl.ch/data/bbp/mmb-point-neuron-framework-model/2ec96e9f-7254-44b5-bbcb-fdea3e18f110',
      '@type': ['PlaceholderEModelConfig', 'Entity'],
    },
  },
  overrides: {
    neurons_me_model: {},
  },
};
