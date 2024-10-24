import { atlasReleaseResource } from '@/config';

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

// This expects a name.ngramtext and description.ngramtext field(s) to be defined in the ES index,
// which is a custom configuration for the KG `dataset` index.
export function createSearchStringQuery(searchString: string) {
  if (!searchString) return undefined;

  return {
    bool: {
      should: [
        {
          multi_match: {
            query: searchString,
            type: 'most_fields',
            fields: ['name^3', 'description^2'],
            fuzziness: 'AUTO',
            operator: 'and',
          },
        },
        {
          multi_match: {
            query: searchString,
            type: 'most_fields',
            fields: ['name.ngramtext^2', 'description.ngramtext'],
            operator: 'and',
            boost: 10,
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
      ],
      must: createSearchStringQuery(searchString),
    },
  },
  sort: searchString ? undefined : [defaultCreationDateSort],
});

export const getEModelQuery = (searchString: string = '') => ({
  size: DEFAULT_SIZE,
  query: {
    bool: {
      filter: [
        {
          bool: {
            must: [
              { term: { _deprecated: false } },
              { term: { '@type': 'EModel' } },
              { term: { curated: true } },
            ],
          },
        },
        idExistsFilter,
      ],
      must: createSearchStringQuery(searchString),
    },
  },
});

export const getEModelOptimizationConfigQuery = () => ({
  size: DEFAULT_SIZE,
  query: {
    bool: {
      filter: [
        {
          bool: {
            must: [
              { term: { _deprecated: false } },
              { term: { '@type': 'EModelOptimizationConfig' } },
            ],
          },
        },
      ],
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
      ],
      must: createSearchStringQuery(searchString),
    },
  },
  sort: searchString ? undefined : [defaultCreationDateSort],
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
      ],
      must: createSearchStringQuery(searchString),
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
          term: { '@type': 'Mesh' },
        },
        {
          term: { 'atlasRelease.@id': atlasReleaseResource.id },
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
        { term: { 'used_config.@id.keyword': configId } },
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
      ],
      must: createSearchStringQuery(searchString),
    },
  },
  sort: [defaultCreationDateSort],
});

export const getSynapseConfigsQuery = () => ({
  size: DEFAULT_SIZE,
  query: {
    bool: {
      filter: [
        {
          bool: {
            must: [{ term: { _deprecated: false } }, { term: { '@type': 'SynapseConfig' } }],
          },
        },
      ],
    },
  },
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
      ],
      must: createSearchStringQuery(searchString),
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
      ],
      must: createSearchStringQuery(searchString),
    },
  },
  sort: [defaultCreationDateSort],
});

export const getSimCampUIConfigsByNameQuery = (name: string) => ({
  size: DEFAULT_SIZE,
  query: {
    bool: {
      filter: [
        {
          bool: {
            must: [
              { term: { _deprecated: false } },
              { term: { '@type': 'SimulationCampaignUIConfig' } },
              { term: { 'name.keyword': name } },
            ],
          },
        },
        idExistsFilter,
      ],
    },
  },
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

export const getLaunchedSimCampQuery = (username: string, searchString: string) => ({
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
              { exists: { field: 'wasInfluencedBy.@id' } },
            ],
          },
        },
        idExistsFilter,
      ],
      must: createSearchStringQuery(searchString),
    },
  },
});

export const getWorkflowExecutionsQuery = (ids: string[] = []) => ({
  size: 5,
  query: {
    bool: {
      filter: [
        {
          bool: {
            must: [
              { term: { _deprecated: false } },
              { term: { '@type': 'WorkflowExecution' } },
              { terms: { '@id': ids } },
            ],
          },
        },
      ],
    },
  },
  sort: [{ startedAtTime: 'desc' }],
});

export const getEntityListByIdsQuery = (entityType: string, ids: string[]) => ({
  size: DEFAULT_SIZE,
  query: {
    bool: {
      must: [{ term: { '@type': entityType } }, { terms: { '@id': ids } }],
    },
  },
});

export function buildESReportsQuery(simId: string, name?: string, ids?: string[]) {
  if (ids)
    return {
      size: DEFAULT_SIZE,
      query: {
        terms: {
          '@id.keyword': ids,
        },
      },
    }; // Fetch all reports by provided id's

  const query: {
    size: number;
    query: {
      bool: {
        must: (
          | { match: { [key: string]: string | string[] } }
          | { wildcard: { [key: string]: { value: string } } }
        )[];
      };
    };
  } = {
    size: DEFAULT_SIZE,
    query: {
      bool: {
        must: [
          {
            match: {
              'derivation.identifier.keyword': simId,
            },
          },
          {
            wildcard: {
              name: {
                value: name || '*',
              },
            },
          },
        ],
      },
    },
  }; // Fetch all reports beloging to simulation Id and name

  return query;
}

export const getLicenseByIdQuery = (licenseId: string) => ({
  size: 1,
  query: {
    bool: {
      must: [
        { term: { '@type': 'License' } },
        { term: { '@id': licenseId } },
        { term: { _deprecated: false } },
      ],
    },
  },
});

export const getPaperListQuery = (searchString: string = '') => ({
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
            must: { term: { '@type': 'ScholarlyArticle' } },
          },
        },
        idExistsFilter,
      ],
      must: createSearchStringQuery(searchString),
    },
  },
  sort: searchString ? undefined : [defaultCreationDateSort],
});

export const getNotValidatedMEModelQuery = (username: string) => ({
  size: DEFAULT_SIZE,
  query: {
    bool: {
      filter: [
        {
          bool: {
            must: [
              { term: { _deprecated: false } },
              { term: { '@type': 'MEModel' } },
              { term: { _createdBy: `https://bbp.epfl.ch/nexus/v1/realms/bbp/users/${username}` } },
            ],
          },
        },
      ],
    },
  },
});

export const getPaperCountQuery = () => ({
  size: 0,
  query: {
    bool: {
      filter: [
        {
          bool: {
            must: [{ term: { _deprecated: false } }, { term: { '@type': 'ScholarlyArticle' } }],
          },
        },
      ],
    },
  },
  aggs: {
    total: {
      value_count: {
        field: '_index',
      },
    },
  },
});

export const getSimulationsPerModelQuery = ({
  modelId,
  type,
}: {
  modelId: string;
  type: 'SingleNeuronSimulation' | 'SynaptomeSimulation';
}) => ({
  size: DEFAULT_SIZE,
  query: {
    bool: {
      filter: [
        {
          bool: {
            must: [
              { term: { _deprecated: false } },
              { term: { '@type': type } },
              { term: { 'used.@id.keyword': modelId } },
            ],
          },
        },
      ],
    },
  },
});
