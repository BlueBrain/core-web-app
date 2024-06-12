import { DataType } from '@/constants/explore-section/list-views';
import { Field } from '@/constants/explore-section/fields-config/enums';
import { DataTypeConfig, DataTypeGroup } from '@/types/explore-section/data-types';

export const MODEL_DATA_TYPES: { [key: string]: DataTypeConfig } = {
  [DataType.CircuitEModel]: {
    title: 'E-model',
    group: DataTypeGroup.ModelData,
    name: 'e-model',
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
    name: 'me-model',
    columns: [
      Field.Name,
      Field.MEModelMorphologyPreview,
      Field.MEModelResponse,
      Field.BrainRegion,
      Field.MType,
      Field.EType,
    ],

    curated: false,
  },
};
