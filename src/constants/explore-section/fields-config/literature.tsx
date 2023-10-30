import { ExploreFieldsConfigProps } from '@/constants/explore-section/fields-config/types';

export const LITERATURE_FIELDS_CONFIG: ExploreFieldsConfigProps = {
  categories: {
    title: 'Category',
    filter: 'search',
    vocabulary: {
      plural: 'Categories',
      singular: 'Category',
    },
  },
  articleType: {
    title: 'Article type',
    filter: 'search',
    vocabulary: {
      plural: 'Article types',
      singular: 'Article type',
    },
  },
  journal: {
    title: 'Journal',
    filter: 'search',
    vocabulary: {
      plural: 'Journals',
      singular: 'Journal',
    },
  },
  authors: {
    title: 'Authors',
    filter: 'search',
    vocabulary: {
      plural: 'Authors',
      singular: 'Author',
    },
  },
  publicationDate: {
    title: 'Publication date',
    filter: 'dateRange',
    vocabulary: {
      plural: 'Publication dates',
      singular: 'Publication date',
    },
  },
};
