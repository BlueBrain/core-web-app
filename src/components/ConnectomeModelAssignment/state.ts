import { atom } from 'jotai';

import sessionAtom from '@/state/session';
import { SynapticAssignmentRule, SynapticType } from '@/types/connectome-model-assignment';
import { fetchJsonFileByUrl, queryES } from '@/api/nexus';
import { connInitialParamsFile, connInitialRulesFile, nexus } from '@/config';
import { composeUrl } from '@/util/nexus';
import {
  RulesResource,
  SynapseConfigPayload,
  SynapseConfigResource,
  TypesResource,
} from '@/types/nexus';

const INTIAL_RULES_URL = composeUrl('file', connInitialRulesFile.id, {
  org: nexus.org,
  project: nexus.project,
});

const INITIAL_PARAMETERS_URL = composeUrl('file', connInitialParamsFile.id, {
  org: nexus.org,
  project: nexus.project,
});

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

export type SynapseEditorData = {
  configResource: SynapseConfigResource;
  configPayload: SynapseConfigPayload;
  rulesEntity: RulesResource;
  typesEntity: TypesResource;
};

export const rulesDataAtom = atom<SynapseEditorData | null>(null);
