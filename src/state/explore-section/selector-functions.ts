import find from 'lodash/find';
import { AnnotationEntity, DeltaResource, Series } from '@/types/explore-section';
import { ensureArray } from '@/util/nexus';

const seriesArrayFunc = (series: Series | Series[] | undefined) => series && ensureArray(series);

const annotationArrayFunc = (annotation: AnnotationEntity[] | undefined | null) =>
  annotation && ensureArray(annotation);

/**
 * Takes delta resource and extracts subject age
 * @param {import("./types/explore-section").DeltaResource} detail
 */
export const subjectAgeSelectorFn = (detail: DeltaResource | null) =>
  detail?.subject?.age &&
  `${detail.subject?.age.value} ${detail.subject?.age.unitCode} ${detail.subject?.age.period}`;

/**
 * Takes delta resource and extracts subject species
 * @param {import("./types/explore-section").DeltaResource} detail
 */
export const subjectSpeciesSelectorFn = (detail: DeltaResource | null) =>
  detail?.subject?.species?.label;

// renders mtype or 'no MType text if not present
export const mTypeSelectorFn = (detail: DeltaResource | null) => {
  const entity = find(
    annotationArrayFunc(detail?.annotation),
    (o: AnnotationEntity) => o.name === 'M-type Annotation'
  );
  return entity ? entity.hasBody?.label : 'N/A';
};

// renders etype or 'no EType' text if not present
export const eTypeSelectorFn = (detail: DeltaResource | null) => {
  const entity = find(
    annotationArrayFunc(detail?.annotation),
    (o: AnnotationEntity) => o.name === 'E-type Annotation'
  );
  return entity ? entity.hasBody?.label : 'N/A';
};

// renders weight in a min - max format
export const weightSelectorFn = (detail: DeltaResource | null) =>
  detail?.subject?.weight &&
  `${detail.subject?.weight?.minValue} - ${detail.subject?.weight?.maxValue}`;

// renders standard error of the mean if present
export const semSelectorFn = (detail: DeltaResource | null) => {
  const seriesArray: Series[] | undefined = seriesArrayFunc(detail?.series);
  return seriesArray?.find((series) => series.statistic === 'standard error of the mean')?.value;
};

// renders number of measurement data if present
export const numberOfMeasurementSelectorFn = (detail: DeltaResource | null) => {
  const seriesArray: Series[] | undefined = seriesArrayFunc(detail?.series);
  return seriesArray?.find((s) => s.statistic === 'N')?.value;
};

export const attrsSelectorFn = (detail: DeltaResource | null) => {
  if (!detail?.attrs) return [];
  return Object.keys(detail?.attrs).map((attr) => ({
    id: attr,
    label: attr,
  }));
};

export const dimensionsSelectorFn = (detail: DeltaResource | null) => {
  if (!detail?.coords) return [];
  return Object.keys(detail?.coords).map((dimension) => ({
    id: dimension,
    label: dimension,
  }));
};
