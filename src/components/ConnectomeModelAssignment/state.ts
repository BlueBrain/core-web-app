import { atom } from 'jotai';
import { SynapticAssignmentRule } from '@/types/connectome-model-assignment';
import sessionAtom from '@/state/session';
import { fetchJsonFileByUrl } from '@/api/nexus';

const INTIAL_RULES_URL =
  'https://bbp.epfl.ch/nexus/v1/files/bbp/mmb-point-neuron-framework-model/28b58ddd-cd0b-4704-ad91-843775fa3743';

const INITIAL_PARAMETERS_URL =
  'https://bbp.epfl.ch/nexus/v1/files/bbp/mmb-point-neuron-framework-model/2924ab22-086e-42d5-96ee-f9ce46ccf4b4';

export const initialRulesAtom = atom(async (get) => {
  const session = get(sessionAtom);

  if (!session) {
    return null;
  }

  return fetchJsonFileByUrl<SynapticAssignmentRule[]>(INTIAL_RULES_URL, session);
});

export const initialParamsAtom = atom(async (get) => {
  const session = get(sessionAtom);

  if (!session) {
    return null;
  }

  return fetchJsonFileByUrl<SynapticAssignmentRule[]>(INITIAL_PARAMETERS_URL, session);
});
