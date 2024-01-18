import { ExploreFieldsConfigProps } from '@/constants/explore-section/fields-config/types';
import { FilterTypeEnum } from '@/types/explore-section/filters';

export const LITERATURE_FIELDS_CONFIG: ExploreFieldsConfigProps = {
  categories: {
    title: 'Category',
    filter: FilterTypeEnum.Search,
    vocabulary: {
      plural: 'Categories',
      singular: 'Category',
    },
  },
  articleType: {
    title: 'Article type',
    filter: FilterTypeEnum.Search,
    vocabulary: {
      plural: 'Article types',
      singular: 'Article type',
    },
  },
  journal: {
    title: 'Journal',
    filter: FilterTypeEnum.Search,
    vocabulary: {
      plural: 'Journals',
      singular: 'Journal',
    },
  },
  authors: {
    title: 'Authors',
    filter: FilterTypeEnum.Search,
    vocabulary: {
      plural: 'Authors',
      singular: 'Author',
    },
  },
  publicationDate: {
    title: 'Publication date',
    filter: FilterTypeEnum.DateRange,
    vocabulary: {
      plural: 'Publication dates',
      singular: 'Publication date',
    },
  },
};
