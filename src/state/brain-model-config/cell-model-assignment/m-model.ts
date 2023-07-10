import { atom } from 'jotai';

import { ParamConfig, SynthesisPreviewInterface } from '@/types/m-model';
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

export const mModelLocalConfigAtom = atom<ParamConfig | null>(null);
export const mModelRemoteConfigLoadedAtom = atom(false);

export const mModelGetRemoteConfigAtom = atom<null, [], Promise<ParamConfig | null>>(
  null,
  async (get, set) => {
    const brainRegion = get(selectedBrainRegionAtom);
    const mType = get(selectedMModelNameAtom);

    // TODO: remove this line when we actually do something with these
    console.log(`Fetching M-Model config for (${brainRegion?.title}) - (${mType})...`);
    const paramsResponse = await fetch(mockParamsUrl);
    const params = (await paramsResponse.json()) as ParamConfig;
    set(mModelLocalConfigAtom, params);
    set(mModelRemoteConfigLoadedAtom, true);
    return params;
  }
);

export const mModelPreviewConfigAtom = atom<SynthesisPreviewInterface>({
  ...paramsAndDistResources,
  overrides: {},
});
