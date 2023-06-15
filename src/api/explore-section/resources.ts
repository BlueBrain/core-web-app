import { createHeaders } from '@/util/utils';
import { API_SEARCH } from '@/constants/explore-section';
import { ESResponseRaw, ExploreSectionResponse, Source } from '@/types/explore-section/resources';
import { ContributorsEntity, IdLabelEntity, NValueEntity } from '@/types/explore-section/fields';
import { to64, formatNumber } from '@/util/common';
import { ensureArray } from '@/util/nexus';

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
  return ensureArray(contributors)
    .map((c) => c.label)
    .join(', ');
};

/**
 * Serializes a statistic from the series array
 * @param source @param statistic
 */
const serializeStatistic = (source: Source, statistic: string) => {
  if (!source) return '';
  const statValue = source.series?.find((s: any) => s.statistic === statistic)?.value;
  return statValue ? formatNumber(statValue) : '';
};

/**
 * Serializes a mean and standard deviation from the series array
 * @param source
 */
const serializeMeanStd = (source: Source) => {
  const mean = serializeStatistic(source, 'mean');
  const std = serializeStatistic(source, 'standard deviation');
  return mean && std ? `${mean} ± ${std}` : '';
};

/**
 * Serializes layer thickness
 * @param layerThickness
 */
const serializeLayerThickness = (layerThickness: NValueEntity | undefined) => {
  if (!layerThickness || !Number(layerThickness?.value)) return '';
  return formatNumber(Number(layerThickness?.value));
};

/**
 * Serializes layer
 * @param layer
 */
const serializeLayer = (layer: IdLabelEntity[] | undefined) => {
  if (!layer) return '';
  return ensureArray(layer)
    .map((l) => l.label)
    .join(', ');
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
        neuronDensity: item._source.neuronDensity,
        boutonDensity: item._source.boutonDensity,
        meanstd: serializeMeanStd(item._source),
        numberOfCells: serializeStatistic(item._source, 'N'),
        sem: serializeStatistic(item._source, 'standard error of the mean'),
        brainRegion: serializeBrainRegion(item._source.brainRegion),
        subjectSpecies: item._source.subjectSpecies ? item._source.subjectSpecies.label : undefined,
        subjectAge: item._source.subjectAge?.label,
        layer: serializeLayer(item._source?.layer),
        layerThickness: serializeLayerThickness(item._source?.layerThickness),
        contributors: serializeContributors(item._source.contributors),
      })),
      total: data?.hits?.total,
      aggs: data.aggregations,
    }));
}
