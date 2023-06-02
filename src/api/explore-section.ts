import { createHeaders } from '@/util/utils';
import { API_SEARCH, NO_DATA_STRING} from '@/constants/explore-section';
import {
  ESResponseRaw,
  IdLabelEntity,
  ExploreSectionResponse,
  ContributorsEntity,
  Series,
  Source
} from '@/types/explore-section';
import { to64, formatNumber } from '@/util/common';
import { ensureArray } from '@/util/nexus';

 /**
   * Serializes a series array based on its format and string targetting specific statistic
   * @param resource @param field
   */
 const serializeStatisticFields = (resource: Source, field: string): string | number => {
  if (!resource?.series) return NO_DATA_STRING;

  const found = ensureArray(resource?.series).find((el: Series) => el.statistic === field);

  return found ? formatNumber(found.value) : NO_DATA_STRING;
};


 /**
   * Serializes a series array based on its format and string targetting specific statistic
   * @param resource
   */
 const serializeNeuronDensity = (resource: Source): string | number => {
  if (!resource?.neuronDensity) return NO_DATA_STRING;

  const nd = resource.neuronDensity?.value as number;

  return nd ? formatNumber(nd) : NO_DATA_STRING;
};




 /**
   * Serializes a series array based on its format and string targetting specific statistic
   * @param series @param field
   */
 const serializeMeanStd = (resource: Source): string | number => {
  if (!resource?.series) return NO_DATA_STRING;

  const mean = ensureArray(resource?.series).find((el: Series) => el.statistic === 'mean');
  const std = ensureArray(resource?.series).find((el: Series) => el.statistic === 'standard deviation');

  return mean && std ? `${formatNumber(mean.value)} ± ${formatNumber(std.value)}` : NO_DATA_STRING;
};

/**
 * Serializes a layer based on its format
 * @param layer
 */
const serializeLayer = (layer: IdLabelEntity | undefined) => {
  if (!layer) {
    return undefined;
  }
  if (Array.isArray(layer)) {
    return layer.map(x=>(x.label)).join(',');
  }
  return layer.label;
};

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
        description: item._source.description,
        id: item._id,
        self: item._source._self,
        createdAt: item._source.createdAt,
        reference: item._source.reference,
        conditions: item._source.conditions,
        eType: item._source.eType?.label,
        mType: item._source.mType?.label,
        layer: serializeLayer(item._source.layer),
        neuronDensity: serializeNeuronDensity(item._source),
        boutonDensity: item._source.boutonDensity,
        numberOfCells: serializeStatisticFields(item._source,'N'),
        sem: serializeStatisticFields(item._source,'standard error of the mean'),
        standardDeviation: serializeStatisticFields(item._source,'standard deviation'),
        meanstd: serializeMeanStd(item._source),
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
