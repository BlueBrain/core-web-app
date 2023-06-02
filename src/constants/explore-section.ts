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

export const ES_TERMS: { [key: string]: { term: string | string[]; title: string } } = {
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
  contributors: {
    term: 'contributors.label.keyword',
    title: 'CONTRIBUTORS',
  },
  neuronDensity: {
    term: 'neuronDensity.label.keyword',
    title: 'NEURON DENSITY (neurons/mm³)',
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
  sem: {
    term: 'createdAt',
    title: 'SEM',
  },
  numberOfCells: {
    term: 'createdAt',
    title: 'N° Of CELLS',
  },
};

export const DEFAULT_FILTERS = [
  { field: 'name', type: 'checkList', value: [], title: 'Name' },
  { field: 'contributors', type: 'checkList', value: [], title: 'Contributors' },
  { field: 'description', type: 'checkList', value: [], title: 'Description' },
  { field: 'updatedAt', type: 'checkList', value: [], title: 'Updated At' },
  { field: 'createdBy', type: 'checkList', value: [], title: 'Created By' },
];

export const TYPE_FILTER_MAPPING: { [key: string]: Filter[] } = {
  'https://neuroshapes.org/BoutonDensity': [
    { field: 'mType', type: 'checkList', value: [], title: 'M-Type' },
    { field: 'brainRegion', type: 'checkList', value: [], title: 'Brain Region' },
    { field: 'boutonDensity', type: 'checkList', value: [], title: 'Bouton Density' },
    { field: 'conditions', type: 'checkList', value: [], title: 'Conditions' },
  ],
  'https://neuroshapes.org/Trace': [
    { field: 'eType', type: 'checkList', value: [], title: 'E-Type' },
    { field: 'brainRegion', type: 'checkList', value: [], title: 'Brain Region' },
    { field: 'conditions', type: 'checkList', value: [], title: 'Conditions' },
  ],
  'https://neuroshapes.org/LayerThickness': [
    { field: 'brainRegion', type: 'checkList', value: [], title: 'Brain Region' },
    { field: 'conditions', type: 'checkList', value: [], title: 'Conditions' },
  ],
  'https://neuroshapes.org/NeuronMorphology': [
    { field: 'mType', type: 'checkList', value: [], title: 'M-Type' },
    { field: 'brainRegion', type: 'checkList', value: [], title: 'Brain Region' },
    { field: 'conditions', type: 'checkList', value: [], title: 'Conditions' },
  ],
  'https://neuroshapes.org/NeuronDensity': [
    { field: 'eType', type: 'checkList', value: [], title: 'E-Type' },
    { field: 'mType', type: 'checkList', value: [], title: 'M-Type' },
    { field: 'brainRegion', type: 'checkList', value: [], title: 'Brain Region' },
    { field: 'neuronDensity', type: 'checkList', value: [], title: 'Density' },
    { field: 'conditions', type: 'checkList', value: [], title: 'Conditions' },
  ],
  'https://neuroshapes.org/SynapsePerConnection': [
    { field: 'eType', type: 'checkList', value: [], title: 'E-Type' },
    { field: 'mType', type: 'checkList', value: [], title: 'M-Type' },
    { field: 'brainRegion', type: 'checkList', value: [], title: 'Brain Region' },
    { field: 'neuronDensity', type: 'checkList', value: [], title: 'Density' },
    { field: 'boutonDensity', type: 'checkList', value: [], title: 'Bouton Density' },
    { field: 'conditions', type: 'checkList', value: [], title: 'Conditions' },
  ],
};

export const NO_DATA_STRING: string = 'N/A';
