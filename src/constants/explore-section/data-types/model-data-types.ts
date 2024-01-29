import { DataType } from '@/constants/explore-section/list-views';
import { Field } from '@/constants/explore-section/fields-config/enums';
import { DataTypeGroup } from '@/types/explore-section/data-types';

export const MODEL_DATA_TYPES = {
  [DataType.CircuitEModel]: {
    title: 'E-model',
    group: DataTypeGroup.ModelData,
    name: 'e-model',
    columns: [Field.MType, Field.EType, Field.BrainRegion, Field.CreatedAt],
    curated: false,
  },
};
