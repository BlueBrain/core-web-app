import { atom } from 'jotai';
import merge from 'lodash/merge';

import { ParamConfig, SynthesisPreviewInterface } from '@/types/m-model';
import { selectedBrainRegionAtom } from '@/state/brain-regions';

export const selectedMModelNameAtom = atom<string | null>(null);
export const selectedMModelIdAtom = atom<string | null>(null);

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

export const mModelRemoteOverridesAtom = atom<ParamConfig | null>(null);

export const mModelOverridesAtom = atom<ParamConfig | {}>({});

export const mModelRemoteOverridesLoadedAtom = atom(false);

export const getMModelRemoteOverridesAtom = atom<null, [], Promise<ParamConfig | null>>(
  null,
  async (get, set) => {
    const brainRegion = get(selectedBrainRegionAtom);
    const mType = get(selectedMModelNameAtom);

    // TODO: remove this line when we actually do something with these
    // eslint-disable-next-line no-console
    console.log(`Fetching M-Model config for (${brainRegion?.title}) - (${mType})...`);
    const paramsResponse = await fetch(mockParamsUrl);
    const params = (await paramsResponse.json()) as ParamConfig;

    set(mModelRemoteOverridesAtom, params);
    set(mModelRemoteOverridesLoadedAtom, true);
    return params;
  }
);

export const getMModelLocalOverridesAtom = atom<ParamConfig | null>((get) => {
  const remoteOverrides = get(mModelRemoteOverridesAtom);

  if (!remoteOverrides) return null;

  const localOverrides = get(mModelOverridesAtom);

  const localConfig = {} as ParamConfig;
  merge(localConfig, remoteOverrides, localOverrides);
  return localConfig;
});

export const mModelPreviewConfigAtom = atom<SynthesisPreviewInterface>({
  ...paramsAndDistResources,
  overrides: {},
});
