import esb from 'elastic-builder';
import { createHeaders } from '@/util/utils';
import { API_SEARCH } from '@/constants/explore-section/queries';
import { ExploreESResponse, FlattenedExploreESResponse } from '@/types/explore-section/es';

export async function fetchEsResourcesByType(accessToken: string, dataQuery: object) {
  if (!accessToken) throw new Error('Access token should be defined');

  return fetch(API_SEARCH, {
    method: 'POST',
    headers: createHeaders(accessToken),
    body: JSON.stringify(dataQuery),
  })
    .then<ExploreESResponse>((response) => response.json())
    .then<FlattenedExploreESResponse>((data) => ({
      hits: data?.hits?.hits,
      total: data?.hits?.total,
      aggs: data.aggregations,
    }));
}
// TODO: this function should be changed to use ES /_mappings
export async function fetchDimensionAggs(accessToken: string) {
  if (!accessToken) throw new Error('Access token should be defined');

  const query = esb
    .requestBodySearch()
    .query(
      esb
        .boolQuery()
        .must(esb.termQuery('@type.keyword', 'https://neuroshapes.org/SimulationCampaign'))
    )
    .size(1000);

  return fetch(API_SEARCH, {
    method: 'POST',
    headers: createHeaders(accessToken),
    body: JSON.stringify(query),
  })
    .then<ExploreESResponse>((response) => response.json())
    .then<FlattenedExploreESResponse>((data) => ({
      hits: data?.hits?.hits,
      total: data?.hits?.total,
      aggs: data.aggregations,
    }));
}
