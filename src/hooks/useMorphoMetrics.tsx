import omit from 'lodash/omit';
import { MorphoMetricCompartment } from '@/types/explore-section/es-experiment';
import { getGroupedCardFields } from '@/util/explore-section/cardViewUtils';
import { DataType } from '@/constants/explore-section/list-views';
import { DetailProps } from '@/types/explore-section/application';
import { isNeuronMorphologyFeatureAnnotation } from '@/util/explore-section/typeUnionTargetting';
import EXPLORE_FIELDS_CONFIG from '@/constants/explore-section/fields-config';
import { FlattenedExploreESResponse } from '@/types/explore-section/es';
import { ExploreSectionResource } from '@/types/explore-section/resources';
import { NO_DATA_STRING } from '@/constants/explore-section/queries';

export const useMorphometrics = (
  dataType: DataType,
  metrics?: FlattenedExploreESResponse<ExploreSectionResource>['hits'] | null,
  showLabel?: boolean
) => {
  const groupedCardFields = getGroupedCardFields(dataType);

  const filteredGroupedCardFields = omit(groupedCardFields, 'Metadata');

  const renderMetric = (metricType: MorphoMetricCompartment, field: DetailProps) => {
    if (!metrics) return null;

    const fieldObj = EXPLORE_FIELDS_CONFIG[field.field];
    const metricSource = metrics?.find((metric) =>
      metric?._source && isNeuronMorphologyFeatureAnnotation(metric._source)
        ? metric._source.compartment === metricType
        : -1
    );

    return (
      <div className="mr-10 text-primary-8">
        {showLabel && <div className="uppercase text-neutral-4">{fieldObj.title}</div>}
        <div className={`${showLabel ? 'mt-2' : 'ml-6 mt-0'}`}>
          <div key={field.field} className={`mb-2 h-6 truncate ${field.className}`}>
            {metricSource
              ? fieldObj?.render?.esResourceViewFn?.('text', metricSource)
              : NO_DATA_STRING}
          </div>
        </div>
      </div>
    );
  };

  return { groupedCardFields, filteredGroupedCardFields, renderMetric };
};
