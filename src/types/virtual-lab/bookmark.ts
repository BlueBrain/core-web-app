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

export const isExperiment = (t: BookmarksSupportedTypes): t is ExperimentTypeNames => {
  return Object.values(ExperimentTypeNames).includes(t as ExperimentTypeNames);
};

export const isModel = (t: BookmarksSupportedTypes): t is ModelTypeNames => {
  return Object.values(ModelTypeNames).includes(t as ModelTypeNames);
};

export const isSimulation = (t: BookmarksSupportedTypes): t is SimulationTypeNames => {
  return Object.values(SimulationTypeNames).includes(t as SimulationTypeNames);
};

export enum BookmarkTabsName {
  EXPERIMENTS = 'experiments',
  MODELS = 'models',
  SIMULATIONS = 'simulations',
}
