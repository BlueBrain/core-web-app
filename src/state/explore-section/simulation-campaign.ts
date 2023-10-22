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
import { detailFamily, sessionAndInfoFamily } from '@/state/explore-section/detail-view-atoms';
import { pathToResource } from '@/util/explore-section/detail-view';

export function getResourceInfoFromPath() {
  const [path, params] = window.location.pathname.split('?');
  const rev = new URLSearchParams(params).get('rev');
  return pathToResource(path, rev);
}

// fetches and stores the simulation campaign execution
export const simulationCampaignExecutionAtom = atom<Promise<SimulationCampaignResource | null>>(
  async (get) => {
    const resourceInfo = getResourceInfoFromPath();
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
  }
);

export const simulationCampaignDimensionsAtom = selectAtom(
  detailFamily(getResourceInfoFromPath()),
  (simCamp) => simCamp?.parameter?.coords
);

export const simulationsAtom = atom<Promise<Simulation[] | undefined>>(async (get) => {
  const execution = await get(simulationCampaignExecutionAtom);
  const session = get(sessionAtom);
  if (!session) return;

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
});

export const refetchReportCounterAtom = atom(0);

// Caches report images so that they're not refetched again when refetching the reports
const reportImageFamily = atomFamily((contentUrl: string | undefined) =>
  atom(async (get) => {
    const session = get(sessionAtom);
    if (!session || !contentUrl) return null;
    return await fetchFileByUrl(contentUrl, session).then((res) => res.blob());
  })
);

export const analysisReportsAtom = atom<Promise<AnalysisReportWithImage[] | undefined>>(
  async (get) => {
    const session = get(sessionAtom);
    const simulations = await get(simulationsAtom);

    get(refetchReportCounterAtom);

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
  }
);
