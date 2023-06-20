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
} from '@/state/explore-section/listing-selectors';

type TermsRenderProps = {
  [key: string]: {
    term: string | string[];
    title: string;
    description?: string;
    renderFn?: (value: any, record: any, index: number) => ReactNode | any;
  };
};
const LISTING_CONFIG: TermsRenderProps = {
  brainRegion: {
    term: 'brainRegion.label.keyword',
    title: 'BRAIN REGION',
    renderFn: selectorFnBrainRegion,
  },
  eType: {
    term: 'eType.label.keyword',
    title: 'E-TYPE',
    renderFn: (t, r) => selectorFnBasic(r._source?.eType?.label),
  },
  mType: {
    term: 'mType.label.keyword',
    title: 'M-TYPE',
    renderFn: (t, r) => selectorFnBasic(r._source?.mType?.label),
  },
  name: {
    term: 'name.keyword',
    title: 'NAME',
    renderFn: (t, r) => selectorFnBasic(r._source?.name),
  },
  subjectSpecies: {
    term: 'subjectSpecies.label.keyword',
    title: 'SPECIES',
    renderFn: (t, r) => selectorFnBasic(r._source?.subjectSpecies?.label),
  },
  sem: {
    term: 'sem.label.keyword',
    title: 'SEM',
    description: 'Standard error of the mean',
    renderFn: (t, r) => selectorFnStatistic(r._source, 'standard error of the mean'),
  },
  weight: {
    term: 'weight.label.keyword',
    title: 'WEIGHT',
    renderFn: (t, r) => selectorFnBasic(r._source?.weight),
  },
  subjectAge: {
    term: 'subjectAge.label.keyword',
    title: 'AGE',
    renderFn: (t, r) => selectorFnBasic(r._source?.subjectAge?.label),
  },
  contributors: {
    term: 'contributors.label.keyword',
    title: 'CONTRIBUTORS',
    renderFn: selectorFnContributors,
  },
  neuronDensity: {
    term: 'neuronDensity.label.keyword',
    title: 'NEURON DENSITY',
    renderFn: (t, r) => selectorFnBasic(r._source?.neuronDensity?.value),
  },
  boutonDensity: {
    term: 'boutonDensity.label.keyword',
    title: 'BOUTON DENSITY',
    renderFn: (t, r) => selectorFnBasic(r._source?.boutonDensity?.value),
  },
  layer: {
    term: 'layer.label.keyword',
    title: 'LAYER',
    renderFn: selectorFnLayer,
  },
  layerThickness: {
    term: 'layerThickness.label.keyword',
    title: 'THICKNESS (µM)',
    renderFn: selectorFnLayerThickness,
  },
  circuitType: {
    term: 'circuitType.keyword',
    title: 'CIRCUIT TYPE',
  },
  createdAt: {
    term: 'createdAt',
    title: 'CREATED ON',
    renderFn: (t, r) => selectorFnDate(r._source?.createdAt),
  },
  createdBy: {
    term: 'createdBy.keyword',
    title: 'CREATED BY',
  },
  updatedAt: {
    term: 'updatedAt',
    title: 'UPDATED AT',
    renderFn: (t, r) => selectorFnDate(r._source?.updatedAt),
  },
  reference: {
    term: 'reference.keyword',
    title: 'REFERENCE',
    renderFn: (t, r) => selectorFnBasic(r._source?.reference),
  },
  conditions: {
    term: 'conditions.keyword',
    title: 'CONDITIONS',
    renderFn: (t, r) => selectorFnBasic(r._source?.conditions),
  },
  meanstd: {
    term: 'createdAt',
    title: 'MEAN ± STD',
    renderFn: selectorFnMeanStd,
  },
  numberOfCells: {
    term: 'createdAt',
    title: 'N° Of CELLS',
    renderFn: (t, r) => selectorFnStatistic(r._source, 'N'),
  },
};

export default LISTING_CONFIG;
