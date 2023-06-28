import { atom } from 'jotai';

import { MModelParamConfig } from '@/types/m-model';
import { selectedBrainRegionAtom } from '@/state/brain-regions';

export const selectedMModelNameAtom = atom<string | null>(null);

const mockParamsUrl =
  'https://raw.githubusercontent.com/BlueBrain/NeuroTS/main/tests/data/bio_path_params.json';

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
