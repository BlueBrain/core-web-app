import { format, parseISO, isValid } from 'date-fns';
import { Source, ESResponseRaw } from '@/types/explore-section/resources';
import { NValueEntity } from '@/types/explore-section/fields';
import { ensureArray } from '@/util/nexus';
import { formatNumber } from '@/util/common';

/**
 * Selects and formats a brain region based on its format
 * @param {string} text - The text parameter.
 * @param {ESResponseRaw} record - The ESResponseRaw record.
 * @returns {string|undefined} - The selected and formatted value for brain region.
 */
export const selectorFnBrainRegion = (text: string, record: ESResponseRaw) => {
  if (!record._source.brainRegion) return undefined;

  if (Array.isArray(record._source.brainRegion?.label))
    return record._source.brainRegion?.label.join(', ');

  return record._source.brainRegion.label;
};

/**
 * Selects and formats contributors based on their format
 * @param {string} text - The text parameter.
 * @param {ESResponseRaw} record - The ESResponseRaw record.
 * @returns {string|undefined} - The selected and formatted value for contributors.
 */

export const selectorFnContributors = (text: string, record: ESResponseRaw) => {
  if (!record._source.contributors || record._source.contributors.length < 1) {
    return undefined;
  }
  return ensureArray(record._source.contributors)
    .map((c) => c.label)
    .join(', ');
};

/**
 * Selects and formats a statistic from the series array
 * @param {Source} source - The Source object.
 * @param {string} statistic - The statistic to serialize.
 * @returns {string} - The selected and formatted value for statistic value.
 */
export const selectorFnStatistic = (source: Source, statistic: string) => {
  if (!source) return '';
  const statValue = source.series?.find((s: any) => s.statistic === statistic)?.value;
  return statValue ? formatNumber(statValue) : '';
};

/**
 * Selects and formats the mean and standard deviation from the series array
 * @param {string} text - The text parameter.
 * @param {ESResponseRaw} record - The ESResponseRaw record.
 * @returns {string} - The selected and formatted value for mean and standard deviation.
 */

export const selectorFnMeanStd = (text: string, record: ESResponseRaw) => {
  const mean = selectorFnStatistic(record._source, 'mean');
  const std = selectorFnStatistic(record._source, 'standard deviation');
  return mean && std ? `${mean} ± ${std}` : '';
};

/**
 * Selects and formats layer thickness
 * @param {NValueEntity|undefined} layerThickness - The layer thickness object.
 * @returns {string} - The selected and formatted value for layer thickness.
 */

export const selectorFnLayerThickness = (layerThickness: NValueEntity | undefined) => {
  if (!layerThickness || !Number(layerThickness?.value)) return '';
  return formatNumber(Number(layerThickness?.value));
};

/**
 * Selects and formats layer
 * @param {string} text - The text parameter.
 * @param {ESResponseRaw} esResponseRaw - The ESResponseRaw record.
 * @returns {string} - The selected and formatted value for layer.
 */

export const selectorFnLayer = (text: string, esResponseRaw: ESResponseRaw) => {
  if (!esResponseRaw._source.layer) return '';
  return ensureArray(esResponseRaw._source.layer)
    .map((l) => l.label)
    .join(', ');
};

/**
 * Formats and selects a date
 * @param {string} date - The date to format.
 * @returns {string} - The formatted date.
 */
export const selectorFnDate = (date: string) =>
  isValid(parseISO(date)) ? format(parseISO(date), 'dd.MM.yyyy') : '';

/**
 * Renders the text value
 * @param {string} text - The text value to render.
 * @returns {string} - The rendered text value.
 */
export const selectorFnBasic = (text: string) => text;
