import { DataType } from '@/constants/explore-section/list-views';
import { Field } from '@/constants/explore-section/fields-config/enums';
import { DataTypeConfig, DataTypeGroup } from '@/types/explore-section/data-types';

export enum ModelTypeNames {
  E_MODEL = 'e-model',
  ME_MODEL = 'me-model',
  SINGLE_NEURON_SYNAPTOME = 'single-neuron-synaptome',
}

export const MODEL_DATA_TYPES: { [key: string]: DataTypeConfig } = {
  [DataType.CircuitEModel]: {
    title: 'E-model',
    group: DataTypeGroup.ModelData,
    name: ModelTypeNames.E_MODEL,
    columns: [
      Field.Name,
      Field.EModelResponse,
      Field.BrainRegion,
      Field.MType,
      Field.EType,
      Field.EModelMorphology,
      Field.EModelScore,
      Field.BrainRegion,
      Field.CreatedAt,
      Field.Contributors,
    ],

    curated: false,
  },
  [DataType.CircuitMEModel]: {
    title: 'ME-model',
    group: DataTypeGroup.ModelData,
    name: ModelTypeNames.ME_MODEL,
    columns: [
      Field.Name,
      Field.MEModelMorphologyPreview,
      Field.MEModelResponse,
      Field.MEModelValidated,
      Field.BrainRegion,
      Field.MType,
      Field.EType,
    ],

    curated: false,
  },
  [DataType.SingleNeuronSynaptome]: {
    title: 'Synaptome',
    group: DataTypeGroup.ModelData,
    name: ModelTypeNames.SINGLE_NEURON_SYNAPTOME,
    columns: [
      Field.Name,
      Field.Description,
      Field.SynatomeUsedMEModelName,
      Field.BrainRegion,
      Field.CreatedBy,
      Field.CreationDate,
    ],

    curated: false,
  },
} as const;
