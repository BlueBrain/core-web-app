import type { BaseEntity } from '@/types/nexus';

const SIM_CAMP_GEN_ONTOLOGY_STR =
  'https://bbp.epfl.ch/ontologies/core/bmo/SimulationCampaignGeneration';
const SIM_CAMP_CONF_ONTOLOGY_STR =
  'https://bbp.epfl.ch/ontologies/core/bmo/SimulationCampaignConfiguration';
const WORKFLOW_EXECUTION_STR = 'WorkflowExecution';

export function getInfo(url: string, headers: HeadersInit) {
  return fetch(url, { method: 'get', headers }).then((response) => response.json());
}

async function pollingUntilFetch(url: string, cbCheck: any, headers: HeadersInit): Promise<void> {
  const response = await getInfo(url, headers);
  if (!cbCheck(response)) {
    // eslint-disable-next-line no-promise-executor-return
    await new Promise((r) => setTimeout(r, 4 * 1000));
    await pollingUntilFetch(url, cbCheck, headers);
  }
}

async function getResourceFromIncome(
  nexusEntity: BaseEntity,
  type: string,
  headers: HeadersInit
): Promise<BaseEntity> {
  /* eslint-disable no-underscore-dangle */
  const incomings = await getInfo(nexusEntity._incoming, headers);
  const incomeResource = incomings._results.find((item: any) => item['@type'] === type);
  return getInfo(incomeResource._self, headers);
  /* eslint-enable no-underscore-dangle */
}

export async function getSimulationCampaignConfiguration(
  accessToken: string,
  simulationExecutionUrl: string
): Promise<string> {
  /* eslint-disable no-underscore-dangle */
  const headers = new Headers({ Authorization: `Bearer ${accessToken}` });

  // WorkflowExecution -> SimulationCampaignGeneration
  const workflowExecution = await getInfo(simulationExecutionUrl, headers);
  if (workflowExecution['@type'] !== WORKFLOW_EXECUTION_STR) {
    throw new Error('URL passed is not WorkflowExecution');
  }
  const callbackCheck = (response: any) => response._results.length > 0;
  await pollingUntilFetch(workflowExecution._incoming, callbackCheck, headers);
  const simulationCampaignGeneration: BaseEntity = await getResourceFromIncome(
    workflowExecution,
    SIM_CAMP_GEN_ONTOLOGY_STR,
    headers
  );

  // Checking for simulation to produce outputs
  const callbackCheckFinished = (response: any) => response.status === 'Done';
  await pollingUntilFetch(simulationCampaignGeneration._self, callbackCheckFinished, headers);

  // SimulationCampaignGeneration -> SimulationCampaignConfiguration
  const simulationCampaignConfiguration: BaseEntity = await getResourceFromIncome(
    simulationCampaignGeneration,
    SIM_CAMP_CONF_ONTOLOGY_STR,
    headers
  );
  const simCampConfNexusUrl = simulationCampaignConfiguration._self;

  return simCampConfNexusUrl;
  /* eslint-enable no-underscore-dangle */
}
