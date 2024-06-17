import { EXPERIMENT_DATA_TYPES } from '@/constants/explore-section/data-types/experiment-data-types';
import { DataType } from '@/constants/explore-section/list-views';

export const SourceDataGroupTabsEnum = {
  models: 'Models',
  simulations: 'Simulations',
  'experimental-data': 'Experimental data',
};

export type SourceDataActiveTab = keyof typeof SourceDataGroupTabsEnum;

export type SourceDataCategory = {
  id: string;
  name: string;
  active: boolean;
};

export type SourceDataItem = {
  id: string;
  name: string;
  type: string | Array<string>;
  category: SourceDataActiveTab;
};

export const SOURCE_GROUP_TAB = Object.entries(SourceDataGroupTabsEnum).map(([key, value]) => ({
  id: key,
  label: value,
}));

const Models: Array<SourceDataCategory> = [
  { id: 'ion-channel-model', name: 'Ion channel model', active: false },
  { id: DataType.CircuitEModel, name: 'Single Neuron model', active: true },
  { id: 'paired-neuron-model', name: 'Paired Neuron model', active: false },
  { id: 'synaptome', name: 'Synaptome', active: false },
  { id: 'microcircuit', name: 'Microcircuit', active: false },
  { id: 'neuro-glia-vascular', name: 'Neuro-glia-vascular', active: false },
  { id: 'single-brain-region', name: 'Single brain region', active: false },
  { id: 'brain-system', name: 'Brain system', active: false },
  { id: 'whole-brain', name: 'Whole brain', active: false },
];

export const SOURCE_DATA_GROUP_LIST: Array<{
  id: SourceDataActiveTab;
  list: Array<Omit<SourceDataCategory, 'category'>>;
}> = [
  {
    id: 'experimental-data',
    list: Object.keys(EXPERIMENT_DATA_TYPES).map((key) => ({
      id: key,
      name: EXPERIMENT_DATA_TYPES[key].title,
      active: true,
    })),
  },
  {
    id: 'models',
    list: Models,
  },
  {
    id: 'simulations',
    list: Models,
  },
];
