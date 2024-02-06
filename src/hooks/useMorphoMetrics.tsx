import omit from 'lodash/omit';
import { MorphoMetricCompartment } from '@/types/explore-section/es-experiment';
import { getGroupedCardFields } from '@/util/explore-section/cardViewUtils';
import { DataType } from '@/constants/explore-section/list-views';
import { DetailProps } from '@/types/explore-section/application';
import { isNeuronMorphologyFeatureAnnotation } from '@/util/explore-section/typeUnionTargetting';
import EXPLORE_FIELDS_CONFIG from '@/constants/explore-section/fields-config';
import { FlattenedExploreESResponse } from '@/types/explore-section/es';

export const useMorphometrics = (
  dataType: DataType,
  metrics?: FlattenedExploreESResponse['hits'] | null,
  showLabel?: boolean
) => {
  const groupedCardFields = getGroupedCardFields(dataType);

  const filteredGroupedCardFields = omit(groupedCardFields, 'Metadata');

  const renderMetric = (metricType: MorphoMetricCompartment, field: DetailProps) => {
    if (!metrics) return null;

    const fieldObj = EXPLORE_FIELDS_CONFIG[field.field];

    return (
      <div className="mr-10 text-primary-8">
        {showLabel && <div className="uppercase text-neutral-4">{fieldObj.title}</div>}
        <div className={`${showLabel ? 'mt-2' : 'ml-6 mt-0'}`}>
          <div key={field.field} className={`mb-2 h-6 truncate ${field.className}`}>
            {fieldObj?.render?.esResourceViewFn?.(
              'text',
              metrics.find((metric) =>
                isNeuronMorphologyFeatureAnnotation(metric._source)
                  ? metric._source.compartment === metricType
                  : -1
              )
            )}
          </div>
        </div>
      </div>
    );
  };

  return { groupedCardFields, filteredGroupedCardFields, renderMetric };
};
