import { format, parseISO } from 'date-fns';
import { ExploreFieldsConfigProps } from '@/constants/explore-section/fields-config/types';
import {
  selectorFnBasic,
  selectorFnContributors,
  selectorFnDate,
} from '@/util/explore-section/listing-selectors';
import Contributors from '@/components/explore-section/Contributors';
import MorphoThumbnail from '@/components/explore-section/ExploreSectionListingView/MorphoThumbnail';
import timeElapsedFromToday from '@/util/date';
import { FilterTypeEnum } from '@/types/explore-section/filters';

export const COMMON_FIELDS_CONFIG: ExploreFieldsConfigProps = {
  preview: {
    className: 'text-center',
    title: 'Preview',
    filter: null,
    render: {
      esResourceViewFn: ({ _source: source }) => {
        const { distribution } = source;
        const swcDistribution = distribution.find(
          (dist: { contentUrl: string; encodingFormat: string }) =>
            dist.encodingFormat === 'application/swc'
        );
        const { contentUrl } = swcDistribution;

        return (
          <MorphoThumbnail
            className="max-h-[116px] border border-neutral-2"
            contentUrl={contentUrl}
            height={116}
            width={184}
          />
        );
      },
    },
    sorter: false,
    vocabulary: {
      plural: 'previews',
      singular: 'preview',
    },
    style: { width: 184 },
  },
  name: {
    esTerms: {
      flat: {
        filter: 'name.keyword',
        sort: 'name.keyword',
      },
    },
    title: 'Name',
    filter: FilterTypeEnum.Text,
    render: {
      esResourceViewFn: (_t, r) => selectorFnBasic(r._source?.name),
    },
    vocabulary: {
      plural: 'Names',
      singular: 'Name',
    },
  },
  contributors: {
    esTerms: {
      flat: {
        filter: 'contributors.label.keyword',
        aggregation: 'contributors',
        sort: 'contributors.label.keyword',
      },
    },
    title: 'Contributors',
    filter: FilterTypeEnum.CheckList,
    render: {
      esResourceViewFn: selectorFnContributors,
      deltaResourceViewFn: () => <Contributors />,
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
    title: 'Registration date',
    filter: FilterTypeEnum.DateRange,
    render: {
      esResourceViewFn: (_t, r) => selectorFnDate(r._source?.createdAt),
      deltaResourceViewFn: (resource) =>
        resource._createdAt && format(parseISO(resource._createdAt), 'dd.MM.yyyy'),
    },
    vocabulary: {
      plural: 'Dates',
      singular: 'Date',
    },
  },
  createdBy: {
    title: 'Created by',
    filter: FilterTypeEnum.CheckList,
    render: {
      deltaResourceViewFn: (resource) => (
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
    filter: FilterTypeEnum.DateRange,
    render: {
      esResourceViewFn: (_t, r) => selectorFnDate(r._source?.updatedAt),
      deltaResourceViewFn: (resource) =>
        resource._updatedAt && timeElapsedFromToday(resource?._updatedAt),
    },
    vocabulary: {
      plural: 'Dates',
      singular: 'Date',
    },
  },
  description: {
    title: 'Description',
    filter: FilterTypeEnum.CheckList,
    render: {
      deltaResourceViewFn: (resource) => resource.description,
    },
    vocabulary: {
      plural: 'Descriptions',
      singular: 'Description',
    },
  },
};
