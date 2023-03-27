import { createHeaders } from '@/util/utils';
import { nexus } from '@/config';
import {
  ESResponseRaw,
  EphysResponse,
  IdLabelEntity,
  MorphologyResponse,
} from '@/types/observatory';
import { to64 } from '@/util/common';

const API_SEARCH = `${nexus.url}/search/query`;

/**
 * Serializes a brain region based on its format
 * @param brainRegion
 */
const serializeBrainRegion = (brainRegion: IdLabelEntity | undefined) => {
  if (!brainRegion) {
    return undefined;
  }
  if (Array.isArray(brainRegion.label)) {
    return brainRegion.label.join(', ');
  }
  return brainRegion.label;
};

export async function getMorphologyData(accessToken: string, morphologyQuery: object) {
  if (!accessToken) throw new Error('Access token should be defined');

  return fetch(API_SEARCH, {
    method: 'POST',
    headers: createHeaders(accessToken),
    body: JSON.stringify(morphologyQuery),
  })
    .then((response) => response.json())
    .then<MorphologyResponse>((morphoData) => ({
      hits: morphoData?.hits?.hits?.map((item: ESResponseRaw) => ({
        key: to64(`${item._source.project.label}!/!${item._id}`),
        name: item._source.name,
        description: item._source.description,
        id: item._id,
        self: item._source._self,
        createdAt: item._source.createdAt,
        etype: item._source.eType?.label,
        mtype: item._source.mType?.label,
        brainRegion: serializeBrainRegion(item._source.brainRegion),
        subjectSpecies: item._source.subjectSpecies ? item._source.subjectSpecies.label : undefined,
        contributor: item._source.createdBy.split('/').pop(),
      })),
      aggs: morphoData.aggregations,
    }));
}

/**
 * This function returns the promise of fetching the results from elast search for the type Trace (electro physiology data)
 * @param accessToken
 * @param ephysQuery
 */
export async function getEphysData(accessToken: string, ephysQuery: object) {
  if (!accessToken) throw new Error('Access token should be defined');

  return fetch(API_SEARCH, {
    method: 'POST',
    headers: createHeaders(accessToken),
    body: JSON.stringify(ephysQuery),
  })
    .then((response) => response.json())
    .then<EphysResponse>((ephysData) => ({
      hits: ephysData?.hits?.hits?.map((item: ESResponseRaw) => ({
        key: to64(`${item._source.project.label}!/!${item._id}`),
        name: item._source.name,
        description: item._source.description,
        id: item._id,
        self: item._source._self,
        createdAt: item._source.createdAt,
        etype: item._source.eType?.label,
        mtype: item._source.mType?.label,
        brainRegion: serializeBrainRegion(item._source.brainRegion),
        subjectSpecies: item._source.subjectSpecies ? item._source.subjectSpecies.label : undefined,
        contributor: item._source.createdBy.split('/').pop(),
      })),
      aggs: ephysData.aggregations,
    }));
}
