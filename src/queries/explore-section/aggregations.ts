import { CheckListFilter, Filter } from '@/components/Filter/types';
import { ES_TERMS } from '@/constants/explore-section';

export default function buildAggregations(filters: Filter[]) {
  const createdBy = filters.find(({ field }) => field === 'createdBy');
  const createdByFilter = (createdBy as CheckListFilter).value.length && {
    terms: {
      'createdBy.keyword': createdBy?.value,
    },
  };

  const eType = filters.find(({ field }) => field === 'eType');
  const eTypeFilter = (eType as CheckListFilter).value.length && {
    terms: {
      [ES_TERMS.eType.term]: eType?.value,
    },
  };

  // Used for aggregations
  const createdByTerms = {
    terms: {
      field: 'createdBy.keyword',
    },
  };
  // Prepare filter, if one exists.
  const createdByAggs = {
    filter: eTypeFilter,
    aggs: {
      excludeOwnFilter: {
        ...createdByTerms,
      },
    },
  };

  // Used for aggregations
  const eTypeTerms = {
    terms: {
      field: 'eType.label.keyword',
      // min_doc_count: 0,
    },
  };
  // Prepare filter, if one exists.
  const eTypeAggs = {
    filter: createdByFilter,
    aggs: {
      excludeOwnFilter: {
        ...eTypeTerms,
      },
    },
  };

  const aggregations = {
    createdBy: {
      ...((eType as CheckListFilter).value.length ? createdByAggs : createdByTerms),
    },
    eType: {
      ...((createdBy as CheckListFilter).value.length ? eTypeAggs : eTypeTerms),
    },
  };

  return { aggregations, createdByFilter, eTypeFilter };
}
