'use client';

import { atom } from 'jotai';
import { Session } from 'next-auth';

import { ExpDesignerConfig } from '@/types/experiment-designer';
import paramsDummyData from '@/components/experiment-designer/experiment-designer-dummy.json';
import detailedCircuitAtom from '@/state/circuit';
import sessionAtom from '@/state/session';
import { DetailedCircuitResource } from '@/types/nexus';
import { createHeaders } from '@/util/utils';

const nodeSetsAPIUrl = 'https://cells.sbo.kcp.bbp.epfl.ch/circuit/node_sets?input_path=';
export const expDesignerConfigAtom = atom<ExpDesignerConfig>(paramsDummyData as ExpDesignerConfig);

export const asyncExpDesignerConfigAtom = atom<
  Promise<ExpDesignerConfig>,
  [((prevConfig: ExpDesignerConfig) => ExpDesignerConfig) | ExpDesignerConfig],
  void
>(
  (get) => {
    const expDesConfig = get(expDesignerConfigAtom);
    return Promise.resolve(expDesConfig);
  },
  (get, set, config) => {
    set(expDesignerConfigAtom, config);
  }
);

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
