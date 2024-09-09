import { DataType } from '@/constants/explore-section/list-views';
import { Field } from '@/constants/explore-section/fields-config/enums';
import { DataTypeConfig, DataTypeGroup } from '@/types/explore-section/data-types';

export const SIMULATION_DATA_TYPES: { [key: string]: DataTypeConfig } = {
  [DataType.SimulationCampaigns]: {
    title: 'Simulation campaigns',
    group: DataTypeGroup.SimulationData,
    name: 'simulation-campaigns',
    columns: [Field.SimulationCampaignName, Field.BrainConfiguration, Field.CreatedAt],
    curated: false,
  },
  [DataType.SingleNeuronSimulation]: {
    title: 'Single Neuron simulation',
    group: DataTypeGroup.SimulationData,
    name: 'single-neuron-simulation',
    columns: [
      Field.Name,
      Field.SingleNeuronSimulationUsedModelName,
      Field.SingleNeuronSimulationStimulus,
      Field.SingleNeuronSimulationResponse,
      Field.SingleNeuronSimulationInjectionLocation,
      Field.SingleNeuronSimulationRecordingLocation,
      Field.BrainRegion,
      Field.CreatedAt,
    ],
    curated: false,
  },
  [DataType.SingleNeuronSynaptomeSimulation]: {
    title: 'Single Neuron Synaptome Simulation',
    group: DataTypeGroup.SimulationData,
    name: 'synaptome-simulation',
    columns: [
      Field.Name,
      Field.Description,
      Field.SimulationSynaptomeStimulusThumbnail,
      Field.SimulationSynaptomeRecordingThumbnail,
      Field.SimulationSynatomeUsedModelName,
      Field.BrainRegion,
      Field.CreatedBy,
      Field.CreationDate,
    ],
    curated: false,
  },
};
