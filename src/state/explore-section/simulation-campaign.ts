import { atom } from 'jotai';
import { atomFamily, selectAtom } from 'jotai/utils';
import { Simulation, SimulationCampaignResource } from '@/types/explore-section/resources';
import { AnalysisReportWithImage } from '@/types/explore-section/es-analysis-report';
import { fetchResourceById } from '@/api/nexus';
import {
  fetchAnalysisReportsFromEs,
  fetchSimulationsFromEs,
} from '@/api/explore-section/simulations';
import { detailFamily, sessionAndInfoFamily } from '@/state/explore-section/detail-view-atoms';
import { ResourceInfo } from '@/types/explore-section/application';

// fetches and stores the simulation campaign execution
const simulationCampaignExecutionAtom = atomFamily((resourceInfo?: ResourceInfo) =>
  atom<Promise<SimulationCampaignResource | null>>(async (get) => {
    const detail = await get(detailFamily(resourceInfo));
    const { session, info } = get(sessionAndInfoFamily(resourceInfo));

    const executionId = detail?.wasGeneratedBy?.['@id'];

    if (!executionId || !detail) return null;

    const cleanExecutionId = executionId.replace('https://bbp.epfl.ch/neurosciencegraph/data/', '');

    const execution = (await fetchResourceById(cleanExecutionId, session, {
      org: info.org,
      project: info.project,
      idExpand: false,
    })) as SimulationCampaignResource;

    return execution;
  })
);

// fetches the simulation campaign status
export const simulationCampaignStatusAtom = atomFamily((resourceInfo?: ResourceInfo) =>
  atom<Promise<string | undefined>>(async (get) => {
    const execution = await get(simulationCampaignExecutionAtom(resourceInfo));
    return execution?.status;
  })
);

export const simulationCampaignDimensionsAtom = (resourceInfo?: ResourceInfo) =>
  selectAtom(detailFamily(resourceInfo), (simCamp) => simCamp?.parameter?.coords);

export const simulationsAtom = atomFamily((resourceInfo?: ResourceInfo) =>
  atom<Promise<Simulation[] | undefined>>(async (get) => {
    const execution = await get(simulationCampaignExecutionAtom(resourceInfo));
    const { session } = get(sessionAndInfoFamily(resourceInfo));

    const simulations =
      execution && (await fetchSimulationsFromEs(session.accessToken, execution.generated['@id']));
    return simulations?.hits.map(({ _source: simulation }: { _source: any }) => ({
      title: simulation.name,
      completedAt: simulation.endedAt,
      dimensions: simulation.parameter?.coords,
      id: simulation['@id'],
      project: simulation?.project.identifier, // TODO: Possibly no longer necessary
      startedAt: simulation.startedAt,
      status: simulation.status,
    }));
  })
);

export const analysisReportsAtom = atomFamily((resourceInfo?: ResourceInfo) =>
  atom<Promise<AnalysisReportWithImage[] | undefined>>(async (get) => {
    const { session } = get(sessionAndInfoFamily(resourceInfo));
    const simulations = await get(simulationsAtom(resourceInfo));

    const fetchedReports =
      session &&
      simulations &&
      (await fetchAnalysisReportsFromEs(
        session,
        simulations.map(({ id: simId }) => simId)
      ));

    return fetchedReports && Promise.all(fetchedReports);
  })
);

export const reportImageFilesAtom = atomFamily((resourceInfo?: ResourceInfo) =>
  atom<Promise<AnalysisReportWithImage[] | undefined>>(async (get) => {
    const detail = await get(detailFamily(resourceInfo));
    const analysisReports = await get(analysisReportsAtom(resourceInfo));
    return analysisReports?.filter(
      ({ simulation }: { simulation: string }) => simulation === detail?.['@id']
    );
  })
);

export const simulationsCountAtom = atomFamily((resourceInfo?: ResourceInfo) =>
  selectAtom<Promise<Simulation[] | undefined>, number | undefined>(
    simulationsAtom(resourceInfo),
    (simulations) => simulations?.length
  )
);
