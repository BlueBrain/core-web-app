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
import { IndexColContent } from '@/components/ListTable';
import { DeltaResource } from '@/types/explore-section/resources';
import {
  eTypeSelectorFn,
  mTypeSelectorFn,
  semSelectorFn,
  selectorFnStatisticDetail,
  subjectAgeSelectorFn,
} from '@/state/explore-section/selector-functions';
import Species from '@/components/explore-section/Species';
import Contributors from '@/components/explore-section/Contributors';
import timeElapsedFromToday from '@/util/date';
import License from '@/components/explore-section/License';
import LayerThicknessField from '@/components/explore-section/Fields/LayerThicknessField';
import MeanStdField from '@/components/explore-section/Fields/MeanStdField';
import ListField from '@/components/explore-section/Fields/ListField';
import SimulationCampaignStatus from '@/components/explore-section/SimulationCampaignStatus';
import WeightField from '@/components/explore-section/Fields/WeightField';
import { Experiment } from '@/types/explore-section/es-experiment';

// TODO: Improve type
export type DetailViewFnArgs = DeltaResource<{
  brainConfiguration: {};
  parameter: { coords: { id: string; value: string }; attrs: { id: string; value: string } };
  status: string;
  startedAtTime: string;
  completedAt: string;
}>;

export type ExploreFieldConfig = {
  esTerms?: EsTermsConfig;
  title: string;
  description?: string;
  filter: FilterType;
  unit?: string;
  render?: {
    listingViewFn?: (value: any, record: any, index: number) => ReactNode | any;
    detailViewFn?: (resource: DetailViewFnArgs) => ReactNode | any;
    cardViewFn?: (resource: Experiment) => ReactNode | any;
  };
  vocabulary: {
    plural: string;
    singular: string;
  };
};

export type ExploreFieldsConfigProps = {
  [key: string]: ExploreFieldConfig;
};

type EsTermsConfig = {
  flat?: {
    filter?: string;
    aggregation?: string;
    sort?: string;
  };
  nested?: NestedFieldConfig;
};

type NestedFieldConfig = {
  extendedField: string;
  field: string;
  nestField: string;
};

const EXPLORE_FIELDS_CONFIG: ExploreFieldsConfigProps = {
  description: {
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
    esTerms: {
      flat: {
        filter: 'brainRegion.@id.keyword',
        aggregation: 'brainRegion',
        sort: 'brainRegion.label.keyword',
      },
    },
    title: 'Brain Region',
    filter: 'checkList',
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
    esTerms: {
      flat: {
        filter: 'eType.@id.keyword',
        aggregation: 'eType',
        sort: 'eType.label.keyword',
      },
    },
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
    esTerms: {
      flat: {
        filter: 'mType.@id.keyword',
        aggregation: 'mType',
        sort: 'mType.label.keyword',
      },
    },
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
    esTerms: {
      flat: {
        filter: 'name.keyword',
        sort: 'name.keyword',
      },
    },
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
    esTerms: {
      flat: {
        filter: 'name.keyword',
        sort: 'name.keyword',
      },
    },
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
    esTerms: {
      flat: {
        filter: 'subjectSpecies.@id.keyword',
        aggregation: 'subjectSpecies',
        sort: 'subjectSpecies.label.keyword',
      },
    },
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
    esTerms: {
      nested: {
        extendedField: 'series.statistic.keyword',
        field: 'standard error of the mean',
        nestField: 'series',
      },
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
    title: 'Weight',
    filter: 'checkList',
    unit: 'gramms',
    render: {
      listingViewFn: (_t, r) => selectorFnBasic(r._source?.weight),
      detailViewFn: (resource) => <WeightField detail={resource} />,
    },
    vocabulary: {
      plural: 'Values',
      singular: 'Value',
    },
  },
  subjectAge: {
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
    esTerms: {
      flat: {
        filter: 'contributors.@id.keyword',
        aggregation: 'contributors',
        sort: 'contributors.label.keyword',
      },
    },
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
    esTerms: {
      nested: {
        extendedField: 'series.statistic.keyword',
        field: 'mean',
        nestField: 'series',
      },
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
  layer: {
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
    esTerms: {
      flat: {
        filter: 'layerThickness.value',
        aggregation: 'layerThickness.value',
        sort: 'layerThickness.value',
      },
    },
    title: 'Thickness',
    filter: 'valueRange',
    unit: 'μm',
    render: {
      listingViewFn: selectorFnLayerThickness,
      detailViewFn: (resource) => <LayerThicknessField detail={resource} />,
    },
    vocabulary: {
      plural: 'Thicknesses',
      singular: 'Thickness',
    },
  },
  createdAt: {
    esTerms: {
      flat: {
        filter: 'createdAt',
        aggregation: 'createdAt',
        sort: 'createdAt',
      },
    },
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
    title: 'Created by',
    filter: 'checkList',
    render: {
      detailViewFn: (resource) => (
        <span className="capitalize">{resource?._createdBy.split('/').reverse()[0]}</span>
      ),
    },
    vocabulary: {
      plural: 'Users',
      singular: 'User',
    },
  },
  updatedAt: {
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
    esTerms: {
      nested: {
        extendedField: 'series.statistic.keyword',
        field: 'mean',
        nestField: 'series',
      },
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
    esTerms: {
      nested: {
        extendedField: 'series.statistic.keyword',
        field: 'N',
        nestField: 'series',
      },
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
    esTerms: {
      flat: {
        filter: 'nValue',
        sort: 'nValue',
      },
    },
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
  startedAt: {
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
    title: 'Category',
    filter: 'search',
    vocabulary: {
      plural: 'Categories',
      singular: 'Category',
    },
  },
  articleType: {
    title: 'Article type',
    filter: 'search',
    vocabulary: {
      plural: 'Article types',
      singular: 'Article type',
    },
  },
  journal: {
    title: 'Journal',
    filter: 'search',
    vocabulary: {
      plural: 'Journals',
      singular: 'Journal',
    },
  },
  authors: {
    title: 'Authors',
    filter: 'search',
    vocabulary: {
      plural: 'Authors',
      singular: 'Author',
    },
  },
  publicationDate: {
    title: 'Publication date',
    filter: 'dateRange',
    vocabulary: {
      plural: 'Publication dates',
      singular: 'Publication date',
    },
  },
  length: {
    title: 'length',
    filter: null,
    vocabulary: {
      plural: 'length',
      singular: 'length',
    },
    render: {
      cardViewFn: () => '-',
    },
  },
  maximumLength: {
    title: 'maximum length',
    filter: null,
    vocabulary: {
      plural: 'maximum length',
      singular: 'maximum length',
    },
    render: {
      cardViewFn: () => '-',
    },
  },
  totalLength: {
    title: 'total length',
    filter: null,
    vocabulary: {
      plural: 'total length',
      singular: 'total length',
    },
    render: {
      cardViewFn: () => '-',
    },
  },
  dendriteStemming: {
    title: 'dendrite stemming from soma',
    filter: null,
    vocabulary: {
      plural: 'dendrite stemming from soma',
      singular: 'dendrite stemmings from soma',
    },
    render: {
      cardViewFn: () => '-',
    },
  },
  axon: {
    title: 'axon',
    filter: null,
    vocabulary: {
      plural: 'axon',
      singular: 'axons',
    },
    render: {
      cardViewFn: () => '-',
    },
  },
  bifurcations: {
    title: 'bifurcations',
    filter: null,
    vocabulary: {
      plural: 'bifurcation',
      singular: 'bifurcations',
    },
    render: {
      cardViewFn: () => '-',
    },
  },
};

export default EXPLORE_FIELDS_CONFIG;
