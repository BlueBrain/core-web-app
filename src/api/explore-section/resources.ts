import esb from 'elastic-builder';
import flatMap from 'lodash/flatMap';
import map from 'lodash/map';
import { createHeaders } from '@/util/utils';
import { API_SEARCH } from '@/constants/explore-section/queries';
import { ExploreSectionResponse } from '@/types/explore-section/resources';

export async function fetchEsResourcesByType(accessToken: string, dataQuery: object) {
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

export async function fetchInferredResources (accessToken: string, inferenceResources?: object[]) {
  if (!accessToken) throw new Error('Access token should be defined');

  const inferenceResourceIds = flatMap(inferenceResources, 'results').map((res) => res.id);

  const query = esb
    .requestBodySearch()
    .query(esb.termsQuery('_id', inferenceResourceIds))
    .size(inferenceResourceIds.length);

  return fetch(API_SEARCH, {
    method: 'POST',
    headers: createHeaders(accessToken),
    body: JSON.stringify(query),
  })
    .then((response) => response.json())
    .then<ExploreSectionResponse>((data) => ({
      hits: map(data?.hits?.hits, hit=> ({...hit, inferred: true})),
      total: data?.hits?.total,
      aggs: data.aggregations,
      inferred: true,
    }));
};
