import { createHeaders } from '@/util/utils';
import { API_SEARCH } from '@/constants/explore-section/queries';
import { ExploreSectionResponse } from '@/types/explore-section/resources';

export default async function fetchEsResourcesByType(accessToken: string, dataQuery: object) {
  if (!accessToken) throw new Error('Access token should be defined');

  return fetch(API_SEARCH, {
    method: 'POST',
    headers: createHeaders(accessToken),
    body: JSON.stringify(dataQuery),
  })
    .then((response) => response.json())
    .then<ExploreSectionResponse>((data) => ({
      hits: data?.hits?.hits,
      total: data?.hits?.total,
      aggs: data.aggregations,
    }));
}
