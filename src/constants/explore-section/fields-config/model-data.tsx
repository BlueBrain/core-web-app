import { NO_DATA_STRING } from '../queries';
import { ExploreFieldsConfigProps } from './types';
import { Field } from './enums';
import { FilterTypeEnum } from '@/types/explore-section/filters';
import { Model } from '@/types/explore-section/delta-model';
import { formatNumber } from '@/util/common';
import EModelTracePreview from '@/components/explore-section/ExploreSectionListingView/EModelTracePreview';
import { EModel } from '@/types/e-model';

export const MODEL_DATA_FIELDS_CONFIG: ExploreFieldsConfigProps<Model> = {
  [Field.EModelMorphology]: {
    title: 'Morphology',
    filter: FilterTypeEnum.CheckList,
    esTerms: {
      flat: {
        filter: 'emodel.neuronMorphology.name.keyword',
        aggregation: 'emodel.neuronMorphology.name.keyword',
        sort: 'emodel.neuronMorphology.name.keyword',
      },
    },
    render: {
      esResourceViewFn: (_t, r) => r._source.emodel?.neuronMorphology?.name || NO_DATA_STRING,
    },
    vocabulary: {
      plural: 'Morphology',
      singular: 'Morphologies',
    },
  },
  [Field.EModelScore]: {
    title: 'Model cumulated score',
    filter: FilterTypeEnum.ValueRange,
    esTerms: {
      flat: {
        filter: 'emodel.score',
        aggregation: 'emodel.score',
        sort: 'emodel.score',
      },
    },
    render: {
      esResourceViewFn: (_t, r) =>
        r._source.emodel?.score ? formatNumber(r._source.emodel?.score) : NO_DATA_STRING,
      deltaResourceViewFn: (resource) =>
        resource.score ? formatNumber(resource.score) : NO_DATA_STRING,
    },
    vocabulary: {
      plural: 'Model cumulated score',
      singular: 'Model cumulated scores',
    },
  },
  [Field.EModelResponse]: {
    className: 'text-center',
    title: 'Response',
    filter: null,
    render: {
      esResourceViewFn: (_value, record) => {
        const { _source: source } = record;

        const images = (source as EModel)?.image;
        return <EModelTracePreview images={images} height={116} width={184} />;
      },
    },
    vocabulary: {
      plural: 'responses',
      singular: 'response',
    },
    style: { width: 184 },
  },
};
