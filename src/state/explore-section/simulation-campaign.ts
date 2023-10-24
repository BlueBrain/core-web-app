import { atom } from 'jotai';
import { atomFamily, selectAtom } from 'jotai/utils';
import memoizeOne from 'memoize-one';
import sessionAtom from '../session';
import { DeltaResource, Simulation } from '@/types/explore-section/resources';
import { AnalysisReportWithImage } from '@/types/explore-section/es-analysis-report';
import { fetchFileByUrl, fetchResourceById } from '@/api/nexus';
import {
  fetchAnalysisReportsFromEs,
  fetchSimulationsFromEs,
} from '@/api/explore-section/simulations';
import { detailFamily, sessionAndInfoFamily } from '@/state/explore-section/detail-view-atoms';
import { pathToResource } from '@/util/explore-section/detail-view';

const ensuredSessionAtom = atom((get) => {
  const session = get(sessionAtom);
  if (!session) throw new Error('No valid session, please login');
  return session;
});

export const getSimCapaignExecutionAtom = memoizeOne((path: string) =>
  atom(async (get) => {
    const { session, info } = get(sessionAndInfoFamily(pathToResource(path)));
    const detail = await get(detailFamily(info));
    const executionId = detail?.wasGeneratedBy?.['@id'];

    if (!executionId || !detail) return null;

    const cleanExecutionId = executionId.replace('https://bbp.epfl.ch/neurosciencegraph/data/', '');

    const execution = await fetchResourceById<
      DeltaResource<
        { generated: { '@id': string; type: 'SimulationCampaign' } } & {
          status: string;
        }
      >
    >(cleanExecutionId, session, {
      org: info.org,
      project: info.project,
      idExpand: false,
    });

    return execution;
  })
);

export const getSimCampaignDimensionsAtom = memoizeOne((path: string) =>
  selectAtom(
    detailFamily(pathToResource(path)),
    // @ts-ignore TODO: Improve type
    (simCamp) => simCamp?.parameter?.coords
  )
);

export const getSimulationsAtom = memoizeOne((path: string) =>
  atom(async (get) => {
    const session = get(ensuredSessionAtom);
    const execution = await get(getSimCapaignExecutionAtom(path));

    const simulations =
      execution && (await fetchSimulationsFromEs(session.accessToken, execution.generated['@id']));
    return simulations?.hits.map(({ _source: simulation }) => ({
      title: simulation.name,
      completedAt: simulation.endedAt,
      dimensions: simulation.parameter?.coords,
      id: simulation['@id'],
      project: simulation?.project.identifier, // TODO: Possibly no longer necessary
      startedAt: simulation.startedAt,
      status: simulation.status,
    })) as Simulation[] | undefined;
  })
);

// Caches report images so that they're not refetched again when refetching the reports
const reportImageFamily = atomFamily((contentUrl: string) =>
  atom(async (get) => {
    const session = get(ensuredSessionAtom);
    return await fetchFileByUrl(contentUrl, session).then((res) => res.blob());
  })
);

export const getAnalysisReportsAtom = memoizeOne((path: string) =>
  atom(async (get) => {
    const session = get(ensuredSessionAtom);
    const simulations = await get(getSimulationsAtom(path));

    const fetchedReports =
      session &&
      simulations &&
      (await fetchAnalysisReportsFromEs(
        session,
        simulations.map(({ id: simId }) => simId)
      ));

    const reportsWithImage = fetchedReports?.map(async (report) => {
      const imageUrl: string | undefined = report.distribution?.[0].contentUrl;
      const blob = imageUrl ? await get(reportImageFamily(imageUrl)) : undefined;
      return {
        ...report,
        blob,
        simulation: report.derivation.find(
          ({ '@type': type }) => type === 'https://neuroshapes.org/Simulation'
        )?.identifier,
      } as AnalysisReportWithImage;
    });

    return reportsWithImage && (await Promise.all(reportsWithImage));
  })
);
