import { DefaultMModelType, NeuriteType, ParamsToDisplay } from '@/types/m-model';

export const synthesisPreviewApiUrl =
  'https://synthesis.sbo.kcp.bbp.epfl.ch/synthesis-with-resources';

export const paramsToDisplay: ParamsToDisplay = {
  randomness: {
    displayName: 'Randomness',
    min: 0,
    max: 0.5,
    step: 0.01,
  },
  step_size: {
    displayName: 'Step size',
    min: 0.1,
    max: 10,
    step: 0.1,
  },
  orientation: {
    displayName: 'Orientation',
  },
};

export const neuriteTypes: Record<NeuriteType, NeuriteType> = {
  basal_dendrite: 'basal_dendrite',
  apical_dendrite: 'apical_dendrite',
  axon: 'axon',
};

export const DEFAULT_M_MODEL: DefaultMModelType = {
  value: {
    id: 'http://uri.interlex.org/base/ilx_0383192',
    name: 'L1_DAC',
    brainRegionId: 'http://api.brain-map.org/api/v2/data/Structure/558',
  },
};

export const DEFAULT_M_MODEL_STORAGE_KEY = 'lastClickedMModel';
