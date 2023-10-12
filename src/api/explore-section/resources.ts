import esb, { Sort } from 'elastic-builder';
import { createHeaders } from '@/util/utils';
import { API_SEARCH } from '@/constants/explore-section/queries';
import { ExploreESResponse, FlattenedExploreESResponse } from '@/types/explore-section/es';
import { ExperimentDataTypeName } from '@/constants/explore-section/list-views';
import { BrainRegion } from '@/types/ontologies';

export type DataQuery = {
  size: number;
  sort?: Sort;
  from: number;
  track_total_hits: boolean;
  query: {};
};

export async function fetchEsResourcesByType(accessToken: string, dataQuery: DataQuery) {
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

export type ExperimentDatasetCountPerBrainRegion = {
  total: number;
  brainRegionId: string;
  experimentUrl: string;
};

export async function fetchExperimentDatasetCountForBrainRegion(
  accessToken: string,
  experimentUrl: ExperimentDataTypeName,
  brainRegionId: string,
  descendants: BrainRegion[]
) {
  if (!accessToken) throw new Error('Access token should be defined');

  const brainRegionKeywords = descendants.map(
    (descendant) => `http://api.brain-map.org/api/v2/data/Structure/${descendant.id}`
  );

  const esQuery = new esb.BoolQuery();
  esQuery.must(esb.termQuery('@type.keyword', experimentUrl));
  esQuery.must(esb.termQuery('deprecated', false));
  esQuery.must(esb.termsQuery('brainRegion.@id.keyword', brainRegionKeywords));

  return fetch(API_SEARCH, {
    method: 'POST',
    headers: createHeaders(accessToken),
    body: JSON.stringify({
      query: esQuery.toJSON(),
    }),
  })
    .then<ExploreESResponse>((response) => response.json())
    .then<ExperimentDatasetCountPerBrainRegion>((res) => ({
      total: res.hits.total.value,
      brainRegionId,
      experimentUrl,
    }))
    .catch(
      () => ({ total: 0, brainRegionId, experimentUrl } as ExperimentDatasetCountPerBrainRegion)
    );
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
