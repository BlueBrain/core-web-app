import { Field } from '@/constants/explore-section/fields-config/enums';
import { DetailProps } from '@/types/explore-section/application';

export const COMMON_FIELDS = [
  {
    field: Field.Description,
    className: 'col-span-3',
  },
  {
    field: Field.Contributors,
  },
  {
    field: Field.RegistrationDate,
  },
] as DetailProps[];

export const NEURON_MORPHOLOGY_FIELDS = [
  {
    field: Field.BrainRegion,
  },
  {
    field: Field.SubjectSpecies,
  },
  {
    field: Field.License,
  },
  {
    field: Field.MType,
  },
  {
    field: Field.SubjectAge,
  },
] as DetailProps[];

export const BOUTON_DENSITY_FIELDS = [
  {
    field: Field.BrainRegion,
  },
  {
    field: Field.SubjectSpecies,
  },
  {
    field: Field.License,
  },
  {
    field: Field.MType,
  },
  {
    field: Field.SubjectAge,
    className: 'col-span-2',
  },
  {
    field: Field.MeanSTD,
  },
  {
    field: Field.Weight,
    className: 'col-span-2',
  },
  {
    field: Field.Sem,
    className: 'col-span-3',
  },
  {
    field: Field.NumberOfMeasurements,
    className: 'col-span-3',
  },
] as DetailProps[];

export const ELECTRO_PHYSIOLOGY_FIELDS = [
  {
    field: Field.BrainRegion,
  },
  {
    field: Field.SubjectSpecies,
  },
  {
    field: Field.License,
  },
  {
    field: Field.EType,
  },
  {
    field: Field.SubjectAge,
  },
] as DetailProps[];

export const NEURON_DENSITY_FIELDS = [
  {
    field: Field.BrainRegion,
  },
  {
    field: Field.SubjectSpecies,
  },
  {
    field: Field.License,
  },
  {
    field: Field.MType,
  },
  {
    field: Field.SubjectAge,
    className: 'col-span-2',
  },
  {
    field: Field.EType,
    className: 'col-span-3',
  },
  {
    field: Field.NeuronDensity,
    className: 'col-span-3',
  },
  {
    field: Field.NumberOfMeasurements,
    className: 'col-span-3',
  },
] as DetailProps[];

export const SYNAPSE_PER_CONNECTION_FIELDS = [
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
    field: Field.NumberOfConnections,
  },
] as DetailProps[];

export const E_MODEL_FIELDS = [
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
    field: Field.EType,
  },
] as DetailProps[];

export const ME_MODEL_FIELDS = [
  {
    field: Field.BrainRegion,
    className: 'col-span-2',
  },
  {
    field: Field.MEModelValidated,
    className: 'col-span-2',
  },
  {
    field: Field.MType,
    className: 'col-span-4',
  },
  {
    field: Field.EType,
    className: 'col-span-4',
  },
] as DetailProps[];

export const MODEL_DATA_COMMON_FIELDS = [
  {
    field: Field.Description,
    className: 'col-span-3',
  },
  {
    field: Field.CreatedBy,
  },
  {
    field: Field.CreationDate,
  },
] as DetailProps[];

export const SYNATOME_MODEL_FIELDS = [
  {
    field: Field.SynatomeUsedMEModelName,
    className: 'col-span-2',
  },
  {
    field: Field.SynatomeUsedSpecies,
    className: 'col-span-2',
  },
  {
    field: Field.BrainRegion,
    className: 'col-span-4',
  },
  {
    field: Field.SynatomeUsedMModelName,
    className: 'col-span-4',
  },
  {
    field: Field.SynatomeUsedEModelName,
    className: 'col-span-4',
  },
] as DetailProps[];
