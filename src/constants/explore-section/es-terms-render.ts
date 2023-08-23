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
import { FilterType } from '@/components/Filter/types';
import { IndexColContent, ValueArray } from '@/components/ListTable';

type ListingConfigProps = {
  [key: string]: {
    term: string;
    nestedField?: NestedFieldConfig;
    title: string;
    description?: string;
    filter: FilterType;
    unit?: string;
    renderFn?: (value: any, record: any, index: number) => ReactNode | any;
    vocabulary: {
      plural: string;
      singular: string;
    };
  };
};

type NestedFieldConfig = {
  extendedField: string;
  field: string;
  nestField: string;
};

const LISTING_CONFIG: ListingConfigProps = {
  brainRegion: {
    term: 'brainRegion.label.keyword',
    title: 'Brain Region',
    filter: 'checkListInference',
    renderFn: selectorFnBrainRegion,
    vocabulary: {
      plural: 'Brain Regions',
      singular: 'Brain Region',
    },
  },
  eType: {
    term: 'eType.label.keyword',
    title: 'E-Type',
    filter: 'checkList',
    renderFn: (_t, r) => selectorFnBasic(r._source?.eType?.label),
    vocabulary: {
      plural: 'E-Types',
      singular: 'E-Type',
    },
  },
  mType: {
    term: 'mType.label.keyword',
    title: 'M-Type',
    filter: 'checkList',
    renderFn: (_t, r) => selectorFnBasic(r._source?.mType?.label),
    vocabulary: {
      plural: 'M-Types',
      singular: 'M-Type',
    },
  },
  name: {
    term: 'name.keyword',
    title: 'Name',
    filter: null,
    renderFn: (_t, r) => selectorFnBasic(r._source?.name),
    vocabulary: {
      plural: 'Names',
      singular: 'Name',
    },
  },
  simCampName: {
    term: 'name.keyword',
    title: 'Name',
    filter: null,
    renderFn: (_t, r) =>
      IndexColContent({
        id: r._source['@id'],
        project: r._source?.project.label,
        text: r._source?.name,
      }),
    vocabulary: {
      plural: 'Names',
      singular: 'Name',
    },
  },
  subjectSpecies: {
    term: 'subjectSpecies.label.keyword',
    title: 'Species',
    filter: 'checkList',
    renderFn: (_t, r) => selectorFnBasic(r._source?.subjectSpecies?.label),
    vocabulary: {
      plural: 'Species',
      singular: 'Species',
    },
  },
  sem: {
    term: 'series.statistic.standard error of the mean.keyword',
    nestedField: {
      extendedField: 'series.statistic.keyword',
      field: 'standard error of the mean',
      nestField: 'series',
    },
    unit: 'boutons/μm',
    title: 'SEM',
    description: 'Standard error of the mean',
    filter: 'valueRange',
    renderFn: (_t, r) => selectorFnStatistic(r._source, 'standard error of the mean'),
    vocabulary: {
      plural: 'Values',
      singular: 'Value',
    },
  },
  weight: {
    term: 'weight.label.keyword',
    title: 'Weight',
    filter: 'checkList',
    unit: 'gramms',
    renderFn: (_t, r) => selectorFnBasic(r._source?.weight),
    vocabulary: {
      plural: 'Values',
      singular: 'Value',
    },
  },
  subjectAge: {
    term: 'subjectAge.label.keyword',
    title: 'Age',
    filter: 'checkList',
    unit: 'days',
    renderFn: (_t, r) => selectorFnBasic(r._source?.subjectAge?.label),
    vocabulary: {
      plural: 'Ages',
      singular: 'Age',
    },
  },
  contributors: {
    term: 'contributors.label.keyword',
    title: 'Contributors',
    filter: 'checkList',
    renderFn: selectorFnContributors,
    vocabulary: {
      plural: 'Contributors',
      singular: 'Contributor',
    },
  },
  neuronDensity: {
    term: 'series.statistic.mean.keyword',
    nestedField: {
      extendedField: 'series.statistic.keyword',
      field: 'mean',
      nestField: 'series',
    },
    title: 'Density',
    filter: 'valueRange',
    unit: 'n/mm³',
    renderFn: (_t, r) => selectorFnStatistic(r._source, 'mean'),
    vocabulary: {
      plural: 'Densities',
      singular: 'Density',
    },
  },
  boutonDensity: {
    term: 'boutonDensity.label.keyword',
    title: 'Bouton density',
    filter: 'checkList',
    renderFn: (_t, r) => selectorFnBasic(r._source?.boutonDensity?.value),
    vocabulary: {
      plural: 'Bouton Densities',
      singular: 'Bouton Density',
    },
  },
  layer: {
    term: 'layer.label.keyword',
    title: 'Layer',
    filter: 'checkList',
    renderFn: selectorFnLayer,
    vocabulary: {
      plural: 'Layers',
      singular: 'Layer',
    },
  },
  layerThickness: {
    term: 'layerThickness.value',
    title: 'Thickness',
    filter: 'valueRange',
    unit: 'μm',
    renderFn: (_t, r) => selectorFnLayerThickness(r._source?.layerThickness),
    vocabulary: {
      plural: 'Thicknesses',
      singular: 'Thickness',
    },
  },
  circuitType: {
    term: 'circuitType.keyword',
    title: 'Circuit type',
    filter: 'checkList',
    vocabulary: {
      plural: 'Circuit Types',
      singular: 'Circuit Type',
    },
  },
  createdAt: {
    term: 'createdAt',
    title: 'Creation date',
    filter: 'dateRange',
    renderFn: (_t, r) => selectorFnDate(r._source?.createdAt),
    vocabulary: {
      plural: 'Dates',
      singular: 'Date',
    },
  },
  createdBy: {
    term: 'createdBy.keyword',
    title: 'Created by',
    filter: 'checkList',
    vocabulary: {
      plural: 'Users',
      singular: 'User',
    },
  },
  updatedAt: {
    term: 'updatedAt',
    title: 'Updated at',
    filter: 'dateRange',
    renderFn: (_t, r) => selectorFnDate(r._source?.updatedAt),
    vocabulary: {
      plural: 'Dates',
      singular: 'Date',
    },
  },
  reference: {
    term: 'reference.keyword',
    title: 'Reference',
    filter: 'checkList',
    renderFn: (_t, r) => selectorFnBasic(r._source?.reference),
    vocabulary: {
      plural: 'References',
      singular: 'Reference',
    },
  },
  conditions: {
    term: 'conditions.keyword',
    title: 'Conditions',
    filter: 'checkList',
    unit: 'Cº',
    renderFn: (_t, r) => selectorFnBasic(r._source?.conditions),
    vocabulary: {
      plural: 'Conditions',
      singular: 'Condition',
    },
  },
  meanstd: {
    term: 'series.statistic.mean.keyword',
    nestedField: {
      extendedField: 'series.statistic.keyword',
      field: 'mean',
      nestField: 'series',
    },
    unit: 'boutons/μm',
    title: 'Mean ± std',
    filter: 'valueRange',
    renderFn: selectorFnMeanStd,
    vocabulary: {
      plural: 'Values',
      singular: 'Value',
    },
  },
  numberOfMeasurements: {
    term: 'series.statistic.N.keyword',
    nestedField: {
      extendedField: 'series.statistic.keyword',
      field: 'N',
      nestField: 'series',
    },
    title: 'N° of Measurements',
    filter: 'valueRange',
    renderFn: (_t, r) => selectorFnStatistic(r._source, 'N'),
    vocabulary: {
      plural: 'Values',
      singular: 'Value',
    },
  },
  brainConfiguration: {
    term: 'nValue',
    title: 'Brain Configuration',
    filter: null,
    renderFn: (_t, r) => selectorFnStatistic(r._source, 'N'),
    vocabulary: {
      plural: 'Brain Configurations',
      singular: 'Brain Configuration',
    },
  },
  'parameter.coords.vpm_pct': {
    term: 'nValue',
    title: 'vpm_pct',
    filter: 'valueOrRange',
    renderFn: (_t, r) => selectorFnStatistic(r._source, 'N'),
    vocabulary: {
      plural: 'Values',
      singular: 'Value',
    },
  },
  'parameter.coords.extracellular_calcium': {
    term: 'nValue',
    title: 'extracellular_calcium',
    filter: 'valueOrRange',
    renderFn: (_t, r) => selectorFnStatistic(r._source, 'N'),
    vocabulary: {
      plural: 'Values',
      singular: 'Value',
    },
  },
  'parameter.coords.celsius': {
    term: 'nValue',
    title: 'celcius',
    filter: 'valueOrRange',
    renderFn: (_t, r) => selectorFnStatistic(r._source, 'N'),
    vocabulary: {
      plural: 'Values',
      singular: 'Value',
    },
  },
  'parameter.coords.seed': {
    term: 'parameter.coords.seed',
    title: 'Seed',
    unit: 'unit xxxx',
    filter: 'valueOrRange',
    renderFn: (_t, r) =>
      ValueArray({
        value: r._source?.parameter?.coords?.seed?.map((label: string) => label),
      }),
    vocabulary: {
      plural: 'Values',
      singular: 'Value',
    },
  },
  startedAt: {
    term: 'nValue',
    title: 'started at',
    filter: null,
    renderFn: (_t, r) => selectorFnStatistic(r._source, 'N'),
    vocabulary: {
      plural: 'Dates',
      singular: 'Date',
    },
  },
  categories: {
    term: 'categories',
    title: 'Category',
    filter: 'search',
    vocabulary: {
      plural: 'Categories',
      singular: 'Category',
    },
  },
  articleType: {
    term: 'articleType',
    title: 'Article type',
    filter: 'search',
    vocabulary: {
      plural: 'Article types',
      singular: 'Article type',
    },
  },
  journal: {
    term: 'journal',
    title: 'Journal',
    filter: 'search',
    vocabulary: {
      plural: 'Journals',
      singular: 'Journal',
    },
  },
  authors: {
    term: 'authors',
    title: 'Authors',
    filter: 'search',
    vocabulary: {
      plural: 'Authors',
      singular: 'Author',
    },
  },
  publicationDate: {
    term: 'publicationDate',
    title: 'Publication date',
    filter: 'dateRange',
    vocabulary: {
      plural: 'Publication dates',
      singular: 'Publication date',
    },
  },
};

export default LISTING_CONFIG;
