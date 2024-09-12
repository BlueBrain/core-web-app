import { SimulationTypeNames } from '../simulation/single-neuron';
import { ExperimentTypeNames } from '@/constants/explore-section/data-types/experiment-data-types';
import { ModelTypeNames } from '@/constants/explore-section/data-types/model-data-types';
import { DataType } from '@/constants/explore-section/list-views';

export type Bookmark = {
  resourceId: string;
  category: DataType;
};

export type BookmarksByCategory = {
  [key in DataType]: Bookmark[];
};

export type BulkRemoveBookmarksResponse = {
  successfully_deleted: Bookmark[];
  failed_to_delete: Bookmark[];
};

export type BookmarksSupportedTypes = ExperimentTypeNames | ModelTypeNames | SimulationTypeNames;

export const isExperiment = (t: string | null): t is ExperimentTypeNames => {
  return t ? Object.values(ExperimentTypeNames).includes(t as ExperimentTypeNames) : false;
};

export const isModel = (t: string | null): t is ModelTypeNames => {
  return t ? Object.values(ModelTypeNames).includes(t as ModelTypeNames) : false;
};

export const isSimulation = (t: string | null): t is SimulationTypeNames => {
  return t ? Object.values(SimulationTypeNames).includes(t as SimulationTypeNames) : false;
};

export enum BookmarkTabsName {
  EXPERIMENTS = 'experiments',
  MODELS = 'models',
  SIMULATIONS = 'simulations',
}
