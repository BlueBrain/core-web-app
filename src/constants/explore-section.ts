import { nexus } from '@/config';

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

export const ES_TERMS: { [key: string]: { term: string; title: string } } = {
  brainRegion: {
    term: 'brainRegion.label.keyword',
    title: 'Brain region',
  },
  eType: {
    term: 'eType.label.keyword',
    title: 'E-Type',
  },
  mType: {
    term: 'mType.label.keyword',
    title: 'M-Type',
  },
  name: {
    term: 'name.keyword',
    title: 'Data',
  },
  subjectSpecies: {
    term: 'subjectSpecies.label.keyword',
    title: 'Species',
  },
  contributors: {
    term: 'contributors.label.keyword',
    title: 'Contributor(s)',
  },
  neuronDensity: {
    term: 'neuronDensity.label.keyword',
    title: 'Neuron density',
  },
  boutonDensity: {
    term: 'boutonDensity.label.keyword',
    title: 'Bouton density',
  },
  layerThickness: {
    term: 'layerThickness.label.keyword',
    title: 'Layer thickness',
  },
  circuitType: {
    term: 'circuitType.keyword',
    title: 'Circuit type',
  },
  createdAt: {
    term: 'createdAt',
    title: 'Created at',
  },
  updatedAt: {
    term: 'updatedAt',
    title: 'Updated at',
  },
  reference: {
    term: 'reference.keyword',
    title: 'Reference',
  },
  conditions: {
    term: 'conditions.keyword',
    title: 'Conditions',
  },
};
