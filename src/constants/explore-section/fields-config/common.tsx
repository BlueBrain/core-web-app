import { format, parseISO } from 'date-fns';
import { ExploreFieldsConfigProps } from '@/constants/explore-section/fields-config/types';
import {
  selectorFnBasic,
  selectorFnContributors,
  selectorFnDate,
} from '@/state/explore-section/listing-selectors';
import Contributors from '@/components/explore-section/Contributors';
import timeElapsedFromToday from '@/util/date';

export const COMMON_FIELDS_CONFIG: ExploreFieldsConfigProps = {
  name: {
    esTerms: {
      flat: {
        filter: 'name.keyword',
        sort: 'name.keyword',
      },
    },
    title: 'Name',
    filter: null,
    render: {
      listingViewFn: (_t, r) => selectorFnBasic(r._source?.name),
    },
    vocabulary: {
      plural: 'Names',
      singular: 'Name',
    },
  },
  contributors: {
    esTerms: {
      flat: {
        filter: 'contributors.@id.keyword',
        aggregation: 'contributors',
        sort: 'contributors.label.keyword',
      },
    },
    title: 'Contributors',
    filter: 'checkList',
    render: {
      listingViewFn: selectorFnContributors,
      detailViewFn: () => <Contributors />,
    },
    vocabulary: {
      plural: 'Contributors',
      singular: 'Contributor',
    },
  },
  createdAt: {
    esTerms: {
      flat: {
        filter: 'createdAt',
        aggregation: 'createdAt',
        sort: 'createdAt',
      },
    },
    title: 'Creation date',
    filter: 'dateRange',
    render: {
      listingViewFn: (_t, r) => selectorFnDate(r._source?.createdAt),
      detailViewFn: (resource) =>
        resource._createdAt && format(parseISO(resource._createdAt), 'dd.MM.yyyy'),
    },
    vocabulary: {
      plural: 'Dates',
      singular: 'Date',
    },
  },
  createdBy: {
    title: 'Created by',
    filter: 'checkList',
    render: {
      detailViewFn: (resource) => (
        <span className="capitalize">{resource?._createdBy.split('/').reverse()[0]}</span>
      ),
    },
    vocabulary: {
      plural: 'Users',
      singular: 'User',
    },
  },
  updatedAt: {
    title: 'Updated at',
    filter: 'dateRange',
    render: {
      listingViewFn: (_t, r) => selectorFnDate(r._source?.updatedAt),
      detailViewFn: (resource) => resource._updatedAt && timeElapsedFromToday(resource?._updatedAt),
    },
    vocabulary: {
      plural: 'Dates',
      singular: 'Date',
    },
  },
  description: {
    title: 'Description',
    filter: 'checkList',
    render: {
      detailViewFn: (resource) => resource.description,
    },
    vocabulary: {
      plural: 'Descriptions',
      singular: 'Description',
    },
  },
};
