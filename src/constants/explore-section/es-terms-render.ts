import { ReactNode } from 'react';
import {
  selectorFnLayerThickness,
  selectorFnBrainRegion,
  selectorFnContributors,
  selectorFnMeanStd,
  selectorFnLayer,
  selectorFnBasic,
  selectorFnDate,
  selectorFnStatistic,
  selectorFnValue,
} from '@/state/explore-section/listing-selectors';
import { FilterType } from '@/components/Filter/types';

type TermsRenderProps = {
  [key: string]: {
    term: string;
    nestedField?: NestedFieldConfig;
    title: string;
    description?: string;
    filter: FilterType;
    unit?: string;
    renderFn?: (value: any, record: any, index: number) => ReactNode | any;
  };
};

type NestedFieldConfig = {
  extendedField: string;
  field: string;
  nestField: string;
};

const LISTING_CONFIG: TermsRenderProps = {
  brainRegion: {
    term: 'brainRegion.label.keyword',
    title: 'Brain Region',
    filter: 'checkList',
    renderFn: selectorFnBrainRegion,
  },
  eType: {
    term: 'eType.label.keyword',
    title: 'E-Type',
    filter: 'checkList',
    renderFn: (t, r) => selectorFnBasic(r._source?.eType?.label),
  },
  mType: {
    term: 'mType.label.keyword',
    title: 'M-Type',
    filter: 'checkList',
    renderFn: (t, r) => selectorFnBasic(r._source?.mType?.label),
  },
  name: {
    term: 'name.keyword',
    title: 'Name',
    filter: null,
    renderFn: (t, r) => selectorFnBasic(r._source?.name),
  },
  subjectSpecies: {
    term: 'subjectSpecies.label.keyword',
    title: 'Species',
    filter: 'checkList',
    renderFn: (t, r) => selectorFnBasic(r._source?.subjectSpecies?.label),
  },
  sem: {
    term: 'series.statistic.standard error of the mean.keyword',
    nestedField: {
      extendedField: 'series.statistic.keyword',
      field: 'standard error of the mean',
      nestField: 'series',
    },
    title: 'SEM',
    description: 'Standard error of the mean',
    filter: 'valueRange',
    renderFn: (t, r) => selectorFnStatistic(r._source, 'standard error of the mean'),
  },
  weight: {
    term: 'weight.label.keyword',
    title: 'Weight',
    filter: 'checkList',
    renderFn: (t, r) => selectorFnBasic(r._source?.weight),
  },
  subjectAge: {
    term: 'subjectAge.label.keyword',
    title: 'Age',
    filter: 'checkList',
    renderFn: (t, r) => selectorFnBasic(r._source?.subjectAge?.label),
  },
  contributors: {
    term: 'contributors.label.keyword',
    title: 'Contributors',
    filter: 'checkList',
    renderFn: selectorFnContributors,
  },
  neuronDensity: {
    term: 'neuronDensity.value',
    title: 'Neuron density',
    filter: 'valueRange',
    unit: 'neurons/mm³',
    renderFn: (t, r) => selectorFnValue(r._source?.neuronDensity),
  },
  boutonDensity: {
    term: 'boutonDensity.label.keyword',
    title: 'Bouton density',
    filter: 'checkList',
    renderFn: (t, r) => selectorFnBasic(r._source?.boutonDensity?.value),
  },
  layer: {
    term: 'layer.label.keyword',
    title: 'Layer',
    filter: 'checkList',
    renderFn: selectorFnLayer,
  },
  layerThickness: {
    term: 'layerThickness.value',
    title: 'Thickness (µM)',
    filter: 'valueRange',
    renderFn: (t, r) => selectorFnLayerThickness(r._source?.layerThickness),
  },
  circuitType: {
    term: 'circuitType.keyword',
    title: 'Circuit type',
    filter: 'checkList',
  },
  createdAt: {
    term: 'createdAt',
    title: 'Creation date',
    filter: 'dateRange',
    renderFn: (t, r) => selectorFnDate(r._source?.createdAt),
  },
  createdBy: {
    term: 'createdBy.keyword',
    title: 'Created by',
    filter: 'checkList',
  },
  updatedAt: {
    term: 'updatedAt',
    title: 'Updated at',
    filter: 'dateRange',
    renderFn: (t, r) => selectorFnDate(r._source?.updatedAt),
  },
  reference: {
    term: 'reference.keyword',
    title: 'Reference',
    filter: 'checkList',
    renderFn: (t, r) => selectorFnBasic(r._source?.reference),
  },
  conditions: {
    term: 'conditions.keyword',
    title: 'Conditions',
    filter: 'checkList',
    unit: 'Cº',
    renderFn: (t, r) => selectorFnBasic(r._source?.conditions),
  },
  meanstd: {
    term: 'series.statistic.mean.keyword',
    nestedField: {
      extendedField: 'series.statistic.keyword',
      field: 'mean',
      nestField: 'series',
    },
    title: 'Mean ± std',
    filter: 'valueRange',
    renderFn: selectorFnMeanStd,
  },
  numberOfCells: {
    term: 'series.statistic.N.keyword',
    nestedField: {
      extendedField: 'series.statistic.keyword',
      field: 'N',
      nestField: 'series',
    },
    title: 'N° of cells',
    filter: 'valueRange',
    renderFn: (t, r) => selectorFnStatistic(r._source, 'N'),
  },
  brainConfiguration: {
    term: 'nValue',
    title: 'Brain Configuration',
    filter: null,
    renderFn: (t, r) => selectorFnStatistic(r._source, 'N'),
  },
  'coords.vpm_pct': {
    term: 'nValue',
    title: 'vpm_pct',
    filter: null,
    renderFn: (t, r) => selectorFnStatistic(r._source, 'N'),
  },
  'coords.extracellular_calcium': {
    term: 'nValue',
    title: 'extracellular_calcium',
    filter: null,
    renderFn: (t, r) => selectorFnStatistic(r._source, 'N'),
  },
  'coords.celsius': {
    term: 'nValue',
    title: 'celcius',
    filter: null,
    renderFn: (t, r) => selectorFnStatistic(r._source, 'N'),
  },
  startedAt: {
    term: 'nValue',
    title: 'started at',
    filter: null,
    renderFn: (t, r) => selectorFnStatistic(r._source, 'N'),
  },
};

export default LISTING_CONFIG;
