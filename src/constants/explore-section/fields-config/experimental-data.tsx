import License from '@/components/explore-section/License';
import {
  selectorFnBasic,
  selectorFnBrainRegion,
  selectorFnLayer,
  selectorFnLayerThickness,
  selectorFnMeanStd,
  selectorFnSpecies,
  selectorFnStatistic,
} from '@/state/explore-section/listing-selectors';
import {
  eTypeSelectorFn,
  mTypeSelectorFn,
  selectorFnStatisticDetail,
  semSelectorFn,
  subjectAgeSelectorFn,
} from '@/state/explore-section/selector-functions';
import Species from '@/components/explore-section/Species';
import WeightField from '@/components/explore-section/Fields/WeightField';

import LayerThicknessField from '@/components/explore-section/Fields/LayerThicknessField';

import MeanStdField from '@/components/explore-section/Fields/MeanStdField';
import { ExploreFieldsConfigProps } from '@/constants/explore-section/fields-config/types';

export const EXPERIMENTAL_DATA_FIELDS_CONFIG: ExploreFieldsConfigProps = {
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
