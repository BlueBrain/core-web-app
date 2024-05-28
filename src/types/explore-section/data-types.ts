import { Field } from '@/constants/explore-section/fields-config/enums';
import { DetailProps } from '@/types/explore-section/application';

export type ExperimentDataTypeName =
  | 'morphology'
  | 'electrophysiology'
  | 'neuron-density'
  | 'bouton-density'
  | 'synapse-per-connection';

export type DataTypeConfig = {
  title: string;
  name: string;
  columns: Array<Field>;
  curated: boolean;
  group: DataTypeGroup;
  cardViewFields?: DetailProps[];
  mlTopic?: string;
};

export enum DataTypeGroup {
  ExperimentalData = 'ExperimentalData',
  ModelData = 'ModelData',
  SimulationData = 'SimulationData',
}
