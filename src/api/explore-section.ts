import { createHeaders } from '@/util/utils';
import { API_SEARCH } from '@/constants/explore-section';
import {
  ESResponseRaw,
  IdLabelEntity,
  ExploreSectionResponse,
  ContributorsEntity,
} from '@/types/explore-section';
import { to64 } from '@/util/common';

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

/**
 * Serializes a brain region based on its format
 * @param contributors
 */
const serializeContributors = (contributors: ContributorsEntity[] | null | undefined) => {
  if (!contributors || contributors.length < 1) {
    return undefined;
  }
  if (Array.isArray(contributors[0].label)) {
    return contributors[0].label.join(', ');
  }
  return contributors[0].label;
};

export default async function fetchEsResourcesByType(accessToken: string, dataQuery: object) {
  if (!accessToken) throw new Error('Access token should be defined');

  return fetch(API_SEARCH, {
    method: 'POST',
    headers: createHeaders(accessToken),
    body: JSON.stringify(dataQuery),
  })
    .then((response) => response.json())
    .then<ExploreSectionResponse>((data) => ({
      hits: data?.hits?.hits?.map((item: ESResponseRaw) => ({
        key: to64(`${item._source.project.label}!/!${item._id}`),
        name: item._source.name,
        weight: item._source.weight,
        ncells: item._source.ncells,
        sem: item._source.sem,
        description: item._source.description,
        id: item._id,
        self: item._source._self,
        createdAt: item._source.createdAt,
        reference: 'Data Unavailable',
        conditions: 'Data Unavailable',
        eType: item._source.eType?.label,
        mType: item._source.mType?.label,
        neuronDensity: item._source.neuronDensity,
        boutonDensity: item._source.boutonDensity,
        brainRegion: serializeBrainRegion(item._source.brainRegion),
        subjectSpecies: item._source.subjectSpecies ? item._source.subjectSpecies.label : undefined,
        subjectAge: item._source.subjectAge?.label,
        layerThickness: item._source.layerThickness?.value,
        contributors: serializeContributors(item._source.contributors),
      })),
      total: data?.hits?.total,
      aggs: data.aggregations,
    }));
}
