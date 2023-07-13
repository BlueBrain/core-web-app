import { MorphologyAssignmentConfigPayload } from '@/types/nexus';
import { NeuriteType, ParamsToDisplay } from '@/types/m-model';

// TODO: replace this for proper brain - Mtype from nexus
export const mockParamsUrl =
  'https://raw.githubusercontent.com/BlueBrain/NeuroTS/main/tests/data/bio_path_params.json';

export const paramsAndDistResources = {
  resources: {
    parameters_id:
      'https://bbp.epfl.ch/neurosciencegraph/data/16d47353-41e9-483d-90b8-522e430f4278',
    distributions_id:
      'https://bbp.epfl.ch/neurosciencegraph/data/8391281e-9cbf-4424-a41b-d31774475753',
  },
};

export const initialMorphologyAssigmentConfigPayload: MorphologyAssignmentConfigPayload = {
  variantDefinition: {
    topological_synthesis: {
      algorithm: 'topological_synthesis',
      version: 'v1',
    },
    placeholder_assignment: {
      algorithm: 'placeholder_assignment',
      version: 'v1',
    },
  },
  defaults: {
    topological_synthesis: {
      id: 'https://bbp.epfl.ch/neurosciencegraph/data/fe237780-92bb-496c-b7b7-620bede319a5',
      type: ['CanonicalMorphologyModelConfig', 'Entity'],
      rev: 1,
    },
    placeholder_assignment: {
      id: 'https://bbp.epfl.ch/neurosciencegraph/data/06b340d4-ac99-4459-bab4-013ef7199c36',
      type: ['PlaceholderMorphologyConfig', 'Entity'],
      rev: 1,
    },
  },
  configuration: {
    topological_synthesis: {},
  },
};

export const synthesisPreviewApiUrl =
  'https://synthesis.sbo.kcp.bbp.epfl.ch/synthesis-with-resources';

export const paramsToDisplay: ParamsToDisplay = {
  randomness: {
    displayName: 'Randomness',
    min: 0,
    max: 0.5,
    step: 0.01,
  },
  targeting: {
    displayName: 'Targeting',
    min: 0,
    max: 0.5,
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
  orientation: {
    displayName: 'Orientation',
  },
};

export const neuriteTypes: Record<NeuriteType, NeuriteType> = {
  basal_dendrite: 'basal_dendrite',
  apical_dendrite: 'apical_dendrite',
  axon: 'axon',
};
