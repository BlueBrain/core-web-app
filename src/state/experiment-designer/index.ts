'use client';

import { atom } from 'jotai';
import { Session } from 'next-auth';
import { selectAtom } from 'jotai/utils';
import debounce from 'lodash/debounce';

import { ExpDesignerConfig } from '@/types/experiment-designer';
import paramsDummyData from '@/components/experiment-designer/experiment-designer-dummy.json';
import detailedCircuitAtom from '@/state/circuit';
import sessionAtom from '@/state/session';
import { DetailedCircuitResource, SimulationCampaignUIConfigResource } from '@/types/nexus';
import { createHeaders } from '@/util/utils';
import {
  fetchJsonFileByUrl,
  fetchResourceById,
  updateJsonFileByUrl,
  updateResource,
} from '@/api/nexus';
import { createDistribution } from '@/util/nexus';
import { autoSaveDebounceInterval } from '@/config';

const nodeSetsAPIUrl = 'https://cells.sbo.kcp.bbp.epfl.ch/circuit/node_sets?input_path=';

export const expDesignerConfigAtom = atom<ExpDesignerConfig>(paramsDummyData as ExpDesignerConfig);

export const idAtom = atom<string | null>(null);

export const refetchTriggerAtom = atom<{}>({});
export const triggerRefetchAtom = atom(null, (get, set) => set(refetchTriggerAtom, {}));

const configResourceAtom = atom<Promise<SimulationCampaignUIConfigResource | null>>(async (get) => {
  const session = get(sessionAtom);
  const id = get(idAtom);

  get(refetchTriggerAtom);

  if (!session || !id) return null;

  return fetchResourceById<SimulationCampaignUIConfigResource>(id, session);
});

const configPayloadUrlAtom = selectAtom(
  configResourceAtom,
  (config) => config?.distribution.contentUrl
);

export const remoteConfigPayloadAtom = atom<Promise<ExpDesignerConfig | null>>(async (get) => {
  const session = get(sessionAtom);
  const configPayloadUrl = await get(configPayloadUrlAtom);

  if (!session || !configPayloadUrl) {
    return null;
  }

  return fetchJsonFileByUrl<ExpDesignerConfig>(configPayloadUrl, session);
});

const updateConfigPayloadAtom = atom<null, [ExpDesignerConfig], Promise<void>>(
  null,
  async (get, set, configPayload) => {
    const session = get(sessionAtom);
    const configResource = await get(configResourceAtom);

    if (!session) {
      throw new Error('No auth session found in the state');
    }

    if (!configResource) return;

    const updatedFile = await updateJsonFileByUrl(
      configResource?.distribution.contentUrl,
      configPayload,
      'sim-campaing-ui-config.json',
      session
    );

    configResource.distribution = createDistribution(updatedFile);
    await updateResource(configResource, configResource?._rev, session);
    set(triggerRefetchAtom);
  }
);

const triggerUpdateDebouncedAtom = atom<null, [ExpDesignerConfig], Promise<void>>(
  null,
  debounce(
    (get, set, configPayload) => set(updateConfigPayloadAtom, configPayload),
    autoSaveDebounceInterval
  )
);

export const setConfigPayloadAtom = atom<null, [], void>(null, (get, set) => {
  const configPayload = get(expDesignerConfigAtom);
  set(triggerUpdateDebouncedAtom, configPayload);
});

type NodeSetsResponseType = {
  node_sets: string[];
};

async function fetchTargetsByCircuit(
  detailedCircuit: DetailedCircuitResource,
  session: Session
): Promise<string[]> {
  const circuitConfigPath = detailedCircuit.circuitConfigPath.url.replace('file://', '');
  const url = `${nodeSetsAPIUrl}${circuitConfigPath}`;

  const resp: NodeSetsResponseType = await fetch(url, {
    headers: createHeaders(session.accessToken),
  }).then<NodeSetsResponseType>((res) => res.json());
  return resp.node_sets;
}

export const targetListAtom = atom<Promise<string[]>>(async (get) => {
  const session = get(sessionAtom);
  const detailedCircuit = await get(detailedCircuitAtom);
  if (!detailedCircuit || !session) return [];

  return fetchTargetsByCircuit(detailedCircuit, session);
});

export const campaignNameAtom = atom('');
export const campaignDescriptionAtom = atom('');

export default expDesignerConfigAtom;
