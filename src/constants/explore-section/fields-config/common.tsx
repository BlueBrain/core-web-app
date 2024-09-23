import { format, parseISO } from 'date-fns';
import find from 'lodash/find';
import intersection from 'lodash/intersection';
import { Empty } from 'antd';

import { DataType, DataTypeToNexusType } from '@/constants/explore-section/list-views';
import {
  ExploreFieldsConfigProps,
  ExploreFieldConfig,
} from '@/constants/explore-section/fields-config/types';
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
import { Experiment as DeltaExperiment } from '@/types/explore-section/delta-experiment';
import { SimulationCampaign as DeltaSimulationCampaign } from '@/types/explore-section/delta-simulation-campaigns';
import {
  ExemplarMorphologyDataType as ExemplarMorphologyEModel,
  ExperimentalTracesDataType as ExperimentalTracesEModel,
} from '@/types/e-model';
import { DisplayMessages } from '@/constants/display-messages';

export const previewRender = ({
  distribution,
  '@type': experimentType,
}:
  | ReconstructedNeuronMorphology
  | ExperimentalTrace
  | ExperimentalTracesEModel
  | ExemplarMorphologyEModel) => {
  let previewType:
    | DataType.ExperimentalNeuronMorphology
    | DataType.ExperimentalElectroPhysiology
    | undefined;
  let encodingFormat: 'application/swc' | 'application/nwb' | undefined;

  if (
    intersection(
      [DataTypeToNexusType.ExperimentalNeuronMorphology, 'NeuronMorphology'],
      experimentType
    ).length
  ) {
    encodingFormat = 'application/swc';
    previewType = DataType.ExperimentalNeuronMorphology;
  } else if (
    intersection(
      [DataTypeToNexusType.ExperimentalElectroPhysiology, 'ExperimentalTrace'],
      experimentType
    ).length
  ) {
    encodingFormat = 'application/nwb';
    previewType = DataType.ExperimentalElectroPhysiology;
  }

  const contentUrl = Array.isArray(distribution)
    ? find(distribution, ['encodingFormat', encodingFormat])?.contentUrl
    : distribution.contentUrl;

  return !!contentUrl && !!previewType ? (
    <PreviewThumbnail
      className="max-h-[116px] border border-neutral-2"
      contentUrl={contentUrl}
      height={116}
      type={previewType}
      width={184}
    />
  ) : (
    <div className="flex h-[116px] w-[184px] items-center justify-start">
      <Empty description="Missing Image" image={Empty.PRESENTED_IMAGE_SIMPLE} />
    </div>
  );
};

function createdAtDateFieldConfig(
  title: string
): ExploreFieldConfig<DeltaExperiment | DeltaSimulationCampaign> {
  return {
    title,
    esTerms: {
      flat: {
        filter: 'createdAt',
        aggregation: 'createdAt',
        sort: 'createdAt',
      },
    },
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
  };
}

const RegistrationDateConfig = createdAtDateFieldConfig('Registration Date');
const CreationDateConfig = createdAtDateFieldConfig('Creation Date');

export const COMMON_FIELDS_CONFIG: ExploreFieldsConfigProps<
  DeltaExperiment | DeltaSimulationCampaign
> = {
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
        aggregation: 'contributors.label.keyword',
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
  [Field.RegistrationDate]: RegistrationDateConfig,
  [Field.CreationDate]: CreationDateConfig,
  [Field.CreatedAt]: RegistrationDateConfig,
  [Field.CreatedBy]: {
    title: 'Created by',
    esTerms: {
      flat: {
        filter: 'createdBy.keyword',
        sort: 'createdBy.keyword',
        aggregation: 'createdBy.keyword',
      },
    },
    filter: FilterTypeEnum.CheckList,
    render: {
      deltaResourceViewFn: (resource) => (
        <span className="capitalize">{resource?._createdBy.split('/').reverse()[0]}</span>
      ),
      esResourceViewFn: (_t, r) => (
        <span className="capitalize">{r._source?.createdBy?.split('/').reverse()[0]}</span>
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
    filter: FilterTypeEnum.Text,
    render: {
      esResourceViewFn: (_t, r) => selectorFnBasic(r._source?.description),
      deltaResourceViewFn: (resource) => resource.description || DisplayMessages.NO_DATA_STRING,
    },
    esTerms: {
      flat: {
        filter: 'description',
        aggregation: 'description',
        sort: 'description',
      },
    },
    vocabulary: {
      plural: 'Descriptions',
      singular: 'Description',
    },
  },
};
