import { Atom, atom } from 'jotai';
import matches from 'lodash/matches';
import { composeUrl } from '@/util/nexus';
import { fetchFileByUrl } from '@/api/nexus';
import sessionAtom from '@/state/session';
import { DeltaResource } from '@/types/explore-section/resources';

const SHAPE = {
  '@type': 'DataDownload',
  encodingFormat: 'application/swc',
};

export default function createMorphologyDataAtom(
  resource: DeltaResource
): Atom<Promise<string> | null> {
  return atom((get) => {
    const session = get(sessionAtom);
    if (!session) return null;

    const distribution = Array.isArray(resource.distribution)
      ? resource.distribution
      : [resource.distribution];

    const traceDistro = distribution.find(matches(SHAPE));

    if (!traceDistro) {
      throw new Error(`No distribution found for resource ${resource['@id']}`);
    }

    const [projectLabel, orgLabel] = resource._project.split('/').reverse();
    const [id] = traceDistro.contentUrl.split('/').reverse();
    const url = composeUrl('file', decodeURIComponent(id), {
      org: orgLabel,
      project: projectLabel,
      idExpand: false,
    });
    return fetchFileByUrl(url, session)
      .then((resp) => resp.text())
      .then((fetchedData) => fetchedData);
  });
}
