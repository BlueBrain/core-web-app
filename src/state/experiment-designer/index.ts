'use client';

import { atom } from 'jotai';
import { Session } from 'next-auth';
import debounce from 'lodash/debounce';
import isEqual from 'lodash/isEqual';

import { ExpDesignerConfig, ExpDesignerSectionName } from '@/types/experiment-designer';
import expDesParamsDefaults from '@/components/experiment-designer/experiment-designer-defaults';
import detailedCircuitAtom from '@/state/circuit';
import sessionAtom from '@/state/session';
import {
  BrainModelConfigResource,
  DetailedCircuitResource,
  GeneratorTaskActivity,
  SimulationCampaignUIConfigResource,
  WorkflowExecution,
} from '@/types/nexus';
import { createHeaders } from '@/util/utils';
import {
  fetchJsonFileByUrl,
  fetchResourceById,
  fetchResourceByUrl,
  queryES,
  updateJsonFileByUrl,
  updateResource,
} from '@/api/nexus';
import { createDistribution } from '@/util/nexus';
import { autoSaveDebounceInterval } from '@/config';
import {
  getBuiltBrainModelConfigsQuery,
  getGeneratorTaskActivityByCircuitIdQuery,
} from '@/queries/es';
import {
  processStimuliAllowedModules,
  processStimulationConditionalParams,
} from '@/util/experiment-designer';

const nodeSetsAPIUrl = 'https://cells.sbo.kcp.bbp.epfl.ch/circuit/node_sets?input_path=';

export const expDesignerConfigAtomBase = atom<ExpDesignerConfig>(expDesParamsDefaults);

/* this is a derivated atom that will modify the params of the config based on
   some user input in the stimulus section */
export const expDesignerConfigAtom = atom<ExpDesignerConfig, [ExpDesignerConfig?], void>(
  (get) => {
    const params = get(expDesignerConfigAtomBase);
    const sectionNames = Object.keys(params) as ExpDesignerSectionName[];
    const processedConfig = sectionNames.reduce((newConfig, sectionName) => {
      if (sectionName === 'stimuli') {
        let stimuliConfig = structuredClone(params[sectionName]);
        stimuliConfig = processStimuliAllowedModules(stimuliConfig);
        stimuliConfig = processStimulationConditionalParams(stimuliConfig);
        newConfig[sectionName] = stimuliConfig; // eslint-disable-line no-param-reassign
        return newConfig;
      }
      if (sectionName === 'recording') {
        const recordingConfig = structuredClone(params[sectionName]);
        newConfig[sectionName] = recordingConfig; // eslint-disable-line no-param-reassign
        return newConfig;
      }
      newConfig[sectionName] = structuredClone(params[sectionName]); // eslint-disable-line no-param-reassign
      return newConfig;
    }, {} as ExpDesignerConfig);
    return processedConfig;
  },
  (get, set, config) => {
    if (!config) return;
    set(expDesignerConfigAtomBase, config);
  }
);

export const idAtom = atom<string | null>(null);

export const refetchTriggerAtom = atom<{}>({});

export const triggerRefetchAtom = atom(null, (get, set) => set(refetchTriggerAtom, {}));

export const configResourceAtom = atom<Promise<SimulationCampaignUIConfigResource | null>>(
  async (get) => {
    const session = get(sessionAtom);
    const id = get(idAtom);

    get(refetchTriggerAtom);

    if (!session || !id) return null;

    return fetchResourceById<SimulationCampaignUIConfigResource>(id, session);
  }
);

const configPayloadUrlAtom = atom<Promise<string | null>>(async (get) => {
  const configResource = await get(configResourceAtom);
  if (!configResource) return null;

  return configResource.distribution.contentUrl;
});

export const isConfigUsedInSimAtom = atom<Promise<boolean | null>>(async (get) => {
  const configResource = await get(configResourceAtom);
  if (!configResource) return null;

  return !!configResource?.wasInfluencedBy?.['@id'];
});

export const simCampaignUserAtom = atom<Promise<string | null>>(async (get) => {
  const configResource = await get(configResourceAtom);
  if (!configResource) return null;

  const { contribution } = configResource;
  if (Array.isArray(contribution)) {
    return contribution.map((c) => c.agent.name).join(', ');
  }
  return contribution.agent.name || 'Unknown';
});

export const remoteConfigPayloadAtom = atom<Promise<ExpDesignerConfig | null>>(async (get) => {
  const session = get(sessionAtom);
  const configPayloadUrl = await get(configPayloadUrlAtom);

  if (!session || !configPayloadUrl) {
    return null;
  }

  const savedConfig = await fetchJsonFileByUrl<ExpDesignerConfig>(configPayloadUrl, session);
  if (!Object.keys(savedConfig).length) {
    throw new Error('Remote simulation campaign ui config empty');
  }

  return savedConfig;
});

export const savedConfigAtom = atom<ExpDesignerConfig | null>(null);

const updateConfigPayloadAtom = atom<null, [], Promise<void>>(null, async (get, set) => {
  const localConfigPayload = get(expDesignerConfigAtom);
  const savedConfigPayload = get(savedConfigAtom);

  if (!localConfigPayload || !savedConfigPayload) return;
  if (isEqual(localConfigPayload, savedConfigPayload)) return;

  const session = get(sessionAtom);
  const configResource = await get(configResourceAtom);

  if (!session) {
    throw new Error('No auth session found in the state');
  }

  if (!configResource) return;

  const updatedFile = await updateJsonFileByUrl(
    configResource?.distribution.contentUrl,
    localConfigPayload,
    'sim-campaign-ui-config.json',
    session
  );

  configResource.distribution = createDistribution(updatedFile);
  await updateResource(configResource, session);
  set(triggerRefetchAtom);
});

const triggerUpdateDebouncedAtom = atom<null, [], Promise<void>>(
  null,
  debounce((get, set) => set(updateConfigPayloadAtom), autoSaveDebounceInterval, { leading: true }) // Leading ensures API call is made on the leading edge of the waiting period so that if no other calls have been made there is no wait.
);

export const setConfigPayloadAtom = atom<null, [], void>(null, (get, set) => {
  set(triggerUpdateDebouncedAtom);
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

export const setWorkflowExecutionAndCloneAtom = atom<null, [string], Promise<void>>(
  null,
  async (get, set, workflowExecutionUrl) => {
    const session = get(sessionAtom);
    const configResource = await get(configResourceAtom);

    if (!session) {
      throw new Error('No auth session found in the state');
    }

    if (!configResource || !workflowExecutionUrl) return;

    const workflowExecutionResource = await fetchResourceByUrl<WorkflowExecution>(
      workflowExecutionUrl,
      session
    );

    const updatedResource: SimulationCampaignUIConfigResource = {
      ...configResource,
      wasInfluencedBy: {
        '@type': 'WorkflowExecution',
        '@id': workflowExecutionResource['@id'],
      },
    };

    await updateResource(updatedResource, session);
  }
);

export const brainModelConfigIdFromSimCampUIConfigIdAtom = atom<Promise<string | null>>(
  async (get) => {
    const session = get(sessionAtom);
    const simCampUIConfigResource = await get(configResourceAtom);

    if (!session || !simCampUIConfigResource) return null;

    const detailedCircuitId = simCampUIConfigResource.used['@id'];

    const queryGeneratorTaskActivity = getGeneratorTaskActivityByCircuitIdQuery(detailedCircuitId);
    const generatorTaskActivities = await queryES<GeneratorTaskActivity>(
      queryGeneratorTaskActivity,
      session
    );

    const generatorTaskActivityResource = generatorTaskActivities[0];
    const synpaseConfigId = generatorTaskActivityResource.used_config['@id'];

    const brainModelConfigQuery = getBuiltBrainModelConfigsQuery('', [synpaseConfigId]);
    const brainModelConfigs = await queryES<BrainModelConfigResource>(
      brainModelConfigQuery,
      session
    );

    if (!brainModelConfigs.length) return null;

    return brainModelConfigs[0]['@id'];
  }
);
