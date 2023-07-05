import { atom } from 'jotai';

import { MModelParamConfig, MModelPreviewInterface } from '@/types/m-model';
import { selectedBrainRegionAtom } from '@/state/brain-regions';

export const selectedMModelNameAtom = atom<string | null>(null);

// TODO: replace this for proper brain - Mtype from nexus
const mockParamsUrl =
  'https://raw.githubusercontent.com/BlueBrain/NeuroTS/main/tests/data/bio_path_params.json';

const paramsAndDistResources = {
  resources: {
    parameters_id:
      'https://bbp.epfl.ch/neurosciencegraph/data/16d47353-41e9-483d-90b8-522e430f4278',
    distributions_id:
      'https://bbp.epfl.ch/neurosciencegraph/data/8391281e-9cbf-4424-a41b-d31774475753',
  },
};

export const mModelConfigAtom = atom<Promise<MModelParamConfig | null>>(async (get) => {
  const brainRegion = get(selectedBrainRegionAtom);
  const mType = get(selectedMModelNameAtom);

  // TODO: remove this line when we actually do something with these
  console.log(`Fetching M-Model config for (${brainRegion?.title}) - (${mType})...`);
  const paramsResponse = await fetch(mockParamsUrl);
  const params = (await paramsResponse.json()) as MModelParamConfig;

  const configKeys = Object.keys(params) as (keyof MModelParamConfig)[];
  const processed = configKeys.reduce((processedParams, configKey) => {
    if (configKey === 'apical_dendrite' || configKey === 'basal_dendrite') {
      const cloned = structuredClone(params[configKey]);
      if (typeof cloned.step_size !== 'number') {
        // just for simplicity in slider
        cloned.step_size = cloned.step_size.norm.mean;
      }
      // eslint-disable-next-line no-param-reassign
      processedParams[configKey] = cloned;
      return processedParams;
    }
    const cloned = structuredClone(params[configKey]);
    // @ts-ignore
    // eslint-disable-next-line no-param-reassign
    processedParams[configKey] = cloned;
    return processedParams;
  }, {} as MModelParamConfig);
  return processed;
});

export const mModelPreviewConfigAtom = atom<MModelPreviewInterface>({
  ...paramsAndDistResources,
  overrides: {},
});
