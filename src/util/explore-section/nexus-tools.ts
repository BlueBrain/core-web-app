import get from 'lodash/get';
import { DeltaResource } from '@/types/explore-section/resources';

import { Distribution } from '@/types/nexus/common';

interface ParsedNexusUrl {
  deployment: string;
  entityType: string;
  org: string;
  project: string;
  schema: string;
  id: string;
}

const nexusEntities = ['orgs', 'projects', 'acls', 'views', 'resources', 'files'];

const nexusUrlR = new RegExp(
  [
    '^',
    '(https?://.+)', // nexus deployment
    '/',
    `(${nexusEntities.join('|')})`, // entity type
    '/',
    '([^/]+)', // org
    '/',
    '([^/]+)', // proj
    '/?',
    '([^/]+)?', // schema [optional]
    '/?',
    '([^/]+)?', // id [optional]
    '/?',
    '$',
  ].join('')
);

/**
 * With given Nexus URL (might be self/project/id url), return it's:
 * * deployment URL
 * * entity type
 * * org label
 * * project label
 * * id
 *
 * @param nexusUrl
 */
export const parseUrl = (nexusUrl: string): ParsedNexusUrl => {
  if (!nexusUrl) throw new Error('selfUrl should be defined');

  const mulEntityTypeR = new RegExp(`(${nexusEntities.join('|')})`, 'g');
  const mulEntityTypeMatch = nexusUrl.match(mulEntityTypeR);
  if (mulEntityTypeMatch && mulEntityTypeMatch.length > 1) {
    throw new Error('Url contains multiple entity types which is not supported');
  }

  const matches = nexusUrl.match(nexusUrlR);
  if (!matches || matches.length <= 5) {
    throw new Error('Error while parsing selfUrl');
  }

  return {
    deployment: matches[1],
    entityType: matches[2].slice(0, -1),
    org: matches[3],
    project: matches[4],
    schema: matches[5],
    id: matches[6],
  };
};

export interface Binding {
  [filterName: string]: { type: string; value: string };
}

export type SparqlQueryResults = {
  head: {
    vars: string[];
  };
  results: {
    bindings: Binding[];
  };
};

export type SparqlMapping = {
  source: string;
  target: string;
  defaultVal?: any;
};

export type SparqlMapperConfig = {
  mappings: SparqlMapping[];
};

// Transform Sparql results into a collection with properties from mapping config
// and optional default values.
export const mapSparqlResults = (
  queryResults: SparqlQueryResults,
  config: SparqlMapperConfig
): { [target: string]: any }[] => {
  if (!queryResults || !queryResults.results.bindings) return [];

  return queryResults.results.bindings.map((binding) => {
    const reduceFn = (acc: {}, mapping: SparqlMapping) => ({
      ...acc,
      ...{
        [mapping.target]: get(binding, `${mapping.source}.value`, mapping.defaultVal),
      },
    });

    return config.mappings.reduce(reduceFn, {});
  });
};

// TODO: add the rest (png, jpeg, etc.)
const VIEWABLE_ENCODING_FORMATS = ['application/pdf', 'application/json'];

export const isViewable = (distribution?: Distribution) =>
  distribution ? VIEWABLE_ENCODING_FORMATS.includes(distribution.encodingFormat) : false;

const ENCODING_FORMAT_LABEL: { [format: string]: string } = {
  'application/pdf': 'PDF',
  'application/json': 'JSON',
  'application/x-hdf5': 'HDF5',
};

export const distributionFormatLabel = (distribution: Distribution): string =>
  ENCODING_FORMAT_LABEL[distribution.encodingFormat] ||
  distribution.encodingFormat.split('/').slice(-1)[0];

// TODO improve type
export const propAsArray = <T>(
  resource: DeltaResource<{ [key: string]: any }>,
  key: string
): [T] => (Array.isArray(resource[key]) ? resource[key] : [resource[key]]);

// For getting the last part of a uri path as a title or label
export const labelOf = (inputString: string) => {
  const slash = inputString.substring(inputString.lastIndexOf('/') + 1);
  const title = slash.substring(slash.lastIndexOf('#') + 1);
  return title;
};
