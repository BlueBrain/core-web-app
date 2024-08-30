import { format, parseISO, isValid } from 'date-fns';
import map from 'lodash/map';
import isMatch from 'lodash/isMatch';
import isNumber from 'lodash/isNumber';
import { Unionize } from '../typing';
import { normalizeContributors } from './sort-contributors';
import { SynapticPosition, SynapticType } from '@/types/explore-section/misc';
import { IdWithLabel } from '@/types/explore-section/common';
import { ensureArray } from '@/util/nexus';
import { formatNumber } from '@/util/common';
import {
  Experiment,
  ExperimentalLayerThickness,
  ExperimentalSynapsesPerConnection,
  ExperimentalTrace,
  NeuronMorphologyFeatureAnnotation,
  ReconstructedNeuronMorphology,
} from '@/types/explore-section/es-experiment';
import { DisplayMessages } from '@/constants/display-messages';
import { formatEsContributors } from '@/components/explore-section/Contributors';
import { Contributor } from '@/types/explore-section/es-properties';

type Record = { _source: Experiment };
type ContributorEsProperty = Unionize<Contributor>;

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
  const { contributors } = record._source;

  if (!contributors || contributors.length < 1) {
    return undefined;
  }

  return map(
    normalizeContributors<ContributorEsProperty>(contributors, formatEsContributors),
    'label'
  ).join(', ');
};

/**
 * Selects and formats a statistic from the series array
 * @param {Exclude<Experiment, ExperimentalTrace | ReconstructedNeuronMorphology>} source - The Source object.
 * @param {string} statistic - The statistic to serialize.
 */
export const selectorFnStatistic = (
  source: Exclude<
    Experiment,
    ExperimentalTrace | ReconstructedNeuronMorphology | NeuronMorphologyFeatureAnnotation
  >,
  statistic: string
) => {
  if (!source) return '';
  const statValue = source.series?.find((s: any) => s.statistic === statistic)?.value;
  return statValue ? formatNumber(statValue) : '';
};

/**
 * Selects and formats a MeanStd
 * @param {string} _text
 * @param {{ _source: Exclude<Experiment, ExperimentalTrace | ReconstructedNeuronMorphology> }} record - The statistic to serialize.
 */
export const selectorFnMeanStd = (
  _text: string,
  record: {
    _source: Exclude<
      Experiment,
      ExperimentalTrace | ReconstructedNeuronMorphology | NeuronMorphologyFeatureAnnotation
    >;
  }
) => {
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
export const selectorFnBasic = (text?: string): string => text || DisplayMessages.NO_DATA_STRING;

export const selectorFnSpecies = (species?: IdWithLabel | IdWithLabel[]) => {
  if (species) {
    return ensureArray(species)
      .map((s) => s.label)
      .join(', ');
  }
  return undefined;
};

export const selectorFnSynaptic = (
  source: ExperimentalSynapsesPerConnection,
  preOrPost: SynapticPosition,
  type: SynapticType
) => {
  const synapticList =
    preOrPost === SynapticPosition.Pre ? source.preSynapticPathway : source.postSynapticPathway;
  const preSynaptic = synapticList.find((synaptic) => synaptic.about === type);
  return preSynaptic?.label ?? DisplayMessages.NO_DATA_STRING;
};

/**
 * Selects and formats a statistic from the series array
 * @param { ReconstructedNeuronMorphology } source
 * @param {string} compartment - The compartment to serialize.
 * @param {string} label - The label to serialize.
 * @param {string} statistic - The statistic of to serialize.
 */
export const selectorFnMorphologyFeature = (
  source: ReconstructedNeuronMorphology,
  compartment: string,
  label: string,
  statistic: string,
  showUnits?: boolean
) => {
  if (!source || !source.featureSeries) return DisplayMessages.NO_DATA_STRING;

  const feature = source.featureSeries.find((s) => isMatch(s, { compartment, label, statistic }));

  if (feature && isNumber(feature?.value) && feature?.value !== 0) {
    let { value } = feature;
    const unit = showUnits ? ` ${feature.unit}` : '';

    if (label === 'Soma Radius') value = 2 * feature.value;

    return `${formatNumber(value)}${unit}`;
  }

  return DisplayMessages.NO_DATA_STRING;
};

export const selectorFnCreatedBy = (str: string) => {
  return str.split('/').at(-1) ?? DisplayMessages.NO_DATA_STRING;
};
