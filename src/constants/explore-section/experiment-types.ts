import {
  BOUTON_DENSITY,
  ELECTRO_PHYSIOLOGY,
  ExperimentDataTypeName,
  NEURON_DENSITY,
  NEURON_MORPHOLOGY,
  SYNAPSE_PER_CONNECTION,
  SIMULATION_CAMPAIGNS,
} from '@/constants/explore-section/list-views';
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

export const SIMULATION_DATA_TYPES: {
  [x: ExperimentDataTypeName]: ExperimentConfig;
} = {
  [SIMULATION_CAMPAIGNS]: {
    title: 'Simulation campaigns',
    name: 'simulation-campaigns',
    columns: [Field.SimulationCampaignName, Field.SimulationCampaignStatus, Field.CreatedAt],
    curated: false,
  },
};

export const EXPERIMENT_DATA_TYPES: {
  [x: ExperimentDataTypeName]: ExperimentConfig;
} = {
  [NEURON_MORPHOLOGY]: {
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
  [ELECTRO_PHYSIOLOGY]: {
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
  [NEURON_DENSITY]: {
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
  [BOUTON_DENSITY]: {
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
  [SYNAPSE_PER_CONNECTION]: {
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
