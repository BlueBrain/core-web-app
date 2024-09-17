import getPath from 'lodash/get';
import esb, { Sort } from 'elastic-builder';
import { API_SEARCH } from '@/constants/explore-section/queries';
import {
  ExploreESHit,
  ExploreESResponse,
  ExploreResource,
  FlattenedExploreESResponse,
} from '@/types/explore-section/es';
import { Experiment } from '@/types/explore-section/es-experiment';
import { VirtualLabInfo } from '@/types/virtual-lab/common';
import { getOrgAndProjectFromProjectId } from '@/util/nexus';
import { fetchResourceById } from '@/api/nexus';
import { MEModelResource } from '@/types/me-model';
import { nexus } from '@/config';
import authFetch, { getSession } from '@/authFetch';
import { EModel, NeuronMorphology } from '@/types/e-model';

export type DataQuery = {
  size?: number;
  sort?: { [field: string]: 'asc' | 'desc' } | Sort;
  from?: number;
  track_total_hits?: boolean;
  query: {};
};

export function buildSearchUrl(virtualLabInfo?: VirtualLabInfo) {
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

export async function fetchEsResourcesByType<T extends ExploreResource>(
  dataQuery: DataQuery,
  signal?: AbortSignal,
  virtualLabInfo?: VirtualLabInfo
): Promise<FlattenedExploreESResponse<T>> {
  const res = await authFetch(buildSearchUrl(virtualLabInfo), {
    method: 'POST',
    headers: createHeaders(),
    body: JSON.stringify(dataQuery),
    signal,
  })
    .then<ExploreESResponse<T>>(async (response) => {
      return response.json();
    })
    .then<FlattenedExploreESResponse<T>>((data) => ({
      hits: data?.hits?.hits,
      total: data?.hits?.total,
      aggs: data.aggregations,
    }));

  return res;
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

/**
 * Fetches and attaches linked model data to each result based on the specified path.
 * Uses caching to optimize repeated fetches of the same linked model.
 *
 * @param {Object} params - The parameters object.
 * @param {Array<ExploreESHit<ExploreResource>>} params.results - Array of result objects.
 * @param {string} params.path - Path to extract the linked model ID from each result.
 * @param {string} params.linkedProperty - Property name to attach the linked model data.
 * @returns {Promise<Array<ExploreESHit<ExploreResource>>>} - The modified results with linked model data.
 */
export async function fetchLinkedModel({
  results,
  path,
  linkedProperty,
}: {
  path: string;
  linkedProperty: 'linkedMeModel' | 'linkedSynaptomeModel';
  results: ExploreESHit<ExploreResource>[];
}) {
  const session = await getSession();
  if (session) {
    const cache = new Map();
    const finalResult = [];
    for (const model of results) {
      const meModelId: string | null = getPath(model, path);
      if (meModelId) {
        if (cache.has(meModelId)) {
          finalResult.push({
            ...model,
            _source: {
              ...model._source,
              [linkedProperty]: cache.get(meModelId),
            },
          });
        } else {
          const { org, project } = getOrgAndProjectFromProjectId(model._source.project['@id']);
          const linkedModel = await fetchResourceById(meModelId, session, {
            ...(meModelId.startsWith(nexus.defaultIdBaseUrl)
              ? {}
              : {
                  org,
                  project,
                }),
          });
          let linkedMModel: NeuronMorphology | undefined;
          let linkedEModel: EModel | undefined;

          if (linkedProperty === 'linkedMeModel') {
            ({ linkedMModel, linkedEModel } = await fetchLinkedMandEModels({
              org,
              project,
              meModel: linkedModel as MEModelResource,
            }));
          }

          cache.set(meModelId, linkedModel);
          finalResult.push({
            ...model,
            _source: {
              ...model._source,
              [linkedProperty]: linkedModel,
              ...(linkedProperty === 'linkedMeModel'
                ? {
                    linkedMModel,
                    linkedEModel,
                  }
                : {}),
            },
          });
        }
      } else {
        finalResult.push(model);
      }
    }

    cache.clear();
    return finalResult;
  }
  return results;
}

export async function fetchLinkedMandEModels({
  org,
  project,
  meModel,
}: {
  org: string;
  project: string;
  meModel: MEModelResource;
}) {
  const session = await getSession();
  if (!session)
    return {
      linkedMModel: undefined,
      linkedEModel: undefined,
    };

  const mModelId = meModel?.hasPart.find((p) => p['@type'] === 'NeuronMorphology')?.['@id']!;
  const linkedMModel = await fetchResourceById<NeuronMorphology>(mModelId, session, {
    ...(mModelId.startsWith(nexus.defaultIdBaseUrl)
      ? {}
      : {
          org,
          project,
        }),
  });
  const eModelId = meModel?.hasPart.find((p) => p['@type'] === 'EModel')?.['@id']!;
  const linkedEModel = await fetchResourceById<EModel>(eModelId, session, {
    ...(eModelId.startsWith(nexus.defaultIdBaseUrl)
      ? {}
      : {
          org,
          project,
        }),
  });

  return {
    linkedMModel,
    linkedEModel,
  };
}
