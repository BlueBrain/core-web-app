import { createHeaders } from '@/util/utils';
import { nexus } from '@/config';
import { EphysRaw } from '@/types/observatory';
import { to64 } from '@/util/common';

const API_SEARCH = `${nexus.url}/search/query`;

/**
 * This function returns the promise of fetching the results from elast search for the type Trace (electro physioology data)
 * @param accessToken
 * @param ephysQuery
 */
export default async function getEphysData(accessToken: string, ephysQuery: object) {
  if (!accessToken) throw new Error('Access token should be defined');

  return fetch(API_SEARCH, {
    method: 'POST',
    headers: createHeaders(accessToken),
    body: JSON.stringify(ephysQuery),
  })
    .then((response) => response.json())
    .then((ephysData) =>
      ephysData.hits.hits.map((item: EphysRaw) => ({
        key: to64(`${item._source.project.label}!/!${item._id}`),
        name: item._source.name,
        description: item._source.description,
        id: item._id,
        self: item._source._self,
        createdAt: item._source.createdAt,
        etype: item._source.eType?.label,
        mtype: item._source.mType?.label,
        brainRegion: Array.isArray(item._source.brainRegion.label)
          ? item._source.brainRegion.label.join(', ')
          : item._source.brainRegion.label,
        subjectSpecies: item._source.subjectSpecies.label,
        contributor: item._source.createdBy.split('/').pop(),
      }))
    );
}
