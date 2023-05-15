'use client';

import { atom } from 'jotai';
import { Session } from 'next-auth';

import { selectAtom } from 'jotai/utils';
import { ExpDesignerConfig } from '@/types/experiment-designer';
import paramsDummyData from '@/components/experiment-designer/experiment-designer-dummy.json';
import detailedCircuitAtom from '@/state/circuit';
import sessionAtom from '@/state/session';
import { DetailedCircuitResource, SimulationCampaignUIConfigResource } from '@/types/nexus';
import { createHeaders } from '@/util/utils';
import { fetchJsonFileByUrl, fetchResourceById } from '@/api/nexus';

const nodeSetsAPIUrl = 'https://cells.sbo.kcp.bbp.epfl.ch/circuit/node_sets?input_path=';

export const expDesignerConfigAtom = atom<ExpDesignerConfig>(paramsDummyData as ExpDesignerConfig);

export const idAtom = atom<string | null>(null);

const configResourceAtom = atom<Promise<SimulationCampaignUIConfigResource | null>>(async (get) => {
  const session = get(sessionAtom);
  const id = get(idAtom);

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
