import esb, { Sort } from 'elastic-builder';
import LISTING_CONFIG from '@/constants/explore-section/es-terms-render';

type ElasticsearchNestedSort = Array<{
  [field: string]: {
    order: 'asc' | 'desc';
    mode: 'min' | 'max';
    nested: {
      path: string;
      filter: {
        term: {
          [nestedField: string]: string;
        };
      };
    };
  };
}>;

function buildESSort({
  field,
  order,
}: {
  field: string;
  order: 'asc' | 'desc';
}): Sort | ElasticsearchNestedSort {
  const { nestedField } = LISTING_CONFIG[field];
  if (!nestedField) {
    return esb.sort(LISTING_CONFIG[field as keyof typeof LISTING_CONFIG].term as string, order);
  }

  return [
    {
      [`${nestedField.nestField}.value`]: {
        order,
        mode: 'min',
        nested: {
          path: nestedField.nestField,
          filter: {
            term: {
              [nestedField.extendedField]: nestedField.field,
            },
          },
        },
      },
    },
  ];
}

export default buildESSort;
