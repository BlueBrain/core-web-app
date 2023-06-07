const DEFAULT_SIZE = 1000;

const idExistsFilter = {
  bool: {
    must: {
      exists: {
        field: '@id',
      },
    },
  },
};

// This expects a <field>.ngramtext field(s) to be defined in the ES index,
// which is a custom configuration for the KG `dataset` index.
export function createSearchStringQueryFilter(searchString: string, fields: string[]) {
  return {
    bool: {
      should: [
        {
          multi_match: {
            query: searchString,
            type: 'most_fields',
            fields,
            fuzziness: 'AUTO',
            operator: 'and',
            boost: 10,
          },
        },
        {
          multi_match: {
            query: searchString,
            type: 'most_fields',
            fields: fields.map((field) => `${field}.ngramtext`),
            fuzziness: 'AUTO',
          },
        },
      ],
    },
  };
}

export const getPublicBrainModelConfigsQuery = (searchString: string = '') => ({
  size: DEFAULT_SIZE,
  query: {
    bool: {
      filter: [
        {
          bool: {
            must: { term: { _deprecated: false } },
          },
        },
        {
          bool: {
            must: { term: { '@type': 'ModelBuildingConfig' } },
          },
        },
        idExistsFilter,
        searchString ? createSearchStringQueryFilter(searchString, ['name', 'description']) : null,
      ].filter(Boolean),
    },
  },
});

export const getPersonalBrainModelConfigsQuery = (username: string, searchString: string = '') => ({
  size: DEFAULT_SIZE,
  query: {
    bool: {
      filter: [
        {
          bool: {
            must: { term: { _deprecated: false } },
          },
        },
        {
          bool: {
            must: { term: { '@type': 'ModelBuildingConfig' } },
          },
        },
        {
          bool: {
            must: {
              term: { _createdBy: `https://bbp.epfl.ch/nexus/v1/realms/bbp/users/${username}` },
            },
          },
        },
        idExistsFilter,
        searchString ? createSearchStringQueryFilter(searchString, ['name', 'description']) : null,
      ].filter(Boolean),
    },
  },
});

export const getArchiveBrainModelConfigsQuery = (searchString: string = '') => ({
  size: DEFAULT_SIZE,
  query: {
    bool: {
      filter: [
        {
          bool: {
            must: { term: { _deprecated: true } },
          },
        },
        {
          bool: {
            must: { term: { '@type': 'ModelBuildingConfig' } },
          },
        },
        idExistsFilter,
        searchString ? createSearchStringQueryFilter(searchString, ['name', 'description']) : null,
      ].filter(Boolean),
    },
  },
});

export const getEntitiesByIdsQuery = (ids: string[]) => ({
  size: DEFAULT_SIZE,
  query: {
    bool: {
      filter: [
        {
          bool: {
            must: { term: { _deprecated: false } },
          },
        },
        {
          bool: {
            must: { terms: { '@id': ids } },
          },
        },
        idExistsFilter,
      ],
    },
  },
});

export const getBrainModelConfigsByNameQuery = (name: string) => ({
  size: DEFAULT_SIZE,
  query: {
    bool: {
      filter: [
        {
          bool: {
            must: { term: { _deprecated: false } },
          },
        },
        {
          bool: {
            must: { term: { '@type': 'ModelBuildingConfig' } },
          },
        },
        {
          bool: {
            must: { term: { 'name.keyword': name } },
          },
        },
        idExistsFilter,
      ],
    },
  },
});

export const getAtlasReleaseMeshesQuery = () => ({
  size: 10000,
  query: {
    bool: {
      must: [
        {
          match: {
            '@type': 'Mesh',
          },
        },
        {
          match: {
            'atlasRelease.@id':
              'https://bbp.epfl.ch/neurosciencegraph/data/4906ab85-694f-469d-962f-c0174e901885',
          },
        },
      ],
    },
  },
});

export const getGeneratorTaskActivityQuery = (configId: string, configRev: number) => ({
  query: {
    bool: {
      must: [
        { term: { '@type': 'GeneratorTaskActivity' } },
        { term: { 'used.@id.keyword': configId } },
        { term: { used_rev: configRev } },
      ],
    },
  },
});

export const getVariantTaskActivityByCircuitIdQuery = (circuitId: string) => ({
  query: {
    bool: {
      must: [
        { term: { '@type': 'VariantTaskActivity' } },
        { term: { 'generated.@id.keyword': circuitId } },
      ],
    },
  },
});

export const getGeneratorTaskActivitiesQuery = () => ({
  size: DEFAULT_SIZE,
  query: {
    bool: {
      filter: [
        {
          bool: {
            must: [
              { term: { _deprecated: false } },
              { term: { '@type': 'GeneratorTaskActivity' } },
            ],
          },
        },
      ],
    },
  },
});

const defaultCreationDateSort = { _createdAt: 'desc' };

export const getBuiltBrainModelConfigsQuery = (
  searchString: string,
  synapseConfigIds: string[]
) => ({
  size: DEFAULT_SIZE,
  query: {
    bool: {
      filter: [
        {
          bool: {
            must: [
              { term: { _deprecated: false } },
              { term: { '@type': 'ModelBuildingConfig' } },
              { terms: { 'configs.synapseConfig.@id.keyword': synapseConfigIds } },
            ],
          },
        },
        idExistsFilter,
        searchString ? createSearchStringQueryFilter(searchString, ['name', 'description']) : null,
      ].filter(Boolean),
    },
  },
  sort: [defaultCreationDateSort],
});

export const getSimCampConfigsQuery = (searchString: string) => ({
  size: DEFAULT_SIZE,
  query: {
    bool: {
      filter: [
        {
          bool: {
            must: [
              { term: { _deprecated: false } },
              { term: { '@type': 'SimulationCampaignUIConfig' } },
            ],
          },
        },
        idExistsFilter,
        searchString ? createSearchStringQueryFilter(searchString, ['name', 'description']) : null,
      ].filter(Boolean),
    },
  },
  sort: [defaultCreationDateSort],
});

export const getPersonalSimCampConfigsQuery = (username: string, searchString: string = '') => ({
  size: DEFAULT_SIZE,
  query: {
    bool: {
      filter: [
        {
          bool: {
            must: [
              { term: { _deprecated: false } },
              { term: { '@type': 'SimulationCampaignUIConfig' } },
              { term: { _createdBy: `https://bbp.epfl.ch/nexus/v1/realms/bbp/users/${username}` } },
            ],
          },
        },
        idExistsFilter,
        searchString ? createSearchStringQueryFilter(searchString, ['name', 'description']) : null,
      ].filter(Boolean),
    },
  },
  sort: [defaultCreationDateSort],
});

export const getGeneratorTaskActivityByCircuitIdQuery = (detailedCircuitId: string) => ({
  size: DEFAULT_SIZE,
  query: {
    bool: {
      filter: [
        {
          bool: {
            must: [
              { term: { _deprecated: false } },
              { term: { '@type': 'GeneratorTaskActivity' } },
              { term: { 'generated.@id.keyword': detailedCircuitId } },
            ],
          },
        },
      ],
    },
  },
});
