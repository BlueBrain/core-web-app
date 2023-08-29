import { VariantLabel } from './types';

export const variantLabel: VariantLabel = {
  placeholder__distance_dependent: 'Distance dependent',
  placeholder__erdos_renyi: 'Erdos Renyi',
  disabled: 'Not set',
};

export const unitLabel: { [unitCode: string]: string } = {
  ms: 'ms',
  'um/ms': 'μm/ms',
  '1/um': '1/μm',
  '#synapses/connection': '# syns/conn',
};
