import { Filter } from '@/components/Filter/types';

export const DEFAULT_FILTERS = [
  { field: 'brainRegion', type: 'checkList', value: [], title: 'Brain Region' },
  { field: 'name', type: 'checkList', value: [], title: 'Name' },
  { field: 'description', type: 'checkList', value: [], title: 'Description' },
  { field: 'contributors', type: 'checkList', value: [], title: 'Contributors' },
  { field: 'updatedAt', type: 'checkList', value: [], title: 'Updated At' },
  { field: 'conditions', type: 'checkList', value: [], title: 'Conditions' },
];

export const TYPE_FILTER_MAPPING: { [key: string]: Filter[] } = {
  'https://neuroshapes.org/BoutonDensity': [
    { field: 'mType', type: 'checkList', value: [], title: 'M-Type' },
    { field: 'meanstd', type: 'checkList', value: [], title: 'Mean STD' },
    { field: 'sem', type: 'checkList', value: [], title: 'SEM' },
    { field: 'numberOfCells', type: 'checkList', value: [], title: 'Number Of Cells' },
    { field: 'subjectSpecies', type: 'checkList', value: [], title: 'Subject Species' },
    { field: 'reference', type: 'checkList', value: [], title: 'Reference' },
  ],
  'https://neuroshapes.org/Trace': [
    { field: 'eType', type: 'checkList', value: [], title: 'E-Type' },
    { field: 'subjectSpecies', type: 'checkList', value: [], title: 'Subject Species' },
    { field: 'reference', type: 'checkList', value: [], title: 'Reference' },
  ],
  'https://neuroshapes.org/LayerThickness': [
    { field: 'layer', type: 'checkList', value: [], title: 'Layer' },
    { field: 'layerThickness', type: 'checkList', value: [], title: 'layer Thickness' },
    { field: 'subjectSpecies', type: 'checkList', value: [], title: 'Subject Species' },
    { field: 'reference', type: 'checkList', value: [], title: 'Reference' },
  ],
  'https://neuroshapes.org/NeuronMorphology': [
    { field: 'mType', type: 'checkList', value: [], title: 'M-Type' },
    { field: 'reference', type: 'checkList', value: [], title: 'Reference' },
    { field: 'subjectSpecies', type: 'checkList', value: [], title: 'Subject Species' },
  ],
  'https://neuroshapes.org/NeuronDensity': [
    { field: 'mType', type: 'checkList', value: [], title: 'M-Type' },
    { field: 'eType', type: 'checkList', value: [], title: 'E-Type' },
    { field: 'subjectSpecies', type: 'checkList', value: [], title: 'Subject Species' },
    { field: 'reference', type: 'checkList', value: [], title: 'Reference' },
  ],
  'https://neuroshapes.org/SynapsePerConnection': [
    { field: 'mType', type: 'checkList', value: [], title: 'M-Type' },
    { field: 'subjectSpecies', type: 'checkList', value: [], title: 'Subject Species' },
  ],
};
