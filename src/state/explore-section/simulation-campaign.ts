import { atom } from 'jotai';
import { selectAtom } from 'jotai/utils';
import { SimulationCampaignResource, Simulation } from '@/types/explore-section/resources';
import { fetchResourceById } from '@/api/nexus';
import {
  fetchAnalysisReportsFromEs,
  fetchSimulationsFromEs,
} from '@/api/explore-section/simulations';
import { detailAtom, sessionAndInfoAtom } from '@/state/explore-section/detail-atoms-constructor';

// fetches and stores the simulation campaign execution
const simulationCampaignExecutionAtom = atom<Promise<SimulationCampaignResource | null>>(
  async (get) => {
    const detail = await get(detailAtom);
    const { session } = get(sessionAndInfoAtom);
    const executionId = detail?.wasGeneratedBy?.['@id'];

    if (!executionId || !detail) return null;

    const [org, project] = detail._project.split('/').slice(-2);
    const cleanExecutionId = executionId.replace('https://bbp.epfl.ch/neurosciencegraph/data/', '');

    const execution = (await fetchResourceById(cleanExecutionId, session, {
      org,
      project,
      idExpand: false,
    })) as SimulationCampaignResource;

    return execution;
  }
);

// fetches the simulation campaign status
export const simulationCampaignStatusAtom = atom<Promise<string | undefined>>(async (get) => {
  const execution = await get(simulationCampaignExecutionAtom);

  return execution?.status;
});

export const simulationCampaignDimensionsAtom = selectAtom(
  detailAtom,
  (simCamp) => simCamp?.parameter?.coords
);

export const simulationsAtom = atom<Promise<Simulation[] | undefined>>(async (get) => {
  const execution = await get(simulationCampaignExecutionAtom);

  const { session } = get(sessionAndInfoAtom);

  const simulations =
    execution && (await fetchSimulationsFromEs(session.accessToken, execution.generated['@id']));

  return simulations?.hits.map(({ _source: simulation }: { _source: any }) => ({
    completedAt: simulation.endedAt,
    dimensions: simulation.parameter?.coords,
    id: simulation['@id'],
    project: simulation?.project.identifier, // TODO: Possibly no longer necessary
    startedAt: simulation.startedAt,
    status: simulation.status,
  }));
});

export const analysisReportsAtom = atom<
  Promise<
    {
      id: string;
      type: string;
      blob: Blob;
      name: string;
      description: string;
      simulation: string;
    }[]
  >
>(async (get) => {
  const { session } = get(sessionAndInfoAtom);
  const simulations = await get(simulationsAtom);

  const fetchedReports =
    session &&
    simulations &&
    (await fetchAnalysisReportsFromEs(
      session,
      simulations.map(({ id }) => id)
    ));

  return Promise.all(fetchedReports);
});

export const reportImageFilesAtom = atom(async (get) => {
  const detail = await get(detailAtom);
  const analysisReports = await get(analysisReportsAtom);
  const filteredReports = analysisReports?.filter(
    ({ simulation }: { simulation: string }) => simulation === detail?.['@id']
  );

  return filteredReports;
});

export const simulationsCountAtom = atom<Promise<number | undefined>>(async (get) => {
  const simulations = await get(simulationsAtom);

  return simulations?.length;
});
