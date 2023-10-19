import { atom } from 'jotai';
import { atomFamily, selectAtom } from 'jotai/utils';
import sessionAtom from '../session';
import { Simulation, SimulationCampaignResource } from '@/types/explore-section/resources';
import { AnalysisReportWithImage } from '@/types/explore-section/es-analysis-report';
import { fetchFileByUrl, fetchResourceById } from '@/api/nexus';

import {
  fetchAnalysisReportsFromEs,
  fetchSimulationsFromEs,
} from '@/api/explore-section/simulations';
import { detailAtom, sessionAndInfoAtom } from '@/state/explore-section/detail-view-atoms';
import { ResourceInfo } from '@/types/explore-section/application';

// fetches and stores the simulation campaign execution
const simulationCampaignExecutionAtom = atomFamily((resourceInfo?: ResourceInfo) =>
  atom<Promise<SimulationCampaignResource | null>>(async (get) => {
    const detail = await get(detailAtom(resourceInfo));
    const { session, info } = get(sessionAndInfoAtom(resourceInfo));

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
  selectAtom(detailAtom(resourceInfo), (simCamp) => simCamp?.parameter?.coords);

export const simulationsAtom = atomFamily((resourceInfo?: ResourceInfo) =>
  atom<Promise<Simulation[] | undefined>>(async (get) => {
    const execution = await get(simulationCampaignExecutionAtom(resourceInfo));
    const { session } = get(sessionAndInfoAtom(resourceInfo));

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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const refetchReportCounterFamily = atomFamily((resourceInfo?: ResourceInfo) => atom(0));
const reportImageFamily = atomFamily((contentUrl: string | undefined) =>
  atom(async (get) => {
    const session = get(sessionAtom);
    if (!session || !contentUrl) return null;
    return await fetchFileByUrl(contentUrl, session).then((res) => res.blob());
  })
);

export const analysisReportsFamily = atomFamily((resourceInfo?: ResourceInfo) =>
  atom<Promise<AnalysisReportWithImage[] | undefined>>(async (get) => {
    const { session } = get(sessionAndInfoAtom(resourceInfo));
    const simulations = await get(simulationsAtom(resourceInfo));
    get(refetchReportCounterFamily(resourceInfo));

    const fetchedReports =
      session &&
      simulations &&
      (await fetchAnalysisReportsFromEs(
        session,
        simulations.map(({ id: simId }) => simId)
      ));

    const reportsWithImage = fetchedReports?.map(async (report) => ({
      ...report,
      blob: (await get(reportImageFamily(report.distribution?.[0].contentUrl))) as Blob,
      simulation: report.derivation.find(
        ({ '@type': type }) => type === 'https://neuroshapes.org/Simulation'
      )?.identifier,
    })) as AnalysisReportWithImage[] | undefined;

    return reportsWithImage && (await Promise.all(reportsWithImage));
  })
);

export const reportImageFilesAtom = atomFamily((resourceInfo?: ResourceInfo) =>
  atom<Promise<AnalysisReportWithImage[] | undefined>>(async (get) => {
    const detail = await get(detailAtom(resourceInfo));
    const analysisReports = await get(analysisReportsFamily(resourceInfo));
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
