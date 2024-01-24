import { DataType } from '@/constants/explore-section/list-views';
import { DetailProps } from '@/types/explore-section/application';
import { Field } from '@/constants/explore-section/fields-config/enums';

export type ExperimentConfig = {
  title: string;
  name: string;
  columns: Array<Field>;
  curated: boolean;
  cardViewFields?: DetailProps[];
};

export const INTERACTIVE_PATH = `/explore/interactive/`;
export const BASE_EXPLORE_PATH = `${INTERACTIVE_PATH}data/`;

export const SIMULATION_DATA_TYPES = {
  [DataType.SimulationCampaigns]: {
    title: 'Simulation campaigns',
    name: 'simulation-campaigns',
    columns: [Field.SimulationCampaignName, Field.BrainConfiguration, Field.CreatedAt],
    curated: false,
  },
};

export const EXPERIMENT_DATA_TYPES = {
  [DataType.ExperimentalNeuronMorphology]: {
    title: 'Morphology',
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
  },
  [DataType.ExperimentalElectroPhysiology]: {
    title: 'Electrophysiology',
    name: 'electrophysiology',
    columns: [
      Field.BrainRegion,
      Field.EType,
      Field.Name,
      Field.SubjectSpecies,
      Field.Contributors,
      Field.CreatedAt,
    ],
    curated: true,
  },
  [DataType.ExperimentalNeuronDensity]: {
    title: 'Neuron density',
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
  },
  [DataType.ExperimentalBoutonDensity]: {
    title: 'Bouton density',
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
  },
  [DataType.ExperimentalSynapsePerConnection]: {
    title: 'Synapse per connection',
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
  },
};

export const DATA_TYPES_TO_CONFIGS: Record<DataType, ExperimentConfig> = {
  ...SIMULATION_DATA_TYPES,
  ...EXPERIMENT_DATA_TYPES,
};
