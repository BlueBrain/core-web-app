import { format, parseISO, isValid } from 'date-fns';
import { IdLabelEntity } from '@/types/explore-section/fields';
import { ensureArray } from '@/util/nexus';
import { formatNumber } from '@/util/common';
import { Experiment, ExperimentalLayerThickness, WithStatistic } from '@/types/explore-section/es';

type Record = { _source: Experiment };

/**
 * Selects and formats a brain region based on its format
 * @param {string} _text - The text parameter.
 * @param {Record} record - The record.
 * @returns {string|undefined} - The selected and formatted value for brain region.
 */
export const selectorFnBrainRegion = (_text: string, record: Record): string | undefined => {
  if (!record._source.brainRegion) return undefined;

  if (Array.isArray(record._source.brainRegion?.label))
    return record._source.brainRegion?.label.join(', ');

  return record._source.brainRegion.label;
};

/**
 * Selects and formats contributors based on their format
 * @param {string} _text
 * @param {Record} record
 * @returns {string|undefined} - The selected and formatted value for contributors.
 */
export const selectorFnContributors = (_text: string, record: Record): string | undefined => {
  if (!record._source.contributors || record._source.contributors.length < 1) {
    return undefined;
  }
  return ensureArray(record._source.contributors)
    .map((c) => c.label)
    .join(', ');
};

/**
 * Selects and formats a statistic from the series array
 * @param {WithStatistic} source - The Source object.
 * @param {string} statistic - The statistic to serialize.
 */
export const selectorFnStatistic = (source: WithStatistic, statistic: string) => {
  if (!source) return '';

  const statValue = source.series?.find((s: any) => s.statistic === statistic)?.value;

  return statValue ? formatNumber(statValue) : '';
};

/**
 * Selects and formats a MeanStd
 * @param {string} _text
 * @param {{ _source: WithStatistic }} record - The statistic to serialize.
 */
export const selectorFnMeanStd = (_text: string, record: { _source: WithStatistic }) => {
  const mean = selectorFnStatistic(record._source, 'mean');
  const std = selectorFnStatistic(record._source, 'standard deviation');
  if (mean && std) {
    return `${mean} ± ${std}`;
  }
  if (mean) {
    return mean;
  }
  return '';
};

/**
 * Selects and formats a LayerThickness
 * @param {string} _text
 * @param {{ _source: ExperimentalLayerThickness }} record
 */
export const selectorFnLayerThickness = (
  _text: string,
  record: { _source: ExperimentalLayerThickness }
) => {
  const layerThickness = record._source?.layerThickness;

  if (!layerThickness || !Number(layerThickness?.value)) return '';
  return formatNumber(Number(layerThickness?.value));
};

/**
 * Selects and formats a Layer
 * @param {string} _text
 * @param {{ _source: ExperimentalLayerThickness }} record
 */
export const selectorFnLayer = (_text: string, record: { _source: ExperimentalLayerThickness }) => {
  if (!record._source.layer) return '';
  return ensureArray(record._source.layer)
    .map((l) => l.label)
    .join(', ');
};

/**
 * Formats and selects a date
 * @param {string} date - The date to format.
 * @returns {string} - The formatted date.
 */
export const selectorFnDate = (date: string): string =>
  isValid(parseISO(date)) ? format(parseISO(date), 'dd.MM.yyyy') : '';

/**
 * Renders the text value
 * @param {string} text - The text value to render.
 * @returns {string} - The rendered text value.
 */
export const selectorFnBasic = (text: string): string => text;

export const selectorFnSpecies = (species?: IdLabelEntity | IdLabelEntity[]) => {
  if (species) {
    return ensureArray(species)
      .map((s) => s.label)
      .join(', ');
  }
  return undefined;
};
