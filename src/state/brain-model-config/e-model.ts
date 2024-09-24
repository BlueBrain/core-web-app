import { atom } from 'jotai';
import { EModel, EModelConfiguration, EModelWorkflow } from '@/types/e-model';
import sessionAtom from '@/state/session';
import { fetchResourceById } from '@/api/nexus';

import {
  selectedEModelResourceAtom,
  selectedEModelOrgAtom,
  selectedEModelProjectAtom,
} from '@/state/virtual-lab/build/me-model';

export const selectedEModelWorkflowAtom = atom(async (get) => {
  const resource = (await get(selectedEModelResourceAtom)) as
    | (Omit<EModel, 'generation'> & { generation: { followedWorkflow: string } })
    | undefined;

  if (!resource) return;

  const session = get(sessionAtom);
  const org = await get(selectedEModelOrgAtom);
  const project = await get(selectedEModelProjectAtom);

  if (!session || !org || !project || !resource.generation.followedWorkflow) return;

  const followedWorkflow = await fetchResourceById<EModelWorkflow>(
    resource.generation.followedWorkflow,
    session,
    { org, project }
  );

  return followedWorkflow;
});

export const selectedEModelConfigurationAtom = atom(async (get) => {
  const followedWorkflow = await get(selectedEModelWorkflowAtom);

  if (!followedWorkflow) return;

  const { '@id': eModelConfigurationId } = followedWorkflow.hasPart.find(
    ({ '@type': type }) => type === 'EModelConfiguration'
  ) ?? { '@id': undefined };

  if (!eModelConfigurationId) return;

  const session = get(sessionAtom);
  const org = await get(selectedEModelOrgAtom);
  const project = await get(selectedEModelProjectAtom);

  if (!session || !org || !project) return;

  const eModelConfiguration = await fetchResourceById<EModelConfiguration>(
    eModelConfigurationId,
    session,
    { org, project }
  );

  return eModelConfiguration;
});
