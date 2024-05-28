import esb, { Sort } from 'elastic-builder';
import { createHeaders } from '@/util/utils';
import { API_SEARCH } from '@/constants/explore-section/queries';
import {
  ExploreESHit,
  ExploreESResponse,
  FlattenedExploreESResponse,
} from '@/types/explore-section/es';
import { Experiment } from '@/types/explore-section/es-experiment';
import { ExploreSectionResource } from '@/types/explore-section/resources';

export type DataQuery = {
  size: number;
  sort?: Sort;
  from: number;
  track_total_hits: boolean;
  query: {};
};

export async function fetchESResourceByIds(
  accessToken: string,
  dataQuery: object,
  signal?: AbortSignal
): Promise<ExploreESHit<ExploreSectionResource>[]> {
  return fetch(API_SEARCH, {
    method: 'POST',
    headers: createHeaders(accessToken),
    body: JSON.stringify(dataQuery),
    signal,
  })
    .then<ExploreESResponse<Experiment>>((response) => response.json())
    .then<ExploreESHit<ExploreSectionResource>[]>((data) => data?.hits?.hits ?? []);
}

export async function fetchTotalByExperimentAndRegions(
  accessToken: string,
  dataQuery: DataQuery,
  signal?: AbortSignal
): Promise<number | undefined> {
  return fetch(API_SEARCH, {
    method: 'POST',
    headers: createHeaders(accessToken),
    body: JSON.stringify(dataQuery),
    signal,
  })
    .then<ExploreESResponse<Experiment>>((response) => response.json())
    .then((data) => data?.hits?.total?.value);
}

export async function fetchEsResourcesByType(
  accessToken: string,
  dataQuery: DataQuery,
  signal?: AbortSignal
): Promise<FlattenedExploreESResponse<Experiment>> {
  return fetch(API_SEARCH, {
    method: 'POST',
    headers: createHeaders(accessToken),
    body: JSON.stringify(dataQuery),
    signal,
  })
    .then<ExploreESResponse<Experiment>>((response) => response.json())
    .then<FlattenedExploreESResponse<Experiment>>((data) => ({
      hits: data?.hits?.hits,
      total: data?.hits?.total,
      aggs: data.aggregations,
    }));
}

export type ExperimentDatasetCountPerBrainRegion = {
  total: number;
  experimentUrl: string;
};

export type ArticleListingResponse = {
  items: {
    article_title: string;
    article_authors: string[];
    article_doi: string;
    article_id: string;
    abstract: string;
    journal_name?: string;
    cited_by?: number;
    date?: string;
  }[];
  page: number;
  pages: number;
  size: number;
  total: number;
};

export type ArticleItem = {
  title: string;
  doi: string;
  abstract: string;
  authors: string[];
  publicationDate?: string;
  journalName?: string;
  citationCount?: number;
};

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
    .then<ExploreESResponse<Experiment>>((response) => response.json())
    .then<FlattenedExploreESResponse<Experiment>>((data) => ({
      hits: data?.hits?.hits,
      total: data?.hits?.total,
      aggs: data.aggregations,
    }));
}
