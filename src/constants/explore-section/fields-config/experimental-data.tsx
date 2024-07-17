import License from '@/components/explore-section/License';
import {
  selectorFnBasic,
  selectorFnBrainRegion,
  selectorFnLayer,
  selectorFnLayerThickness,
  selectorFnMeanStd,
  selectorFnMorphologyFeature,
  selectorFnSpecies,
  selectorFnStatistic,
  selectorFnSynaptic,
} from '@/util/explore-section/listing-selectors';
import {
  eTypeSelectorFn,
  mTypeSelectorFn,
  selectorFnStatisticDetail,
  semSelectorFn,
} from '@/util/explore-section/selector-functions';
import Species from '@/components/explore-section/Species';
import WeightField from '@/components/explore-section/Fields/WeightField';
import SubjectAgeField from '@/components/explore-section/Fields/SubjectAgeField';
import LayerThicknessField from '@/components/explore-section/Fields/LayerThicknessField';
import MeanStdField from '@/components/explore-section/Fields/MeanStdField';
import {
  ExploreFieldsConfigProps,
  FieldType,
} from '@/constants/explore-section/fields-config/types';
import { MorphoMetricCompartment } from '@/types/explore-section/es-experiment';
import {
  ExperimentalBoutonDensity,
  ExperimentalLayerThickness,
  ExperimentalNeuronDensity,
  ExperimentalSynapsesPerConnection,
  ExperimentalTrace,
  Experiment as DeltaExperiment,
} from '@/types/explore-section/delta-experiment';
import { SynapticPosition, SynapticType } from '@/types/explore-section/misc';
import { FilterTypeEnum } from '@/types/explore-section/filters';
import { Field } from '@/constants/explore-section/fields-config/enums';

export const EXPERIMENTAL_DATA_FIELDS_CONFIG: ExploreFieldsConfigProps<DeltaExperiment> = {
  [Field.License]: {
    title: 'License',
    filter: FilterTypeEnum.CheckList,
    render: {
      deltaResourceViewFn: () => <License />,
    },
    vocabulary: {
      plural: 'Licenses',
      singular: 'License',
    },
  },
  [Field.BrainRegion]: {
    esTerms: {
      flat: {
        filter: 'brainRegion.label.keyword',
        aggregation: 'brainRegion.label.keyword',
        sort: 'brainRegion.label.keyword',
      },
    },
    title: 'Brain Region',
    filter: null,
    render: {
      esResourceViewFn: selectorFnBrainRegion,
      deltaResourceViewFn: (r) => selectorFnBasic(r.brainLocation?.brainRegion.label),
    },
    vocabulary: {
      plural: 'Brain Regions',
      singular: 'Brain Region',
    },
  },
  [Field.EType]: {
    fieldType: FieldType.CellType,
    esTerms: {
      flat: {
        filter: 'eType.label.keyword',
        aggregation: 'eType.label.keyword',
        sort: 'eType.label.keyword',
      },
    },
    title: 'E-Type',
    filter: FilterTypeEnum.CheckList,
    render: {
      esResourceViewFn: (_t, r) => selectorFnBasic(r._source?.eType?.label),
      deltaResourceViewFn: (resource) =>
        eTypeSelectorFn(
          resource as ExperimentalBoutonDensity | ExperimentalNeuronDensity | ExperimentalTrace
        ),
    },
    vocabulary: {
      plural: 'E-Types',
      singular: 'E-Type',
    },
  },
  [Field.MType]: {
    fieldType: FieldType.CellType,
    esTerms: {
      flat: {
        filter: 'mType.label.keyword',
        aggregation: 'mType.label.keyword',
        sort: 'mType.label.keyword',
      },
    },
    title: 'M-Type',
    filter: FilterTypeEnum.CheckList,
    render: {
      esResourceViewFn: (_t, r) => selectorFnBasic(r._source?.mType?.label),
      deltaResourceViewFn: (resource) =>
        mTypeSelectorFn(
          resource as ExperimentalBoutonDensity | ExperimentalNeuronDensity | ExperimentalTrace
        ),
    },
    vocabulary: {
      plural: 'M-Types',
      singular: 'M-Type',
    },
  },
  [Field.SubjectSpecies]: {
    esTerms: {
      flat: {
        filter: 'subjectSpecies.label.keyword',
        aggregation: 'subjectSpecies.label.keyword',
        sort: 'subjectSpecies.label.keyword',
      },
    },
    title: 'Species',
    filter: FilterTypeEnum.CheckList,
    render: {
      esResourceViewFn: (_t, r) => selectorFnSpecies(r._source?.subjectSpecies),
      deltaResourceViewFn: () => <Species />,
    },
    vocabulary: {
      plural: 'Species',
      singular: 'Species',
    },
  },
  [Field.Sem]: {
    esTerms: {
      nested: {
        nestedPath: 'series',
        filterTerm: 'series.statistic.keyword',
        filterValue: 'standard error of the mean',
        aggregationName: 'standard error of the mean',
        aggregationField: 'series.value',
      },
    },
    title: 'SEM',
    description: 'Standard error of the mean',
    filter: FilterTypeEnum.ValueRange,
    render: {
      esResourceViewFn: (_t, r) => selectorFnStatistic(r._source, 'standard error of the mean'),
      deltaResourceViewFn: (resource) =>
        semSelectorFn(
          resource as
            | ExperimentalBoutonDensity
            | ExperimentalLayerThickness
            | ExperimentalSynapsesPerConnection
        ),
    },
    vocabulary: {
      plural: 'Values',
      singular: 'Value',
    },
  },
  [Field.Weight]: {
    title: 'Weight',
    filter: FilterTypeEnum.CheckList,
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
  [Field.SubjectAge]: {
    title: 'Age',
    filter: FilterTypeEnum.ValueRange,
    esTerms: {
      flat: {
        filter: 'subjectAge.value',
        aggregation: 'subjectAge.value',
        sort: 'subjectAge.value.minValue',
      },
    },
    render: {
      esResourceViewFn: (_t, r) => selectorFnBasic(r._source?.subjectAge?.label),
      deltaResourceViewFn: () => <SubjectAgeField />,
    },
    vocabulary: {
      plural: 'Ages',
      singular: 'Age',
    },
  },
  [Field.NeuronDensity]: {
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
    filter: FilterTypeEnum.ValueRange,
    unit: '1/mm³',
    render: {
      esResourceViewFn: (_t, r) => selectorFnStatistic(r._source, 'mean'),
      deltaResourceViewFn: (resource) =>
        selectorFnStatisticDetail(
          resource as
            | ExperimentalBoutonDensity
            | ExperimentalLayerThickness
            | ExperimentalSynapsesPerConnection,
          'mean',
          true
        ),
    },
    vocabulary: {
      plural: 'Densities',
      singular: 'Density',
    },
  },
  [Field.Layer]: {
    title: 'Layer',
    filter: FilterTypeEnum.CheckList,
    render: {
      esResourceViewFn: selectorFnLayer,
      deltaResourceViewFn: (resource) => resource.brainLocation?.layer?.label,
    },
    vocabulary: {
      plural: 'Layers',
      singular: 'Layer',
    },
  },
  [Field.LayerThickness]: {
    esTerms: {
      flat: {
        filter: 'layerThickness.value',
        aggregation: 'layerThickness.value',
        sort: 'layerThickness.value',
      },
    },
    title: 'Thickness',
    filter: FilterTypeEnum.ValueRange,
    unit: 'μm',
    render: {
      esResourceViewFn: selectorFnLayerThickness,
      deltaResourceViewFn: (resource) => (
        <LayerThicknessField
          detail={
            resource as
              | ExperimentalBoutonDensity
              | ExperimentalLayerThickness
              | ExperimentalNeuronDensity
              | ExperimentalSynapsesPerConnection
          }
        />
      ),
    },
    vocabulary: {
      plural: 'Thicknesses',
      singular: 'Thickness',
    },
  },
  [Field.Reference]: {
    title: 'Reference',
    filter: FilterTypeEnum.CheckList,
    render: {
      esResourceViewFn: (_t, r) => selectorFnBasic(r._source?.reference),
    },
    vocabulary: {
      plural: 'References',
      singular: 'Reference',
    },
  },
  [Field.Conditions]: {
    title: 'Conditions',
    filter: FilterTypeEnum.CheckList,
    unit: 'Cº',
    render: {
      esResourceViewFn: (_t, r) => selectorFnBasic(r._source?.conditions),
    },
    vocabulary: {
      plural: 'Conditions',
      singular: 'Condition',
    },
  },
  [Field.MeanSTD]: {
    esTerms: {
      nested: {
        nestedPath: 'series',
        filterTerm: 'series.statistic.keyword',
        filterValue: 'mean',
        aggregationName: 'mean',
        aggregationField: 'series.value',
      },
    },
    title: 'Mean ± std',
    unit: '\u00B5m-\u00B9',
    filter: FilterTypeEnum.ValueRange,
    render: {
      esResourceViewFn: selectorFnMeanStd,
      deltaResourceViewFn: (resource) => (
        <MeanStdField
          detail={
            resource as
              | ExperimentalBoutonDensity
              | ExperimentalLayerThickness
              | ExperimentalNeuronDensity
              | ExperimentalSynapsesPerConnection
          }
        />
      ),
    },
    vocabulary: {
      plural: 'Values',
      singular: 'Value',
    },
  },
  [Field.NumberOfMeasurements]: {
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
    filter: FilterTypeEnum.ValueRange,
    render: {
      esResourceViewFn: (_t, r) => selectorFnStatistic(r._source, 'N'),
      deltaResourceViewFn: (resource) =>
        selectorFnStatisticDetail(
          resource as
            | ExperimentalBoutonDensity
            | ExperimentalLayerThickness
            | ExperimentalSynapsesPerConnection,
          'N'
        ),
    },
    vocabulary: {
      plural: 'Values',
      singular: 'Value',
    },
  },
  [Field.Length]: {
    title: 'length',
    filter: null,
    vocabulary: {
      plural: 'length',
      singular: 'length',
    },
  },
  [Field.MaximumLength]: {
    title: 'maximum length',
    filter: null,
    vocabulary: {
      plural: 'maximum length',
      singular: 'maximum length',
    },
  },
  [Field.TotalLength]: {
    title: 'total length',
    filter: null,
    vocabulary: {
      plural: 'total length',
      singular: 'total length',
    },
  },
  [Field.DendriteStemming]: {
    title: 'dendrites stemming from soma',
    filter: null,
    vocabulary: {
      plural: 'dendrites stemming from soma',
      singular: 'dendrite stemming from soma',
    },
  },
  [Field.Axon]: {
    title: 'axon',
    filter: null,
    vocabulary: {
      plural: 'axon',
      singular: 'axons',
    },
  },
  [Field.Bifurcations]: {
    title: 'bifurcations',
    filter: null,
    vocabulary: {
      plural: 'bifurcation',
      singular: 'bifurcations',
    },
  },
  [Field.PreSynapticBrainRegion]: {
    title: 'Brain Region [From]',
    render: {
      esResourceViewFn: (_text, r) =>
        selectorFnSynaptic(r._source, SynapticPosition.Pre, SynapticType.BrainRegion),
      deltaResourceViewFn: (resource) =>
        (resource as ExperimentalSynapsesPerConnection).synapticPathway?.preSynaptic.find(
          (synapse) => synapse.about === 'nsg:BrainRegion'
        )?.label,
    },
    filter: FilterTypeEnum.CheckList,
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
  [Field.PostSynapticBrainRegion]: {
    title: 'Brain Region [To]',
    render: {
      esResourceViewFn: (_text, r) =>
        selectorFnSynaptic(r._source, SynapticPosition.Post, SynapticType.BrainRegion),
      deltaResourceViewFn: (resource) =>
        (resource as ExperimentalSynapsesPerConnection).synapticPathway?.postSynaptic.find(
          (synapse) => synapse.about === 'nsg:BrainRegion'
        )?.label,
    },
    filter: FilterTypeEnum.CheckList,
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
  [Field.PreSynapticCellType]: {
    title: 'Cell Type [From]',
    render: {
      esResourceViewFn: (_text, r) =>
        selectorFnSynaptic(r._source, SynapticPosition.Pre, SynapticType.CellType),
      deltaResourceViewFn: (resource) =>
        (resource as ExperimentalSynapsesPerConnection).synapticPathway?.preSynaptic.find(
          (synapse) => synapse.about === 'BrainCell:Type'
        )?.label,
    },
    filter: FilterTypeEnum.CheckList,
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
  [Field.PostSynapticCellType]: {
    title: 'Cell Type [To]',
    render: {
      esResourceViewFn: (_text, r) =>
        selectorFnSynaptic(r._source, SynapticPosition.Post, SynapticType.CellType),
      deltaResourceViewFn: (resource) =>
        (resource as ExperimentalSynapsesPerConnection).synapticPathway?.postSynaptic.find(
          (synapse) => synapse.about === 'BrainCell:Type'
        )?.label,
    },
    filter: FilterTypeEnum.CheckList,
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
  [Field.AxonTotalLength]: {
    group: MorphoMetricCompartment.Axon,
    title: 'Total Length',
    description: 'Total length of the axon',
    filter: null,
    vocabulary: {
      plural: 'Total Length',
      singular: 'Total Length',
    },
    render: {
      esResourceViewFn: (_text, r) =>
        selectorFnMorphologyFeature(
          r._source,
          MorphoMetricCompartment.Axon,
          'Total Length',
          'raw',
          true
        ),
    },
  },
  [Field.AxonStrahlerNumber]: {
    group: MorphoMetricCompartment.Axon,
    title: 'Strahler number',
    description: 'Strahler number',
    filter: null,
    vocabulary: {
      plural: 'Strahler number',
      singular: 'Strahler number',
    },
    render: {
      esResourceViewFn: (_text, r) =>
        selectorFnMorphologyFeature(
          r._source,
          MorphoMetricCompartment.Axon,
          'Section Strahler Orders',
          'maximum'
        ),
    },
  },
  [Field.AxonArborAsymmetryIndex]: {
    group: MorphoMetricCompartment.Axon,
    title: 'Arbor Asymmetry Index',
    description: 'Arbor asymmetry index (if calculated)',
    filter: null,
    vocabulary: {
      plural: 'Arbor Asymmetry Index',
      singular: 'Arbor Asymmetry Index',
    },
    render: {
      esResourceViewFn: (_text, r) =>
        selectorFnMorphologyFeature(
          r._source,
          MorphoMetricCompartment.Axon,
          'Partition Asymmetry',
          'mean'
        ),
    },
  },
  [Field.BasalDendriticTotalLength]: {
    group: MorphoMetricCompartment.BasalDendrite,
    title: 'Total Length',
    description: 'Total length of the basal dendrites',
    filter: null,
    vocabulary: {
      plural: 'Total Length',
      singular: 'Total Length',
    },
    render: {
      esResourceViewFn: (_text, r) =>
        selectorFnMorphologyFeature(
          r._source,
          MorphoMetricCompartment.BasalDendrite,
          'Total Length',
          'raw',
          true
        ),
    },
  },
  [Field.BasalDendriteStrahlerNumber]: {
    group: MorphoMetricCompartment.BasalDendrite,
    title: 'Strahler number',
    description: 'Strahler number',
    filter: null,
    vocabulary: {
      plural: 'Strahler number',
      singular: 'Strahler number',
    },
    render: {
      esResourceViewFn: (_text, r) =>
        selectorFnMorphologyFeature(
          r._source,
          MorphoMetricCompartment.BasalDendrite,
          'Section Strahler Orders',
          'maximum'
        ),
    },
  },
  [Field.BasalArborAsymmetryIndex]: {
    group: MorphoMetricCompartment.BasalDendrite,
    title: 'Arbor Asymmetry Index',
    description: 'Basal Arbor asymmetry index (if calculated)',
    filter: null,
    vocabulary: {
      plural: 'Arbor Asymmetry Index',
      singular: 'Arbor Asymmetry Index',
    },
    render: {
      esResourceViewFn: (_text, r) =>
        selectorFnMorphologyFeature(
          r._source,
          MorphoMetricCompartment.BasalDendrite,
          'Partition Asymmetry',
          'mean'
        ),
    },
  },
  [Field.ApicalDendriticTotalLength]: {
    group: MorphoMetricCompartment.ApicalDendrite,
    title: 'Total Length',
    description: 'Total length of the apical dendrites',
    filter: null,
    vocabulary: {
      plural: 'Total Length',
      singular: 'Total Length',
    },
    render: {
      esResourceViewFn: (_text, r) =>
        selectorFnMorphologyFeature(
          r._source,
          MorphoMetricCompartment.ApicalDendrite,
          'Total Length',
          'raw',
          true
        ),
    },
  },
  [Field.ApicalDendtriteStrahlerNumber]: {
    group: MorphoMetricCompartment.ApicalDendrite,
    title: 'Strahler number',
    description: 'Apical Dendrite Strahler number',
    filter: null,
    vocabulary: {
      plural: 'Strahler number',
      singular: 'Strahler number',
    },
    render: {
      esResourceViewFn: (_text, r) =>
        selectorFnMorphologyFeature(
          r._source,
          MorphoMetricCompartment.ApicalDendrite,
          'Section Strahler Orders',
          'maximum'
        ),
    },
  },
  [Field.ApicalArborAsymmetryIndex]: {
    group: MorphoMetricCompartment.ApicalDendrite,
    title: 'Arbor Asymmetry Index',
    description: 'Apical Arbor asymmetry index (if calculated)',
    filter: null,
    vocabulary: {
      plural: 'Arbor Asymmetry Index',
      singular: 'Arbor Asymmetry Index',
    },
    render: {
      esResourceViewFn: (_text, r) =>
        selectorFnMorphologyFeature(
          r._source,
          MorphoMetricCompartment.ApicalDendrite,
          'Partition Asymmetry',
          'mean'
        ),
    },
  },
  [Field.NeuronMorphologyWidth]: {
    group: MorphoMetricCompartment.NeuronMorphology,
    title: 'Total Width',
    description: 'Neuron morphology total width',
    filter: null,
    vocabulary: {
      plural: 'Total Width',
      singular: 'Total Width',
    },
    render: {
      esResourceViewFn: (_text, r) =>
        selectorFnMorphologyFeature(
          r._source,
          MorphoMetricCompartment.NeuronMorphology,
          'Total Width',
          'raw',
          true
        ),
    },
  },
  [Field.NeuronMorphologyHeight]: {
    group: MorphoMetricCompartment.NeuronMorphology,
    title: 'Total Height',
    description: 'Neuron morphology total height',
    filter: null,
    vocabulary: {
      plural: 'Total Height',
      singular: 'Total Height',
    },
    render: {
      esResourceViewFn: (_text, r) =>
        selectorFnMorphologyFeature(
          r._source,
          MorphoMetricCompartment.NeuronMorphology,
          'Total Height',
          'raw',
          true
        ),
    },
  },
  [Field.NeuronMorphologyDepth]: {
    group: MorphoMetricCompartment.NeuronMorphology,
    title: 'Total Depth',
    description: 'Neuron morphology total depth',
    filter: null,
    vocabulary: {
      plural: 'Total Depth',
      singular: 'Total Depth',
    },
    render: {
      esResourceViewFn: (_text, r) =>
        selectorFnMorphologyFeature(
          r._source,
          MorphoMetricCompartment.NeuronMorphology,
          'Total Depth',
          'raw',
          true
        ),
    },
  },
  [Field.SomaDiameter]: {
    group: MorphoMetricCompartment.Soma,
    title: 'Diameter',
    description: 'Diameter of the soma',
    filter: null,
    vocabulary: {
      plural: 'Diameter',
      singular: 'Diameter',
    },
    render: {
      esResourceViewFn: (_text, r) =>
        selectorFnMorphologyFeature(r._source, 'Soma', 'Soma Radius', 'raw', true),
    },
  },
};
