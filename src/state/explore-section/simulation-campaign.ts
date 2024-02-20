import { Atom, atom } from 'jotai';
import { selectAtom } from 'jotai/utils';
import memoizeOne from 'memoize-one';
import sessionAtom from '../session';
import {
  Simulation,
  SimulationCampaign,
  SimulationCampaignExecution,
} from '@/types/explore-section/delta-simulation-campaigns';
import {
  Simulation as ESSimulation,
  FormattedSimulation,
} from '@/types/explore-section/es-simulation-campaign';
import { AnalysisReportWithImage } from '@/types/explore-section/es-analysis-report';
import { fetchFileByUrl, fetchResourceById } from '@/api/nexus';
import { fetchAnalysisReports, fetchSimulationsFromEs } from '@/api/explore-section/simulations';
import { detailFamily, sessionAndInfoFamily } from '@/state/explore-section/detail-view-atoms';
import { pathToResource } from '@/util/explore-section/detail-view';
import { memoize as atomFamily } from '@/util/utils';

const ensuredSessionAtom = atom((get) => {
  const session = get(sessionAtom);
  if (!session) throw new Error('No valid session, please login');
  return session;
});

export const simCampaignExecutionFamily = atomFamily((path: string) =>
  atom(async (get) => {
    const { session, info } = get(sessionAndInfoFamily(pathToResource(path)));
    const detail = (await get(detailFamily(info))) as Simulation;
    const executionId = detail?.wasGeneratedBy?.['@id'];

    if (!executionId || !detail) return null;

    const cleanExecutionId = executionId.replace('https://bbp.epfl.ch/neurosciencegraph/data/', '');

    const execution = await fetchResourceById<SimulationCampaignExecution>(
      cleanExecutionId,
      session,
      {
        org: info.org,
        project: info.project,
        idExpand: false,
      }
    );

    return execution;
  })
);

/* No need to use atomFamily as coords are already stored in the detail atom
so it would be just storing duplicate data
memoizeOne acts as an atomFamily with just one element
*/
export const simCampaignDimensionsFamily = memoizeOne((path: string) =>
  selectAtom(
    detailFamily(pathToResource(path)),
    (simCamp) => (simCamp as SimulationCampaign)?.parameter?.coords // TODO: Improve type
  )
);

export const simulationsFamily = atomFamily<
  string,
  Atom<Promise<FormattedSimulation[] | undefined>>
>((path: string) =>
  atom(async (get) => {
    const session = get(ensuredSessionAtom);
    const execution = await get(simCampaignExecutionFamily(path));

    const simulations =
      execution && (await fetchSimulationsFromEs(session.accessToken, execution.generated['@id']));
    return simulations?.hits.map<FormattedSimulation>(
      ({ _source: simulation }: { _source: ESSimulation }) => {
        return {
          title: simulation.name,
          completedAt: simulation.endedAt,
          dimensions: simulation.parameter.coords,
          id: simulation['@id'],
          project: simulation.project.identifier,
          startedAt: simulation.startedAt,
          status: simulation.status,
        };
      }
    );
  })
);

const reportImageFamily = atomFamily((contentUrl: string) =>
  atom(async (get) => {
    const session = get(ensuredSessionAtom);
    return await fetchFileByUrl(contentUrl, session).then((res) => res.blob());
  })
);

// Only fetch the reports corresponding to the selected simulation and name or by custom report id's
// If custom report ids are provided fetch them
// If name is provided fetch only the report by that name corresponding to the simId
// If no name and no ids are provide fetch all reports for the simulation (only for simulation detail page)
export const analysisReportsFamily = atomFamily(
  ({ simId, name, ids }: { simId: string; name?: string; ids?: string[] }) => {
    return atom(async (get) => {
      const session = get(ensuredSessionAtom);
      const fetchedReports = await fetchAnalysisReports(session, simId, name, ids);

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
    });
  },
  // Resolver for keys in the cache
  ({ simId, name, ids }) => {
    if (ids) return ids.join('_');
    if (name) return simId + name;
    return simId;
  }
);
