import { atom } from 'jotai';
import lodashGet from 'lodash/get';

import {
  DefaultEModelPlaceholder,
  DefaultPlaceholders,
  MEFeatureWithEModel,
} from '@/types/me-model';
import { Distribution, Entity, MEModelConfigPayload, MEModelConfigResource } from '@/types/nexus';
import { analysedETypesAtom } from '@/state/build-composition';
import sessionAtom from '@/state/session';
import { meModelConfigIdAtom } from '@/state/brain-model-config';
import { fetchJsonFileByUrl, fetchResourceById } from '@/api/nexus';
import { selectedBrainRegionAtom } from '@/state/brain-regions';

export const refetchTriggerAtom = atom<{}>({});

export const featureWithEModelAtom = atom<MEFeatureWithEModel | null>(null);

export const selectedMENameAtom = atom<[string, string] | [null, null]>([null, null]);

export const localConfigPayloadAtom = atom<MEModelConfigPayload | null>(null);

export const configAtom = atom<Promise<MEModelConfigResource | null>>(async (get) => {
  const session = get(sessionAtom);
  const id = await get(meModelConfigIdAtom);

  get(refetchTriggerAtom);

  if (!session || !id) return null;

  return fetchResourceById<MEModelConfigResource>(id, session);
});

const configPayloadUrlAtom = atom<Promise<string | undefined>>(async (get) => {
  const config = await get(configAtom);
  return config?.distribution.contentUrl;
});

export const remoteConfigPayloadAtom = atom<Promise<MEModelConfigPayload | null>>(async (get) => {
  const session = get(sessionAtom);
  const configPayloadUrl = await get(configPayloadUrlAtom);

  if (!session || !configPayloadUrl) return null;

  return fetchJsonFileByUrl<MEModelConfigPayload>(configPayloadUrl, session);
});

export const defaultEModelPlaceholdersAtom = atom<Promise<DefaultPlaceholders | null>>(
  async (get) => {
    const session = get(sessionAtom);
    const remoteConfigPayload = await get(remoteConfigPayloadAtom);

    if (!session || !remoteConfigPayload) return null;

    type DefaultPlaceholderEntity = Entity & { distribution: Distribution };
    const defaultPlaceholder = await fetchResourceById<DefaultPlaceholderEntity>(
      remoteConfigPayload.defaults.neurons_me_model['@id'],
      session
    );

    return fetchJsonFileByUrl<DefaultPlaceholders>(
      defaultPlaceholder.distribution.contentUrl,
      session
    );
  }
);

export const defaultEModelPlaceholderAtom = atom<Promise<DefaultEModelPlaceholder | null>>(
  async (get) => {
    const defaultEModelPlaceholders = await get(defaultEModelPlaceholdersAtom);
    const selectedBrainRegion = get(selectedBrainRegionAtom);
    if (!defaultEModelPlaceholders || !selectedBrainRegion) return null;

    const [mTypeId, eTypeId] = await get(getMETypeIdAtom);
    if (!mTypeId || !eTypeId) return null;

    const path = [
      'hasPart',
      selectedBrainRegion.id,
      'hasPart',
      mTypeId,
      'hasPart',
      eTypeId,
      'hasPart',
    ];
    const defaultEModel: DefaultEModelPlaceholder | undefined = lodashGet(
      defaultEModelPlaceholders,
      path
    );
    return defaultEModel || null;
  }
);

export const getMETypeIdAtom = atom<Promise<[string, string] | [null, null]>>(async (get) => {
  const selectedMEName = get(selectedMENameAtom);
  if (!selectedMEName) return [null, null];

  const [mTypeName, eTypeName] = selectedMEName;
  if (!mTypeName || !eTypeName) return [null, null];

  const mEModelItems = await get(analysedETypesAtom);

  const mTypeId = mEModelItems[mTypeName].mTypeInfo.id;
  const eTypesInfo = mEModelItems[mTypeName].eTypeInfo;
  const eTypeId = eTypesInfo.find((eType) => eType.eType === eTypeName)?.id;
  if (!mTypeId || !eTypeId) return [null, null];

  return [mTypeId, eTypeId];
});
