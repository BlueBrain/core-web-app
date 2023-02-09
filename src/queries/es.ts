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

export const getPublicBrainModelConfigsQuery = () => ({
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
    },
  },
});

export const getPersonalBrainModelConfigsQuery = (searchString: string, username: string) => ({
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
    },
  },
});

export const getArchiveBrainModelConfigsQuery = () => ({
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
