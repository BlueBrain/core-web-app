import { NeuriteType, ParamsToDisplay } from '@/types/m-model';

export const mockNeuriteType: NeuriteType = 'apical_dendrite';

export const paramsToDisplay: ParamsToDisplay = {
  randomness: {
    displayName: 'Randomness',
    min: 0,
    max: 1,
    step: 0.01,
  },
  radius: {
    displayName: 'Radius',
    min: 0.1,
    max: 10,
    step: 0.1,
  },
  step_size: {
    displayName: 'Step size',
    min: 0.1,
    max: 10,
    step: 0.1,
  },
};
