import find from 'lodash/find';
import { DeltaResource, Subject } from '@/types/explore-section/resources';
import { AnnotationEntity, Series } from '@/types/explore-section/fields';
import { ensureArray } from '@/util/nexus';
import { NO_DATA_STRING } from '@/constants/explore-section/queries';
import { formatNumber } from '@/util/common';

const seriesArrayFunc = (series: Series | Series[] | undefined) => series && ensureArray(series);

const annotationArrayFunc = (annotation: AnnotationEntity[] | undefined | null) =>
  annotation && ensureArray(annotation);

/**
 * Takes delta resource and extracts subject age
 * @param {import("./types/explore-section/resources").Subject} subject
 */
export const ageSelectorFn = (subject: Subject | null) => {
  if (subject?.age?.value) {
    return `${subject?.age.value} ${subject?.age.unitCode} ${subject?.age.period}`;
  }
  if (subject?.age?.minValue && subject?.age?.maxValue) {
    return `${subject?.age.minValue} to ${subject?.age.maxValue} ${subject?.age.unitCode} ${subject?.age.period}`;
  }

  return NO_DATA_STRING;
};

/**
 * Takes delta resource and extracts subject age
 * @param {import("./types/explore-section/resources").DeltaResource} detail
 */
export const subjectAgeSelectorFn = (detail: DeltaResource | null) => {
  return ageSelectorFn(detail?.subject || null);
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
  return (
    seriesArray?.find((series) => series.statistic === 'standard error of the mean')?.value ||
    NO_DATA_STRING
  );
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
