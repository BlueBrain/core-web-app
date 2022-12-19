export const getPublicBrainModelConfigsQuery = () => ({
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
      ],
    },
  },
});

export const getPersonalBrainModelConfigsQuery = (searchString: string, username: string) => ({
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
      ],
    },
  },
});

export const getArchiveBrainModelConfigsQuery = () => ({
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
      ],
    },
  },
});

export const getEntitiesByIdsQuery = (ids: string[]) => ({
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
      ],
    },
  },
});
