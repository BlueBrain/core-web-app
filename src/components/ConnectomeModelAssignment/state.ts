import { atom } from 'jotai';
import { SynapticAssignmentRule, SynapticType } from '@/types/connectome-model-assignment';
import sessionAtom from '@/state/session';
import { fetchJsonFileByUrl, queryES } from '@/api/nexus';
import { RulesResource, SynapseConfigPayload, SynapseConfigResource } from '@/types/nexus';

const INTIAL_RULES_URL =
  'https://bbp.epfl.ch/nexus/v1/files/bbp/mmb-point-neuron-framework-model/https%3A%2F%2Fbbp.epfl.ch%2Fneurosciencegraph%2Fdata%2F7e2f41a0-3d84-4142-a38e-734117acb33d';

const INITIAL_PARAMETERS_URL =
  'https://bbp.epfl.ch/nexus/v1/files/bbp/mmb-point-neuron-framework-model/https%3A%2F%2Fbbp.epfl.ch%2Fneurosciencegraph%2Fdata%2F2924ab22-086e-42d5-96ee-f9ce46ccf4b4';

export const initialRulesAtom = atom(async (get) => {
  const session = get(sessionAtom);

  if (!session) {
    return null;
  }

  return fetchJsonFileByUrl<SynapticAssignmentRule[]>(INTIAL_RULES_URL, session);
});

export const synapticModelsAtom = atom(async (get) => {
  const session = get(sessionAtom);
  if (!session) return [];
  const q = {
    query: {
      bool: {
        filter: [
          {
            bool: {
              must: { term: { _deprecated: false } },
            },
          },
          {
            bool: {
              must: { term: { '@type': 'SynapsePhysiologyModel' } },
            },
          },
        ],
      },
    },
  };

  const r = await queryES<{ name: string }>(q, session);
  return r.map((model) => model.name);
});

export const initialTypesAtom = atom(async (get) => {
  const session = get(sessionAtom);

  if (!session) {
    return null;
  }

  return fetchJsonFileByUrl<{ [type: string]: SynapticType }>(INITIAL_PARAMETERS_URL, session);
});

export const userRulesAtom = atom<SynapticAssignmentRule[]>([]);
export const userTypesAtom = atom<[string, SynapticType][]>([]);
export const loadingAtom = atom(false);

export type RulesData = {
  configResource: SynapseConfigResource;
  configPayload: SynapseConfigPayload;
  rulesEntity: RulesResource;
  rules: SynapticAssignmentRule[];
};

export const rulesDataAtom = atom<Omit<RulesData, 'rules'> | null>(null);
