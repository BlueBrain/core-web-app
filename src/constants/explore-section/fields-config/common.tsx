import { format, parseISO } from 'date-fns';
import { DataType, DataTypeToNexusType } from '@/constants/explore-section/list-views';
import { ExploreFieldsConfigProps } from '@/constants/explore-section/fields-config/types';
import {
  selectorFnBasic,
  selectorFnContributors,
  selectorFnDate,
} from '@/util/explore-section/listing-selectors';
import Contributors from '@/components/explore-section/Contributors';
import PreviewThumbnail from '@/components/explore-section/ExploreSectionListingView/PreviewThumbnail';
import timeElapsedFromToday from '@/util/date';
import { FilterTypeEnum } from '@/types/explore-section/filters';
import { Field } from '@/constants/explore-section/fields-config/enums';
import {
  ExperimentalTrace,
  ReconstructedNeuronMorphology,
} from '@/types/explore-section/es-experiment';

const previewRender = ({
  distribution,
  '@type': experimentType,
}: ReconstructedNeuronMorphology | ExperimentalTrace) => {
  let previewType:
    | DataType.ExperimentalNeuronMorphology
    | DataType.ExperimentalElectroPhysiology
    | undefined;
  let encodingFormat: 'application/swc' | 'application/nwb';

  if (experimentType.includes(DataTypeToNexusType.ExperimentalNeuronMorphology)) {
    encodingFormat = 'application/swc';
    previewType = DataType.ExperimentalNeuronMorphology;
  } else if (experimentType.includes(DataTypeToNexusType.ExperimentalElectroPhysiology)) {
    encodingFormat = 'application/nwb';
    previewType = DataType.ExperimentalElectroPhysiology;
  }

  const contentUrl = distribution.reduce<string | undefined>(
    (acc, dist: { contentUrl: string; encodingFormat: string }) =>
      dist.encodingFormat === encodingFormat ? dist.contentUrl : acc,
    undefined
  );

  return (
    !!contentUrl &&
    !!previewType && (
      <PreviewThumbnail
        className="max-h-[116px] border border-neutral-2"
        contentUrl={contentUrl}
        height={116}
        type={previewType}
        width={184}
      />
    )
  );
};

export const COMMON_FIELDS_CONFIG: ExploreFieldsConfigProps = {
  [Field.Preview]: {
    className: 'text-center',
    title: 'Preview',
    filter: null,
    render: {
      esResourceViewFn: (_value, record) => {
        const { _source: source } = record;

        return previewRender(source);
      },
    },
    sorter: false,
    vocabulary: {
      plural: 'previews',
      singular: 'preview',
    },
    style: { width: 184 },
  },
  [Field.Name]: {
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
  [Field.Contributors]: {
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
  [Field.CreatedAt]: {
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
  [Field.CreatedBy]: {
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
  [Field.UpdatedAt]: {
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
  [Field.Description]: {
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
