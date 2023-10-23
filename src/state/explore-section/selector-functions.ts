import find from 'lodash/find';
import { DeltaResource } from '@/types/explore-section/resources';
import { AnnotationEntity, Series } from '@/types/explore-section/fields';
import { ensureArray } from '@/util/nexus';
import { NO_DATA_STRING } from '@/constants/explore-section/queries';
import { formatNumber } from '@/util/common';

const seriesArrayFunc = (series: Series | Series[] | undefined) => series && ensureArray(series);

const annotationArrayFunc = (annotation: AnnotationEntity[] | undefined | null) =>
  annotation && ensureArray(annotation);

/**
 * Takes delta resource and extracts subject age
 * @param {import("./types/explore-section/resources").DeltaResource} detail
 */
export const subjectAgeSelectorFn = (detail: DeltaResource | null) => {
  if (detail?.subject?.age?.value) {
    return `${detail.subject?.age.value} ${detail.subject?.age.unitCode} ${detail.subject?.age.period}`;
  }
  if (detail?.subject?.age?.minValue && detail?.subject?.age?.maxValue) {
    return `${detail.subject?.age.minValue} - ${detail.subject?.age.maxValue} ${detail.subject?.age.unitCode} ${detail.subject?.age.period}`;
  }
  return undefined;
};

// renders mtype or 'no MType text if not present
export const mTypeSelectorFn = (detail: DeltaResource | null) => {
  const entity = find(
    annotationArrayFunc(detail?.annotation),
    (o: AnnotationEntity) => o.name === 'M-type Annotation'
  );
  return entity ? entity.hasBody?.label : NO_DATA_STRING;
};

// renders etype or 'no EType' text if not present
export const eTypeSelectorFn = (detail: DeltaResource | null) => {
  const entity = find(
    annotationArrayFunc(detail?.annotation),
    (o: AnnotationEntity) => o.name === 'E-type Annotation'
  );
  return entity ? entity.hasBody?.label : NO_DATA_STRING;
};

// renders standard error of the mean if present
export const semSelectorFn = (detail: DeltaResource | null) => {
  const seriesArray: Series[] | undefined = seriesArrayFunc(detail?.series);
  return seriesArray?.find((series) => series.statistic === 'standard error of the mean')?.value;
};

export const attrsSelectorFn = (
  detail: DeltaResource<{ attrs: { id: string; label: string } }> | null
) => {
  if (!detail?.attrs) return [];

  return Object.keys(detail?.attrs).map((attr) => ({
    id: attr,
    label: attr,
  }));
};

export const dimensionsSelectorFn = (
  detail: DeltaResource<{ coords: { dimension: { id: string; label: string } } }> | null
) => {
  if (!detail?.coords) return [];

  return Object.keys(detail.coords).map((dimension) => ({
    id: dimension,
    label: dimension,
  }));
};

/**
 * Serializes a series array based on its format and string targetting specific statistic
 * @param detail
 * @param field the field of series to render
 * @param withUnits whether to render units
 */
export const selectorFnStatisticDetail = (
  detail: DeltaResource,
  field: string,
  withUnits: boolean = false
): string | number => {
  if (!detail?.series) return NO_DATA_STRING;

  const found = ensureArray(detail?.series).find((el: Series) => el.statistic === field);
  const units = withUnits && found ? found.unitCode : '';
  return found ? `${formatNumber(found.value)} ${units}` : NO_DATA_STRING;
};
