'use client';

import { atom } from 'jotai';
import { tableFromIPC } from '@apache-arrow/es5-cjs';

import sessionAtom from '@/state/session';
import { WholeBrainConnectomeStrengthResource } from '@/types/nexus';
import { fetchResourceById, fetchFileByUrl } from '@/api/nexus';

const INITIAL_WHOLE_BRAIN_CONNECTOME_STRENGTH_ID =
  'https://bbp.epfl.ch/neurosciencegraph/data/connectomestrength/8e285d4b-4d09-4357-98ae-9e9fc61face6';

const refetchTriggerAtom = atom<{}>({});
export const triggerRefetchAtom = atom(null, (get, set) => set(refetchTriggerAtom, {}));

export const initialConnectivityStrengthEntityAtom = atom<
  Promise<WholeBrainConnectomeStrengthResource | null>
>(async (get) => {
  const session = get(sessionAtom);

  get(refetchTriggerAtom);

  if (!session) return null;

  return fetchResourceById<WholeBrainConnectomeStrengthResource>(
    INITIAL_WHOLE_BRAIN_CONNECTOME_STRENGTH_ID,
    session
  );
});

export const initialConnectivityStrengthTableAtom = atom(async (get) => {
  const session = get(sessionAtom);
  const initialConnectivityStrengthEntity = await get(initialConnectivityStrengthEntityAtom);

  if (!session || !initialConnectivityStrengthEntity) return null;

  return tableFromIPC(
    fetchFileByUrl(initialConnectivityStrengthEntity.distribution.contentUrl, session)
  );
});
