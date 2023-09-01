import { ReactNode } from 'react';
import { format, parseISO } from 'date-fns';
import {
  selectorFnLayerThickness,
  selectorFnBrainRegion,
  selectorFnContributors,
  selectorFnMeanStd,
  selectorFnLayer,
  selectorFnBasic,
  selectorFnDate,
  selectorFnStatistic,
  selectorFnSpecies,
} from '@/state/explore-section/listing-selectors';
import { FilterType } from '@/components/Filter/types';
import { IndexColContent, ValueArray } from '@/components/ListTable';
import { DeltaResource } from '@/types/explore-section/resources';
import {
  eTypeSelectorFn,
  mTypeSelectorFn,
  semSelectorFn,
  selectorFnStatisticDetail,
  subjectAgeSelectorFn,
  weightSelectorFn,
} from '@/state/explore-section/selector-functions';
import Species from '@/components/explore-section/Species';
import Contributors from '@/components/explore-section/Contributors';
import timeElapsedFromToday from '@/util/date';
import License from '@/components/explore-section/License';
import LayerThicknessField from '@/components/explore-section/Fields/LayerThicknessField';
import MeanStdField from '@/components/explore-section/Fields/MeanStdField';
import ListField from '@/components/explore-section/Fields/ListField';
import SimulationCampaignStatus from '@/components/explore-section/SimulationCampaignStatus';

export type ExploreFieldConfig = {
  term: string;
  nestedField?: NestedFieldConfig;
  title: string;
  description?: string;
  filter: FilterType;
  unit?: string;
  render?: {
    listingViewFn?: (value: any, record: any, index: number) => ReactNode | any;
    detailViewFn?: (resource: DeltaResource) => ReactNode | any;
  };
  vocabulary: {
    plural: string;
    singular: string;
  };
};

export type ExploreFieldsConfigProps = {
  [key: string]: ExploreFieldConfig;
};

type NestedFieldConfig = {
  extendedField: string;
  field: string;
  nestField: string;
};

const EXPLORE_FIELDS_CONFIG: ExploreFieldsConfigProps = {
  description: {
    term: 'description',
    title: 'Description',
    filter: 'checkList',
    render: {
      detailViewFn: (resource) => resource.description,
    },
    vocabulary: {
      plural: 'Descriptions',
      singular: 'Description',
    },
  },
  license: {
    term: 'license.keyword',
    title: 'License',
    filter: 'checkList',
    render: {
      detailViewFn: () => <License />,
    },
    vocabulary: {
      plural: 'Licenses',
      singular: 'License',
    },
  },
  brainRegion: {
    term: 'brainRegion.label.keyword',
    title: 'Brain Region',
    filter: 'checkListInference',
    render: {
      listingViewFn: selectorFnBrainRegion,
      detailViewFn: (resource) => resource.brainLocation.brainRegion.label,
    },
    vocabulary: {
      plural: 'Brain Regions',
      singular: 'Brain Region',
    },
  },
  eType: {
    term: 'eType.label.keyword',
    title: 'E-Type',
    filter: 'checkList',
    render: {
      listingViewFn: (_t, r) => selectorFnBasic(r._source?.eType?.label),
      detailViewFn: (resource) => eTypeSelectorFn(resource),
    },
    vocabulary: {
      plural: 'E-Types',
      singular: 'E-Type',
    },
  },
  mType: {
    term: 'mType.label.keyword',
    title: 'M-Type',
    filter: 'checkList',
    render: {
      listingViewFn: (_t, r) => selectorFnBasic(r._source?.mType?.label),
      detailViewFn: (resource) => mTypeSelectorFn(resource),
    },
    vocabulary: {
      plural: 'M-Types',
      singular: 'M-Type',
    },
  },
  name: {
    term: 'name.keyword',
    title: 'Name',
    filter: null,
    render: {
      listingViewFn: (_t, r) => selectorFnBasic(r._source?.name),
    },
    vocabulary: {
      plural: 'Names',
      singular: 'Name',
    },
  },
  simCampName: {
    term: 'name.keyword',
    title: 'Name',
    filter: null,
    render: {
      listingViewFn: (_t, r) =>
        IndexColContent({
          id: r._source['@id'],
          project: r._source?.project.label,
          text: r._source?.name,
        }),
    },
    vocabulary: {
      plural: 'Names',
      singular: 'Name',
    },
  },
  subjectSpecies: {
    term: 'subjectSpecies.label.keyword',
    title: 'Species',
    filter: 'checkList',
    render: {
      listingViewFn: (_t, r) => selectorFnSpecies(r._source?.subjectSpecies),
      detailViewFn: () => <Species />,
    },
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
    render: {
      listingViewFn: (_t, r) => selectorFnStatistic(r._source, 'standard error of the mean'),
      detailViewFn: (resource) => semSelectorFn(resource),
    },
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
    render: {
      listingViewFn: (_t, r) => selectorFnBasic(r._source?.weight),
      detailViewFn: (resource) => weightSelectorFn(resource),
    },
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
    render: {
      listingViewFn: (_t, r) => selectorFnBasic(r._source?.subjectAge?.label),
      detailViewFn: (resource) => subjectAgeSelectorFn(resource),
    },
    vocabulary: {
      plural: 'Ages',
      singular: 'Age',
    },
  },
  contributors: {
    term: 'contributors.label.keyword',
    title: 'Contributors',
    filter: 'checkList',
    render: {
      listingViewFn: selectorFnContributors,
      detailViewFn: () => <Contributors />,
    },
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
    render: {
      listingViewFn: (_t, r) => selectorFnStatistic(r._source, 'mean'),
      detailViewFn: (resource) => selectorFnStatisticDetail(resource, 'mean', true),
    },
    vocabulary: {
      plural: 'Densities',
      singular: 'Density',
    },
  },
  boutonDensity: {
    term: 'boutonDensity.label.keyword',
    title: 'Bouton density',
    filter: 'checkList',
    render: {
      listingViewFn: (_t, r) => selectorFnBasic(r._source?.boutonDensity?.value),
    },
    vocabulary: {
      plural: 'Bouton Densities',
      singular: 'Bouton Density',
    },
  },
  layer: {
    term: 'layer.label.keyword',
    title: 'Layer',
    filter: 'checkList',
    render: {
      listingViewFn: selectorFnLayer,
      detailViewFn: (resource) => resource.brainLocation?.layer?.label,
    },
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
    render: {
      listingViewFn: (_t, r) => selectorFnLayerThickness(r._source?.layerThickness),
      detailViewFn: (resource) => <LayerThicknessField detail={resource} />,
    },
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
    render: {
      listingViewFn: (_t, r) => selectorFnDate(r._source?.createdAt),
      detailViewFn: (resource) =>
        resource._createdAt && format(parseISO(resource._createdAt), 'dd.MM.yyyy'),
    },
    vocabulary: {
      plural: 'Dates',
      singular: 'Date',
    },
  },
  createdBy: {
    term: 'createdBy.keyword',
    title: 'Created by',
    filter: 'checkList',
    render: {
      detailViewFn: (resource) => resource?._createdBy,
    },
    vocabulary: {
      plural: 'Users',
      singular: 'User',
    },
  },
  updatedAt: {
    term: 'updatedAt',
    title: 'Updated at',
    filter: 'dateRange',
    render: {
      listingViewFn: (_t, r) => selectorFnDate(r._source?.updatedAt),
      detailViewFn: (resource) => resource._updatedAt && timeElapsedFromToday(resource?._updatedAt),
    },
    vocabulary: {
      plural: 'Dates',
      singular: 'Date',
    },
  },
  reference: {
    term: 'reference.keyword',
    title: 'Reference',
    filter: 'checkList',
    render: {
      listingViewFn: (_t, r) => selectorFnBasic(r._source?.reference),
    },
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
    render: {
      listingViewFn: (_t, r) => selectorFnBasic(r._source?.conditions),
    },
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
    render: {
      listingViewFn: selectorFnMeanStd,
      detailViewFn: (resource) => <MeanStdField detail={resource} />,
    },
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
    render: {
      listingViewFn: (_t, r) => selectorFnStatistic(r._source, 'N'),
      detailViewFn: (resource) => selectorFnStatisticDetail(resource, 'N'),
    },
    vocabulary: {
      plural: 'Values',
      singular: 'Value',
    },
  },
  brainConfiguration: {
    term: 'nValue',
    title: 'Brain Configuration',
    filter: null,
    render: {
      listingViewFn: (_t, r) => selectorFnStatistic(r._source, 'N'),
      detailViewFn: (resource) => resource?.brainConfiguration,
    },
    vocabulary: {
      plural: 'Brain Configurations',
      singular: 'Brain Configuration',
    },
  },
  dimensions: {
    term: 'dimensions',
    title: 'Dimensions',
    filter: 'checkList',
    render: {
      detailViewFn: (resource) => (
        <ListField
          items={
            resource.parameter?.coords &&
            Object.entries(resource.parameter?.coords).map(([k]) => ({ id: k, label: k }))
          }
        />
      ),
    },
    vocabulary: {
      plural: 'Dimensions',
      singular: 'Dimension',
    },
  },
  attributes: {
    term: 'attributes',
    title: 'Attributes',
    filter: 'checkList',
    render: {
      detailViewFn: (resource) => (
        <ListField
          items={
            resource.parameter?.attrs &&
            Object.entries(resource.parameter?.attrs).map(([k]) => ({ id: k, label: k }))
          }
        />
      ),
    },
    vocabulary: {
      plural: 'Attributes',
      singular: 'Attribute',
    },
  },
  simulationCampaignStatus: {
    term: 'status',
    title: 'Status',
    filter: 'checkList',
    render: {
      detailViewFn: () => <SimulationCampaignStatus />,
    },
    vocabulary: {
      plural: 'Status',
      singular: 'Status',
    },
  },
  simulationStatus: {
    term: 'status',
    title: 'Status',
    filter: 'checkList',
    render: {
      detailViewFn: (resource) => resource?.status,
    },
    vocabulary: {
      plural: 'Status',
      singular: 'Status',
    },
  },
  campaign: {
    term: 'campaign',
    title: 'Campaign',
    filter: 'checkList',
    render: {
      detailViewFn: (resource) => resource?.wasGeneratedBy?.['@id'],
    },
    vocabulary: {
      plural: 'Campaigns',
      singular: 'Campaign',
    },
  },
  tags: {
    term: 'tags',
    title: 'Tags',
    filter: 'checkList',
    render: {
      detailViewFn: () => undefined,
    },
    vocabulary: {
      plural: 'Tags',
      singular: 'Tag',
    },
  },
  'parameter.coords.vpm_pct': {
    term: 'nValue',
    title: 'vpm_pct',
    filter: 'valueOrRange',
    render: {
      listingViewFn: (_t, r) => selectorFnStatistic(r._source, 'N'),
    },
    vocabulary: {
      plural: 'Values',
      singular: 'Value',
    },
  },
  'parameter.coords.extracellular_calcium': {
    term: 'nValue',
    title: 'extracellular_calcium',
    filter: 'valueOrRange',
    render: {
      listingViewFn: (_t, r) => selectorFnStatistic(r._source, 'N'),
    },
    vocabulary: {
      plural: 'Values',
      singular: 'Value',
    },
  },
  'parameter.coords.celsius': {
    term: 'nValue',
    title: 'celcius',
    filter: 'valueOrRange',
    render: {
      listingViewFn: (_t, r) => selectorFnStatistic(r._source, 'N'),
    },
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
    render: {
      listingViewFn: (_t, r) =>
        ValueArray({
          value: r._source?.parameter?.coords?.seed?.map((label: string) => label),
        }),
    },
    vocabulary: {
      plural: 'Values',
      singular: 'Value',
    },
  },
  startedAt: {
    term: 'nValue',
    title: 'started at',
    filter: null,
    render: {
      detailViewFn: (resource) => resource && timeElapsedFromToday(resource.startedAtTime),
    },
    vocabulary: {
      plural: 'Dates',
      singular: 'Date',
    },
  },
  completedAt: {
    term: 'completedAt',
    title: 'completed at',
    filter: null,
    render: {
      detailViewFn: (resource) => resource && timeElapsedFromToday(resource.completedAt),
    },
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

export default EXPLORE_FIELDS_CONFIG;
