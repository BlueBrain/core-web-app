import { atom } from 'jotai';

import sessionAtom from '@/state/session';
import {
  SimulationCampaignUIConfigResource,
  WorkflowExecution,
  LaunchedSimCampUIConfigType,
} from '@/types/nexus';
import { queryES } from '@/api/nexus';
import {
  getLaunchedSimCampQuery,
  getPersonalSimCampConfigsQuery,
  getSimCampConfigsQuery,
  getWorkflowExecutionsQuery,
} from '@/queries/es';

export const refetchTriggerAtom = atom<{}>({});
export const triggerRefetchAtom = atom(null, (get, set) => set(refetchTriggerAtom, {}));

export const campaignNameAtom = atom('');
export const campaignDescriptionAtom = atom('');

export const searchSimCampUIConfigListStringAtom = atom<string>('');

type SearchType = 'public' | 'personal';

export const searchConfigListTypeAtom = atom<SearchType>('public');

export const simCampaingListAtom = atom<Promise<SimulationCampaignUIConfigResource[]>>(
  async (get) => {
    const session = get(sessionAtom);
    const searchType = get(searchConfigListTypeAtom);
    const searchString = get(searchSimCampUIConfigListStringAtom);

    get(refetchTriggerAtom);

    if (!session) return [];

    let query;

    if (searchType === 'public') {
      query = getSimCampConfigsQuery(searchString);
    } else if (searchType === 'personal') {
      query = getPersonalSimCampConfigsQuery(session.user.username, searchString);
    } else {
      throw new Error('SearchType is not supported');
    }

    return queryES<SimulationCampaignUIConfigResource>(query, session);
  }
);

export const searchLaunchedSimCampStringAtom = atom<string>('');
export const refetchLaunchedSimCampTriggerAtom = atom<{}>({});
export const triggerLaunchedSimCampRefetchAtom = atom(null, (get, set) =>
  set(refetchLaunchedSimCampTriggerAtom, {})
);

const createLaunchedSimCampObj = (
  simCampUIConfig: SimulationCampaignUIConfigResource,
  workflowExecutionEntity: WorkflowExecution
): LaunchedSimCampUIConfigType => ({
  ...simCampUIConfig,
  startedAtTime: workflowExecutionEntity.startedAtTime,
  endedAtTime: workflowExecutionEntity.endedAtTime,
  status: workflowExecutionEntity.status,
});

export const launchedSimCampaignListAtom = atom<Promise<LaunchedSimCampUIConfigType[]>>(
  async (get) => {
    const session = get(sessionAtom);
    const searchString = get(searchLaunchedSimCampStringAtom);

    get(triggerLaunchedSimCampRefetchAtom);

    if (!session) return [];

    const launchedSimCampQuery = getLaunchedSimCampQuery(searchString);
    const launchedSimCampUIConfigs = await queryES<SimulationCampaignUIConfigResource>(
      launchedSimCampQuery,
      session
    );

    const workflowExecutionIds = launchedSimCampUIConfigs
      .map((simCampUIConfig) => simCampUIConfig.wasInfluencedBy?.['@id'])
      // TODO adding this check has no effect on linter. Investigate
      .filter((id) => typeof id !== 'undefined');

    // @ts-ignore
    const workflowExecutionsQuery = getWorkflowExecutionsQuery(workflowExecutionIds);
    const workflowExecutionEntities = await queryES<WorkflowExecution>(
      workflowExecutionsQuery,
      session
    );

    return workflowExecutionEntities.map((workflowExecutionEntity) => {
      const simCampUIConfig = launchedSimCampUIConfigs.find(
        (simCamp) => simCamp.wasInfluencedBy?.['@id'] === workflowExecutionEntity['@id']
      );
      if (!simCampUIConfig) {
        throw new Error('Simulation campaign UI config not found for WorkflowExecution');
      }

      return createLaunchedSimCampObj(simCampUIConfig, workflowExecutionEntity);
    });
  }
);
