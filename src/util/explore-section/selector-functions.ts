import find from 'lodash/find';
import { Subject } from '@/types/explore-section/resources';
import {
  Experiment,
  ExperimentalBoutonDensity,
  ExperimentalLayerThickness,
  ExperimentalNeuronDensity,
  ExperimentalSynapsesPerConnection,
  ExperimentalTrace,
} from '@/types/explore-section/delta-experiment';
import { Annotation, SeriesStatistic } from '@/types/explore-section/delta-properties';
import { ensureArray } from '@/util/nexus';
import { DisplayMessages } from '@/constants/display-messages';
import { formatNumber } from '@/util/common';
import { NeuronMorphology } from '@/types/e-model';

const seriesArrayFunc = (series: SeriesStatistic | SeriesStatistic[] | undefined) =>
  series && ensureArray(series);

const annotationArrayFunc = (annotation: Annotation | Annotation[] | undefined) =>
  annotation && ensureArray(annotation);

/**
 * Takes delta resource and extracts subject age
 * @param {import("./types/explore-section/resources").Subject} subject
 */
export const ageSelectorFn = (subject: Subject | null): string => {
  if (subject?.age?.value) {
    return `${subject?.age.value} ${subject?.age.unitCode} ${subject?.age.period}`;
  }
  if (subject?.age?.minValue && subject?.age?.maxValue) {
    return `${subject?.age.minValue} to ${subject?.age.maxValue} ${subject?.age.unitCode} ${subject?.age.period}`;
  }

  return DisplayMessages.NO_DATA_STRING;
};

/**
 * Takes delta resource and extracts subject age
 * @param {import("./types/explore-section/resources").DeltaResource} detail
 */
export const subjectAgeSelectorFn = (detail: Experiment | null) => {
  return ageSelectorFn(detail?.subject || null);
};

// renders mtype or 'no MType text if not present
export const mTypeSelectorFn = (
  detail:
    | ExperimentalBoutonDensity
    | ExperimentalNeuronDensity
    | ExperimentalTrace
    | NeuronMorphology
) => {
  const entity = find(annotationArrayFunc(detail?.annotation), (o: Annotation) =>
    o['@type'].includes('MTypeAnnotation')
  );
  return entity ? entity.hasBody?.label : DisplayMessages.NO_DATA_STRING;
};

// renders etype or 'no EType' text if not present
export const eTypeSelectorFn = (
  detail: ExperimentalBoutonDensity | ExperimentalNeuronDensity | ExperimentalTrace
) => {
  const entity = find(annotationArrayFunc(detail?.annotation), (o: Annotation) =>
    o['@type'].includes('ETypeAnnotation')
  );
  return entity ? entity.hasBody?.label : DisplayMessages.NO_DATA_STRING;
};

// renders standard error of the mean if present
export const semSelectorFn = (
  detail: ExperimentalBoutonDensity | ExperimentalLayerThickness | ExperimentalSynapsesPerConnection
) => {
  const seriesArray: SeriesStatistic[] | undefined = seriesArrayFunc(detail?.series);

  const value = seriesArray
    ?.find((series) => series.statistic === 'standard error of the mean')
    ?.value.toFixed(5);

  return Number(value) || DisplayMessages.NO_DATA_STRING;
};

/**
 * Serializes a series array based on its format and string targetting specific statistic
 * @param {import("./types/explore-section/resources").DeltaResource} detail
 * @param field the field of series to render
 * @param withUnits whether to render units
 */
export const selectorFnStatisticDetail = (
  detail:
    | ExperimentalBoutonDensity
    | ExperimentalLayerThickness
    | ExperimentalSynapsesPerConnection,
  field: string,
  withUnits: boolean = false
): string | number => {
  if (!detail?.series) return DisplayMessages.NO_DATA_STRING;

  const found = ensureArray(detail?.series).find((el: SeriesStatistic) => el.statistic === field);
  const units = withUnits && found ? found.unitCode : '';
  return found ? `${formatNumber(found.value)} ${units}` : DisplayMessages.NO_DATA_STRING;
};
