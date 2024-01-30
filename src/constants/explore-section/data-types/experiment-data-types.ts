import { DataType } from '@/constants/explore-section/list-views';
import { Field } from '@/constants/explore-section/fields-config/enums';
import { DataTypeGroup } from '@/types/explore-section/data-types';

export const EXPERIMENT_DATA_TYPES = {
  [DataType.ExperimentalNeuronMorphology]: {
    title: 'Morphology',
    group: DataTypeGroup.ExperimentalData,
    name: 'morphology',
    columns: [
      Field.Preview,
      Field.BrainRegion,
      Field.MType,
      Field.Name,
      Field.SubjectSpecies,
      Field.Contributors,
      Field.CreatedAt,
    ],
    curated: true,
    cardViewFields: [
      {
        field: Field.Name,
        className: 'col-span-2',
      },
      {
        field: Field.NeuronMorphologyWidth,
        className: 'col-span-2',
      },
      {
        field: Field.NeuronMorphologyLength,
        className: 'col-span-2',
      },
      {
        field: Field.NeuronMorphologyDepth,
        className: 'col-span-2',
      },
      {
        field: Field.AxonTotalLength,
        className: 'col-span-2',
      },
      {
        field: Field.AxonMaxBranchOrder,
        className: 'col-span-2',
      },
      {
        field: Field.AxonArborAsymmetryIndex,
        className: 'col-span-2',
      },
      {
        field: Field.BasalDendriticTotalLength,
        className: 'col-span-2',
      },
      {
        field: Field.BasalDendriteMaxBranchOrder,
        className: 'col-span-2',
      },
      {
        field: Field.BasalArborAsymmetryIndex,
        className: 'col-span-2',
      },
      {
        field: Field.ApicalDendriticTotalLength,
        className: 'col-span-2',
      },
      {
        field: Field.ApicalDendtriteMaxBranchOrder,
        className: 'col-span-2',
      },
      {
        field: Field.SomaDiameter,
        className: 'col-span-2',
      },
      {
        field: Field.ApicalArborAsymmetryIndex,
        className: 'col-span-2',
      },
      {
        field: Field.BrainRegion,
        className: 'col-span-2',
      },
      {
        field: Field.MType,
        className: 'col-span-2',
      },
      {
        field: Field.SubjectSpecies,
        className: 'col-span-2',
      },
      {
        field: Field.Contributors,
        className: 'col-span-2',
      },
      {
        field: Field.CreatedAt,
        className: 'col-span-2',
      },
    ],
    mlTopic: 'Neuron morphology',
  },
  [DataType.ExperimentalElectroPhysiology]: {
    title: 'Electrophysiology',
    group: DataTypeGroup.ExperimentalData,
    name: 'electrophysiology',
    columns: [
      Field.Preview,
      Field.BrainRegion,
      Field.EType,
      Field.Name,
      Field.SubjectSpecies,
      Field.Contributors,
      Field.CreatedAt,
    ],
    curated: true,
    mlTopic: 'Neuron spike',
  },
  [DataType.ExperimentalNeuronDensity]: {
    title: 'Neuron density',
    group: DataTypeGroup.ExperimentalData,
    name: 'neuron-density',
    columns: [
      Field.BrainRegion,
      Field.MType,
      Field.EType,
      Field.NeuronDensity,
      Field.NumberOfMeasurements,
      Field.Name,
      Field.SubjectSpecies,
      Field.SubjectAge,
      Field.Contributors,
      Field.CreatedAt,
    ],
    curated: false,
    mlTopic: 'cell composition',
  },
  [DataType.ExperimentalBoutonDensity]: {
    title: 'Bouton density',
    group: DataTypeGroup.ExperimentalData,
    name: 'bouton-density',
    columns: [
      Field.BrainRegion,
      Field.MType,
      Field.MeanSTD,
      Field.Sem,
      Field.NumberOfMeasurements,
      Field.SubjectSpecies,
      Field.Contributors,
      Field.CreatedAt,
    ],
    curated: false,
    mlTopic: 'Bouton density',
  },
  [DataType.ExperimentalSynapsePerConnection]: {
    title: 'Synapse per connection',
    group: DataTypeGroup.ExperimentalData,
    name: 'synapse-per-connection',
    columns: [
      Field.PreSynapticBrainRegion,
      Field.PostSynapticBrainRegion,
      Field.PreSynapticCellType,
      Field.PostSynapticCellType,
      Field.MeanSTD,
      Field.SubjectSpecies,
      Field.SubjectAge,
      Field.Contributors,
      Field.CreatedAt,
    ],
    curated: false,
    mlTopic: 'Synapse per connection',
  },
};
