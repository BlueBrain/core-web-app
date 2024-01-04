import License from '@/components/explore-section/License';
import {
  selectorFnBasic,
  selectorFnBrainRegion,
  selectorFnLayer,
  selectorFnLayerThickness,
  selectorFnMeanStd,
  selectorFnSpecies,
  selectorFnStatistic,
  selectorFnSynaptic,
} from '@/util/explore-section/listing-selectors';
import {
  eTypeSelectorFn,
  mTypeSelectorFn,
  selectorFnStatisticDetail,
  semSelectorFn,
  subjectAgeSelectorFn,
} from '@/util/explore-section/selector-functions';
import Species from '@/components/explore-section/Species';
import WeightField from '@/components/explore-section/Fields/WeightField';
import LayerThicknessField from '@/components/explore-section/Fields/LayerThicknessField';

import MeanStdField from '@/components/explore-section/Fields/MeanStdField';
import { ExploreFieldsConfigProps } from '@/constants/explore-section/fields-config/types';
import { SynapticPosition, SynapticType } from '@/types/explore-section/fields';

export const EXPERIMENTAL_DATA_FIELDS_CONFIG: ExploreFieldsConfigProps = {
  license: {
    title: 'License',
    filter: 'checkList',
    render: {
      deltaResourceViewFn: () => <License />,
    },
    vocabulary: {
      plural: 'Licenses',
      singular: 'License',
    },
  },
  brainRegion: {
    esTerms: {
      flat: {
        filter: 'brainRegion.label.keyword',
        aggregation: 'brainRegion',
        sort: 'brainRegion.label.keyword',
      },
    },
    title: 'Brain Region',
    filter: null,
    render: {
      esResourceViewFn: selectorFnBrainRegion,
      deltaResourceViewFn: (resource) => resource.brainLocation.brainRegion.label,
    },
    vocabulary: {
      plural: 'Brain Regions',
      singular: 'Brain Region',
    },
  },
  eType: {
    esTerms: {
      flat: {
        filter: 'eType.label.keyword',
        aggregation: 'eType',
        sort: 'eType.label.keyword',
      },
    },
    title: 'E-Type',
    filter: 'checkList',
    render: {
      esResourceViewFn: (_t, r) => selectorFnBasic(r._source?.eType?.label),
      deltaResourceViewFn: (resource) => eTypeSelectorFn(resource),
    },
    vocabulary: {
      plural: 'E-Types',
      singular: 'E-Type',
    },
  },
  mType: {
    esTerms: {
      flat: {
        filter: 'mType.label.keyword',
        aggregation: 'mType',
        sort: 'mType.label.keyword',
      },
    },
    title: 'M-Type',
    filter: 'checkList',
    render: {
      esResourceViewFn: (_t, r) => selectorFnBasic(r._source?.mType?.label),
      deltaResourceViewFn: (resource) => mTypeSelectorFn(resource),
    },
    vocabulary: {
      plural: 'M-Types',
      singular: 'M-Type',
    },
  },
  subjectSpecies: {
    esTerms: {
      flat: {
        filter: 'subjectSpecies.label.keyword',
        aggregation: 'subjectSpecies',
        sort: 'subjectSpecies.label.keyword',
      },
    },
    title: 'Species',
    filter: 'checkList',
    render: {
      esResourceViewFn: (_t, r) => selectorFnSpecies(r._source?.subjectSpecies),
      deltaResourceViewFn: () => <Species />,
    },
    vocabulary: {
      plural: 'Species',
      singular: 'Species',
    },
  },
  sem: {
    esTerms: {
      nested: {
        nestedPath: 'series',
        filterTerm: 'series.statistic.keyword',
        filterValue: 'standard error of the mean',
        aggregationName: 'standard error of the mean',
        aggregationField: 'series.value',
      },
    },
    unit: 'boutons/μm',
    title: 'SEM',
    description: 'Standard error of the mean',
    filter: 'valueRange',
    render: {
      esResourceViewFn: (_t, r) => selectorFnStatistic(r._source, 'standard error of the mean'),
      deltaResourceViewFn: (resource) => semSelectorFn(resource),
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
      esResourceViewFn: (_t, r) => selectorFnBasic(r._source?.weight),
      deltaResourceViewFn: (resource) => <WeightField detail={resource} />,
    },
    vocabulary: {
      plural: 'Values',
      singular: 'Value',
    },
  },
  subjectAge: {
    title: 'Age',
    filter: 'valueRange',
    esTerms: {
      flat: {
        filter: 'subjectAge.value',
        aggregation: 'subjectAge.value',
        sort: 'subjectAge.value.minValue',
      },
    },
    render: {
      esResourceViewFn: (_t, r) => selectorFnBasic(r._source?.subjectAge?.label),
      deltaResourceViewFn: (resource) => subjectAgeSelectorFn(resource),
    },
    vocabulary: {
      plural: 'Ages',
      singular: 'Age',
    },
  },
  neuronDensity: {
    esTerms: {
      nested: {
        nestedPath: 'series',
        filterTerm: 'series.statistic.keyword',
        filterValue: 'mean',
        aggregationName: 'mean',
        aggregationField: 'series.value',
      },
    },
    title: 'Density',
    filter: 'valueRange',
    unit: 'n/mm³',
    render: {
      esResourceViewFn: (_t, r) => selectorFnStatistic(r._source, 'mean'),
      deltaResourceViewFn: (resource) => selectorFnStatisticDetail(resource, 'mean', true),
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
      esResourceViewFn: selectorFnLayer,
      deltaResourceViewFn: (resource) => resource.brainLocation?.layer?.label,
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
      esResourceViewFn: selectorFnLayerThickness,
      deltaResourceViewFn: (resource) => <LayerThicknessField detail={resource} />,
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
      esResourceViewFn: (_t, r) => selectorFnBasic(r._source?.reference),
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
      esResourceViewFn: (_t, r) => selectorFnBasic(r._source?.conditions),
    },
    vocabulary: {
      plural: 'Conditions',
      singular: 'Condition',
    },
  },
  meanstd: {
    esTerms: {
      nested: {
        nestedPath: 'series',
        filterTerm: 'series.statistic.keyword',
        filterValue: 'mean',
        aggregationName: 'mean',
        aggregationField: 'series.value',
      },
    },
    unit: 'boutons/μm',
    title: 'Mean ± std',
    filter: 'valueRange',
    render: {
      esResourceViewFn: selectorFnMeanStd,
      deltaResourceViewFn: (resource) => <MeanStdField detail={resource} />,
    },
    vocabulary: {
      plural: 'Values',
      singular: 'Value',
    },
  },
  numberOfMeasurements: {
    esTerms: {
      nested: {
        nestedPath: 'series',
        filterTerm: 'series.statistic.keyword',
        filterValue: 'N',
        aggregationName: 'N',
        aggregationField: 'series.value',
      },
    },
    title: 'N° of Measurements',
    filter: 'valueRange',
    render: {
      esResourceViewFn: (_t, r) => selectorFnStatistic(r._source, 'N'),
      deltaResourceViewFn: (resource) => selectorFnStatisticDetail(resource, 'N'),
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
  },
  maximumLength: {
    title: 'maximum length',
    filter: null,
    vocabulary: {
      plural: 'maximum length',
      singular: 'maximum length',
    },
  },
  totalLength: {
    title: 'total length',
    filter: null,
    vocabulary: {
      plural: 'total length',
      singular: 'total length',
    },
  },
  dendriteStemming: {
    title: 'dendrites stemming from soma',
    filter: null,
    vocabulary: {
      plural: 'dendrites stemming from soma',
      singular: 'dendrite stemming from soma',
    },
  },
  axon: {
    title: 'axon',
    filter: null,
    vocabulary: {
      plural: 'axon',
      singular: 'axons',
    },
  },
  bifurcations: {
    title: 'bifurcations',
    filter: null,
    vocabulary: {
      plural: 'bifurcation',
      singular: 'bifurcations',
    },
  },
  preSynapticBrainRegion: {
    title: 'Brain Region [From]',
    render: {
      esResourceViewFn: (_text, r) =>
        selectorFnSynaptic(r._source, SynapticPosition.Pre, SynapticType.BrainRegion),
      deltaResourceViewFn: (resource) =>
        resource.synapticPathway?.preSynaptic.find((synapse) => synapse.about === 'nsg:BrainRegion')
          ?.label,
    },
    filter: 'checkList',
    esTerms: {
      nested: {
        nestedPath: 'preSynapticPathway',
        filterTerm: 'preSynapticPathway.about.keyword',
        filterValue: 'https://neuroshapes.org/BrainRegion',
        aggregationName: 'label',
        aggregationField: 'preSynapticPathway.label.keyword',
      },
    },
    vocabulary: {
      plural: 'Brain Region [From]',
      singular: 'Brain Region [From]',
    },
  },
  postSynapticBrainRegion: {
    title: 'Brain Region [To]',
    render: {
      esResourceViewFn: (_text, r) =>
        selectorFnSynaptic(r._source, SynapticPosition.Post, SynapticType.BrainRegion),
      deltaResourceViewFn: (resource) =>
        resource.synapticPathway?.postSynaptic.find(
          (synapse) => synapse.about === 'nsg:BrainRegion'
        )?.label,
    },
    filter: 'checkList',
    esTerms: {
      nested: {
        nestedPath: 'postSynapticPathway',
        filterTerm: 'postSynapticPathway.about.keyword',
        filterValue: 'https://neuroshapes.org/BrainRegion',
        aggregationName: 'label',
        aggregationField: 'postSynapticPathway.label.keyword',
      },
    },
    vocabulary: {
      plural: 'Brain Region [To]',
      singular: 'Brain Region [To]',
    },
  },
  preSynapticCellType: {
    title: 'Cell Type [From]',
    render: {
      esResourceViewFn: (_text, r) =>
        selectorFnSynaptic(r._source, SynapticPosition.Pre, SynapticType.CellType),
      deltaResourceViewFn: (resource) =>
        resource.synapticPathway?.preSynaptic.find((synapse) => synapse.about === 'BrainCell:Type')
          ?.label,
    },
    filter: 'checkList',
    esTerms: {
      nested: {
        nestedPath: 'preSynapticPathway',
        filterTerm: 'preSynapticPathway.about.keyword',
        filterValue: 'https://bbp.epfl.ch/ontologies/core/bmo/BrainCellType',
        aggregationName: 'label',
        aggregationField: 'preSynapticPathway.label.keyword',
      },
    },
    vocabulary: {
      plural: 'Cell Type [From]',
      singular: 'Cell Type [From]',
    },
  },
  postSynapticCellType: {
    title: 'Cell Type [To]',
    render: {
      esResourceViewFn: (_text, r) =>
        selectorFnSynaptic(r._source, SynapticPosition.Post, SynapticType.CellType),
      deltaResourceViewFn: (resource) =>
        resource.synapticPathway?.postSynaptic.find((synapse) => synapse.about === 'BrainCell:Type')
          ?.label,
    },
    filter: 'checkList',
    esTerms: {
      nested: {
        nestedPath: 'postSynapticPathway',
        filterTerm: 'postSynapticPathway.about.keyword',
        filterValue: 'https://bbp.epfl.ch/ontologies/core/bmo/BrainCellType',
        aggregationName: 'label',
        aggregationField: 'postSynapticPathway.label.keyword',
      },
    },
    vocabulary: {
      plural: 'Cell Type [To]',
      singular: 'Cell Type [To]',
    },
  },
};
