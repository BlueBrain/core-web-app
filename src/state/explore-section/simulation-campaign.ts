import { Atom, atom } from 'jotai';
import { atomFamily as atomFamily_, selectAtom } from 'jotai/utils';
import memoizeOne from 'memoize-one';
import { isEqual } from 'lodash/fp';
import sessionAtom from '../session';
import { DeltaResource, Simulation } from '@/types/explore-section/resources';
import { AnalysisReportWithImage } from '@/types/explore-section/es-analysis-report';
import { fetchFileByUrl, fetchResourceById } from '@/api/nexus';
import { fetchAnalysisReports, fetchSimulationsFromEs } from '@/api/explore-section/simulations';
import { detailFamily, sessionAndInfoFamily } from '@/state/explore-section/detail-view-atoms';
import { pathToResource } from '@/util/explore-section/detail-view';

/* Custom atomFamily constructor that automatically deletes atoms from the cache
after maxAgeSecs seconds to prevent memory leaks. 
https://jotai.org/docs/utilities/family#caveat-memory-leaks
*/
function atomFamily<Param, AtomType extends Atom<T>, T>(
  initializeAtom: (param: Param) => AtomType,
  areEqual?: (a: Param, b: Param) => boolean,
  maxAgeSecs = 60 * 5 // Atoms last for at most 5 minutes by default
) {
  const newFamily = atomFamily_(initializeAtom, areEqual);
  newFamily.setShouldRemove(
    (createdAt) => (Date.now() - createdAt) / 1000 > Math.max(1, maxAgeSecs)
  );
  return newFamily;
}

const ensuredSessionAtom = atom((get) => {
  const session = get(sessionAtom);
  if (!session) throw new Error('No valid session, please login');
  return session;
});

export const simCampaignExecutionFamily = atomFamily((path: string) =>
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

/* No need to use atomFmily as coords are already stored in the detail atom
so it would be just storing duplicate data
memoizeOne acts as an atomFamily with just one element
*/
export const simCampaignDimensionsFamily = memoizeOne((path: string) =>
  selectAtom(
    detailFamily(pathToResource(path)),
    // @ts-ignore TODO: Improve type
    (simCamp) => simCamp?.parameter?.coords
  )
);

export const simulationsFamily = atomFamily((path: string) =>
  atom(async (get) => {
    const session = get(ensuredSessionAtom);
    const execution = await get(simCampaignExecutionFamily(path));

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
// Wipe-out cache when user visits another path
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
  isEqual
);
