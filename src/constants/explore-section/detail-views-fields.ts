import { Field } from '@/constants/explore-section/fields-config/enums';
import { DetailProps } from '@/types/explore-section/application';

export const NEURON_MORPHOLOGY_FIELDS = [
  {
    field: Field.Description,
    className: 'col-span-3 row-span-2',
  },
  {
    field: Field.MType,
  },
  {
    field: Field.SubjectSpecies,
  },
  {
    field: Field.BrainRegion,
  },
  {
    field: Field.Contributors,
  },
  {
    field: Field.CreatedAt,
  },
  {
    field: Field.License,
  },
] as DetailProps[];

export const BOUTON_DENSITY_FIELDS = [
  {
    field: Field.Description,
    className: 'col-span-3 row-span-2',
  },
  {
    field: Field.BrainRegion,
  },
  {
    field: Field.MeanSTD,
  },
  {
    field: Field.SubjectSpecies,
  },
  {
    field: Field.MType,
  },
  {
    field: Field.Sem,
  },
  {
    field: Field.Weight,
  },
  {
    field: Field.Contributors,
  },
  {
    field: Field.CreatedAt,
  },
  {
    field: Field.License,
  },
  {
    field: Field.NumberOfMeasurements,
    className: 'col-span-2 col-start-5',
  },
] as DetailProps[];

export const ELECTRO_PHYSIOLOGY_FIELDS = [
  {
    field: Field.Description,
    className: 'col-span-3 row-span-2',
  },
  {
    field: Field.EType,
    className: 'row-span-2',
  },
  {
    field: Field.SubjectSpecies,
    className: 'row-span-2',
  },
  {
    field: Field.BrainRegion,
    className: 'row-span-2',
  },
  {
    field: Field.Contributors,
    className: 'col-span-3',
  },
  {
    field: Field.CreatedAt,
  },
  {
    field: Field.License,
  },
] as DetailProps[];

export const NEURON_DENSITY_FIELDS = [
  {
    field: Field.Description,
    className: 'col-span-3 row-span-2',
  },
  {
    field: Field.BrainRegion,
  },
  {
    field: Field.SubjectSpecies,
  },
  {
    field: Field.NumberOfMeasurements,
  },
  {
    field: Field.SubjectAge,
  },
  {
    field: Field.MType,
  },
  {
    field: Field.EType,
  },
  {
    field: Field.Contributors,
    className: 'row-span-3',
  },
  {
    field: Field.CreatedAt,
    className: 'col-span-2',
  },
  {
    field: Field.NeuronDensity,
  },
  {
    field: Field.License,
  },
] as DetailProps[];

export const SYNAPSE_PER_CONNECTION_FIELDS = [
  {
    field: Field.Description,
    className: 'row-span-2 col-span-3',
  },
  {
    field: Field.PreSynapticBrainRegion,
  },
  {
    field: Field.SubjectSpecies,
  },
  {
    field: Field.License,
  },
  {
    field: Field.PostSynapticBrainRegion,
  },
  {
    field: Field.SubjectAge,
    className: 'col-span-2',
  },
  {
    field: Field.Contributors,
    className: 'row-span-5',
  },
  {
    field: Field.CreatedAt,
    className: 'row-span-5 col-span-2',
  },
  {
    field: Field.PreSynapticCellType,
  },
  {
    field: Field.Weight,
    className: 'col-span-2',
  },
  {
    field: Field.PostSynapticCellType,
    className: 'col-span-3',
  },
  {
    field: Field.MeanSTD,
    className: 'col-span-3',
  },
  {
    field: Field.Sem,
    className: 'col-span-3',
  },
  {
    field: Field.NumberOfMeasurements,
  },
] as DetailProps[];

export const E_MODEL_FIELDS = [
  {
    field: Field.Description,
    className: 'col-span-3 row-span-2',
  },
  {
    field: Field.BrainRegion,
  },
  {
    field: Field.EModelScore,
  },
  {
    field: Field.MType,
    className: 'col-span-3',
  },
  {
    field: Field.Contributors,
  },
  {
    field: Field.CreatedAt,
    className: 'col-span-2',
  },
  {
    field: Field.EType,
  },
];
