import { useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import find from 'lodash/find';
import {
  AnnotationEntity,
  DeltaResource,
  Series,
  SerializedDeltaResource,
} from '@/types/explore-section';
import { ensureArray } from '@/util/nexus';

export default function useExploreSerializedFields(
  detail: DeltaResource | null
): SerializedDeltaResource {
  const seriesArray: Series[] | undefined = detail?.series && ensureArray(detail.series);
  const annotationArray: AnnotationEntity[] | undefined | null =
    detail?.annotation && ensureArray(detail.annotation);
  const contributorsArray = ensureArray(detail?.contribution).reduce(
    (acc, cur) => [...acc, `${cur?.agent?.givenName} ${cur?.agent?.familyName}`],
    [] as any
  ) as string[];

  const mean = useMemo(
    () => seriesArray && seriesArray.find((s) => s.statistic === 'mean'),
    [seriesArray]
  );

  const std = useMemo(
    () => seriesArray && seriesArray.find((s) => s.statistic === 'standard deviation'),
    [seriesArray]
  );

  // renders the species age
  const serializeSubjectAge = () =>
    detail?.subject?.age &&
    `${detail.subject?.age.value} ${detail.subject?.age.unitCode} ${detail.subject?.age.period}`;

  // renders mean +- std field. If std is not present, renders only the mean
  const serializeMeanPlusMinusStd = () => {
    if (!mean) return null;
    return std ? (
      <>
        {mean.value} ± {std.value} <span className="text-neutral-4"> {mean.unitCode}</span>
      </>
    ) : (
      <>
        {mean.value} <span className="text-neutral-4"> {mean.unitCode}</span>
      </>
    );
  };

  // renders standard error of the mean if present
  const serializeSem = () =>
    seriesArray?.find((series) => series.statistic === 'standard error of the mean')?.value;

  // renders thickness
  const serializeThickness = () =>
    mean && (
      <>
        {mean.value} <span className="text-neutral-4"> {mean.unitCode}</span>
      </>
    );

  // renders mtype or 'no MType text if not present
  const serializeMType = () => {
    const entity = find(annotationArray, (o: AnnotationEntity) => o.name === 'M-type Annotation');
    return entity ? entity.hasBody?.label : 'no MType';
  };

  // renders etype or 'no EType' text if not present
  const serializeEType = () => {
    const entity = find(annotationArray, (o: AnnotationEntity) => o.name === 'E-type Annotation');
    return entity ? entity.hasBody?.label : 'no EType';
  };

  // renders creation day in a dd.MM.yyyy format
  const serializeCreationDate = () =>
    detail?._createdAt && (
      <div className="mt-3">{format(parseISO(detail._createdAt), 'dd.MM.yyyy')}</div>
    );

  // renders weight in a min - max format
  const serializeWeight = () =>
    detail?.subject?.weight &&
    `${detail.subject?.weight?.minValue} - ${detail.subject?.weight?.maxValue}`;

  return {
    description: detail?.description,
    species: detail?.subject?.species?.label,
    brainRegion: detail?.brainLocation?.brainRegion?.label,
    numberOfMeasurement: seriesArray?.find((s) => s.statistic === 'N')?.value,
    createdBy: detail?._createdBy?.split('/')?.pop(),
    subjectAge: serializeSubjectAge(),
    mType: serializeMType(),
    meanPlusMinusStd: serializeMeanPlusMinusStd(),
    creationDate: serializeCreationDate(),
    thickness: serializeThickness(),
    eType: serializeEType(),
    contributors: contributorsArray,
    sem: serializeSem(),
    weight: serializeWeight(),
    license: detail?.license?.['@id'],
  };
}
