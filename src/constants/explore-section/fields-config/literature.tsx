import { ExploreFieldsConfigProps } from '@/constants/explore-section/fields-config/types';
import { FilterTypeEnum } from '@/types/explore-section/filters';
import { Field } from '@/constants/explore-section/fields-config/enums';

export const LITERATURE_FIELDS_CONFIG: ExploreFieldsConfigProps = {
  [Field.Categories]: {
    title: 'Category',
    filter: FilterTypeEnum.Search,
    vocabulary: {
      plural: 'Categories',
      singular: 'Category',
    },
  },
  [Field.ArticleType]: {
    title: 'Article type',
    filter: FilterTypeEnum.Search,
    vocabulary: {
      plural: 'Article types',
      singular: 'Article type',
    },
  },
  [Field.Journal]: {
    title: 'Journal',
    filter: FilterTypeEnum.Search,
    vocabulary: {
      plural: 'Journals',
      singular: 'Journal',
    },
  },
  [Field.Authors]: {
    title: 'Authors',
    filter: FilterTypeEnum.Search,
    vocabulary: {
      plural: 'Authors',
      singular: 'Author',
    },
  },
  [Field.PublicationDate]: {
    title: 'Publication date',
    filter: FilterTypeEnum.DateRange,
    vocabulary: {
      plural: 'Publication dates',
      singular: 'Publication date',
    },
  },
};
