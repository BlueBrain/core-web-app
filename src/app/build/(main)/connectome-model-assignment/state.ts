import { atom } from 'jotai';
import { SynapticRule } from './types';
import sessionAtom from '@/state/session';
import { fetchJsonFileByUrl } from '@/api/nexus';

const INTIAL_RULES_URL =
  'https://bbp.epfl.ch/nexus/v1/files/bbp/mmb-point-neuron-framework-model/28b58ddd-cd0b-4704-ad91-843775fa3743';

export const initialRulesAtom = atom(async (get) => {
  const session = get(sessionAtom);

  if (!session) {
    return null;
  }

  return fetchJsonFileByUrl<SynapticRule[]>(INTIAL_RULES_URL, session);
});
