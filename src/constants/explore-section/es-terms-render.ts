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
  selectorFnValueWithUnit,
} from '@/state/explore-section/listing-selectors';
import { FilterType } from '@/components/Filter/types';

type TermsRenderProps = {
  [key: string]: {
    term: string | string[];
    title: string;
    description?: string;
    filter: FilterType;
    unit?: string;
    renderFn?: (value: any, record: any, index: number) => ReactNode | any;
  };
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
    term: 'sem.label.keyword',
    title: 'Sem',
    description: 'Standard error of the mean',
    filter: 'checkList',
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
    title: 'Neuron Density',
    filter: 'valueRange',
    unit: 'neurons/mm³',
    renderFn: (t, r) => selectorFnValueWithUnit(r._source?.neuronDensity),
  },
  boutonDensity: {
    term: 'boutonDensity.label.keyword',
    title: 'Bouton Density',
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
    title: 'Circuit Type',
    filter: 'checkList',
  },
  createdAt: {
    term: 'createdAt',
    title: 'Creation Date',
    filter: 'dateRange',
    renderFn: (t, r) => selectorFnDate(r._source?.createdAt),
  },
  createdBy: {
    term: 'createdBy.keyword',
    title: 'Created By',
    filter: 'checkList',
  },
  updatedAt: {
    term: 'updatedAt',
    title: 'Updated At',
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
    renderFn: (t, r) => selectorFnBasic(r._source?.conditions),
  },
  meanstd: {
    term: 'mean.value',
    title: 'Mean ± Std',
    filter: 'valueRange',
    renderFn: selectorFnMeanStd,
  },
  numberOfCells: {
    term: 'nValue',
    title: 'N° Of Cells',
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
