import esb, { Sort } from 'elastic-builder';
import { API_SEARCH } from '@/constants/explore-section/queries';
import { ExploreESResponse, FlattenedExploreESResponse } from '@/types/explore-section/es';
import { Experiment } from '@/types/explore-section/es-experiment';
import { VirtualLabInfo } from '@/types/virtual-lab/common';
import authFetch from '@/authFetch';

export type DataQuery = {
  size: number;
  sort?: Sort;
  from: number;
  track_total_hits: boolean;
  query: {};
};

function buildSearchUrl(virtualLabInfo?: VirtualLabInfo) {
  return virtualLabInfo
    ? `${API_SEARCH}?addProject=${virtualLabInfo.virtualLabId}/${virtualLabInfo.projectId}`
    : API_SEARCH;
}

function createHeaders() {
  return {
    'Content-Type': 'application/json',
    Accept: '*/*',
  };
}

export async function fetchTotalByExperimentAndRegions(
  dataQuery: DataQuery,
  signal?: AbortSignal,
  virtualLabInfo?: VirtualLabInfo
): Promise<number | undefined> {
  return authFetch(buildSearchUrl(virtualLabInfo), {
    method: 'POST',
    headers: createHeaders(),
    body: JSON.stringify(dataQuery),
    signal,
  })
    .then<ExploreESResponse<Experiment>>((response) => response.json())
    .then((data) => data?.hits?.total?.value);
}

export async function fetchEsResourcesByType(
  dataQuery: DataQuery,
  signal?: AbortSignal,
  virtualLabInfo?: VirtualLabInfo
): Promise<FlattenedExploreESResponse<Experiment>> {
  return authFetch(buildSearchUrl(virtualLabInfo), {
    method: 'POST',
    headers: createHeaders(),
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
export async function fetchDimensionAggs(virtualLabInfo?: VirtualLabInfo) {
  const query = esb
    .requestBodySearch()
    .query(
      esb
        .boolQuery()
        .must(esb.termQuery('@type.keyword', 'https://neuroshapes.org/SimulationCampaign'))
    )
    .size(1000);

  return authFetch(buildSearchUrl(virtualLabInfo), {
    method: 'POST',
    headers: createHeaders(),
    body: JSON.stringify(query),
  })
    .then<ExploreESResponse<Experiment>>((response) => response.json())
    .then<FlattenedExploreESResponse<Experiment>>((data) => ({
      hits: data?.hits?.hits,
      total: data?.hits?.total,
      aggs: data.aggregations,
    }));
}
