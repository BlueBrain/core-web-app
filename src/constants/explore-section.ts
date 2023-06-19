import { nexus } from '@/config';
import { Filter } from '@/components/Filter/types';

export const API_SEARCH = `${nexus.url}/search/query/suite/sbo`;

export const REPORT_SPARQL_QUERY = `PREFIX s:<http://schema.org/>
PREFIX prov:<http://www.w3.org/ns/prov#>
PREFIX nsg:<https://neuroshapes.org/>
PREFIX nxv:<https://bluebrain.github.io/nexus/vocabulary/>
SELECT ?container_resource_id  ?container_resource_name ?analysis_report_id ?analysis_report_self ?analysis_report_name ?analysis_report_description ?analysis_report_categories ?analysis_report_types ?created_by ?created_at ?updated_by ?updated_at ?self
WHERE {
  OPTIONAL {
    BIND(<{resourceId}> as ?container_resource_id) .
    BIND(<{resourceId}> as ?self) .
    ?derivation_id        ^prov:derivation       ?analysis_report_id .
    ?derivation_id        nsg:entity             ?container_resource_id .
    OPTIONAL {
      ?container_resource_id        nsg:name                   ?container_resource_name .
    }
    ?analysis_report_id    nsg:name            ?analysis_report_name .
    ?analysis_report_id    nsg:description       ?analysis_report_description .
    OPTIONAL {
      ?analysis_report_id    nsg:categories       ?analysis_report_categories .
      ?analysis_report_id    nsg:types       ?analysis_report_types .
    }
    ?analysis_report_id nxv:createdBy ?created_by .
    ?analysis_report_id nxv:createdAt ?created_at .
    ?analysis_report_id nxv:updatedBy ?updated_by .
    ?analysis_report_id nxv:updatedAt ?updated_at .
    ?analysis_report_id nxv:self ?analysis_report_self .
  }
  OPTIONAL {
    BIND(<{resourceId}> as ?analysis_report_id) .
    BIND(<{resourceId}> as ?self) .
    ?derivation_id        ^prov:derivation       ?analysis_report_id .
    ?derivation_id        nsg:entity             ?container_resource_id .
    OPTIONAL {
      ?container_resource_id        nsg:name                   ?container_resource_name .
    }
    ?analysis_report_id    nsg:name            ?analysis_report_name .
    ?analysis_report_id    nsg:description       ?analysis_report_description .
    OPTIONAL {
      ?analysis_report_id    nsg:categories       ?analysis_report_categories .
      ?analysis_report_id    nsg:types       ?analysis_report_types .
    }
    ?analysis_report_id nxv:createdBy ?created_by .
    ?analysis_report_id nxv:createdAt ?created_at .
    ?analysis_report_id nxv:updatedBy ?updated_by .
    ?analysis_report_id nxv:updatedAt ?updated_at .
    ?analysis_report_id nxv:self ?analysis_report_self .
  }
}
LIMIT 1000`;

export const ES_TERMS: {
  [key: string]: { term: string | string[]; title: string; description?: string };
} = {
  brainRegion: {
    term: 'brainRegion.label.keyword',
    title: 'BRAIN REGION',
  },
  eType: {
    term: 'eType.label.keyword',
    title: 'E-TYPE',
  },
  mType: {
    term: 'mType.label.keyword',
    title: 'M-TYPE',
  },
  name: {
    term: 'name.keyword',
    title: 'NAME',
  },
  subjectSpecies: {
    term: 'subjectSpecies.label.keyword',
    title: 'SPECIES',
  },
  sem: {
    term: 'sem.label.keyword',
    title: 'SEM',
    description: 'Standard error of the mean',
  },
  weight: {
    term: 'weight.label.keyword',
    title: 'WEIGHT',
  },
  subjectAge: {
    term: 'subjectAge.label.keyword',
    title: 'AGE',
  },
  contributors: {
    term: 'contributors.label.keyword',
    title: 'CONTRIBUTORS',
  },
  neuronDensity: {
    term: 'neuronDensity.label.keyword',
    title: 'NEURON DENSITY',
  },
  boutonDensity: {
    term: 'boutonDensity.label.keyword',
    title: 'BOUTON DENSITY',
  },
  layer: {
    term: 'layer.label.keyword',
    title: 'LAYER',
  },
  layerThickness: {
    term: 'layerThickness.label.keyword',
    title: 'THICKNESS (µM)',
  },
  circuitType: {
    term: 'circuitType.keyword',
    title: 'CIRCUIT TYPE',
  },
  createdAt: {
    term: 'createdAt',
    title: 'CREATED ON',
  },
  createdBy: {
    term: 'createdBy.keyword',
    title: 'CREATED BY',
  },
  updatedAt: {
    term: 'updatedAt',
    title: 'UPDATED AT',
  },
  reference: {
    term: 'reference.keyword',
    title: 'REFERENCE',
  },
  conditions: {
    term: 'conditions.keyword',
    title: 'CONDITIONS',
  },
  meanstd: {
    term: 'createdAt',
    title: 'MEAN ± STD',
  },
  numberOfCells: {
    term: 'createdAt',
    title: 'N° Of CELLS',
  },
};

export const DEFAULT_FILTERS = [
  { field: 'brainRegion', type: 'checkList', value: [], title: 'Brain Region' },
  { field: 'name', type: 'checkList', value: [], title: 'Name' },
  { field: 'description', type: 'checkList', value: [], title: 'Description' },
  { field: 'contributors', type: 'checkList', value: [], title: 'Contributors' },
  { field: 'createdAt', type: 'dateRange', value: [], title: 'Created At' },
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

export const NO_DATA_STRING: string = 'N/A';
