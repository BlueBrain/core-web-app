import { useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import find from 'lodash/find';
import { Tag } from 'antd';
import {
  AnnotationEntity,
  DeltaResource,
  Series,
  SerializedDeltaResource,
} from '@/types/explore-section';
import { ensureArray } from '@/util/nexus';
import timeElapsedFromToday from '@/util/date';
import { NO_DATA_STRING } from '@/constants/explore-section';
import { formatNumber } from '@/util/common';

export default function useExploreSerializedFields(
  detail: DeltaResource | null
): SerializedDeltaResource {
  const seriesArray: Series[] | undefined = detail?.series && ensureArray(detail.series);
  const annotationArray: AnnotationEntity[] | undefined | null =
    detail?.annotation && ensureArray(detail.annotation);

  const mean = useMemo(
    () => seriesArray && seriesArray.find((s) => s.statistic === 'mean'),
    [seriesArray]
  );

  const std = useMemo(
    () => seriesArray && seriesArray.find((s) => s.statistic === 'standard deviation'),
    [seriesArray]
  );

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

  /**
   * Serializes a series array based on its format and string targetting specific statistic
   * @param series @param field
   */
  const serializeStatisticFields = (field: string): string | number => {
    if (!detail?.series) return NO_DATA_STRING;

    const found = ensureArray(detail?.series).find((el: Series) => el.statistic === field);

    return found ? formatNumber(found.value) : NO_DATA_STRING;
  };

  // renders the species age
  const serializeSubjectAge = () =>
    detail?.subject?.age &&
    `${detail.subject?.age.value} ${detail.subject?.age.unitCode} ${detail.subject?.age.period}`;

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

  const formatTags = () =>
    detail?.tags &&
    detail?.tags?.map((tag) => (
      <Tag
        key={tag}
        className="text-primary-7 rounded-full border-transparent py-1 px-4 mb-2"
        style={{ backgroundColor: '#E6F7FF' }}
      >
        {tag}
      </Tag>
    ));

  const formatDimensions = () => (
    <ul>
      {detail?.dimensions &&
        detail.dimensions.map((dimension) => (
          <li key={dimension.label} className="mb-2">
            {dimension.label}
          </li>
        ))}
    </ul>
  );

  return {
    description: detail?.description,
    species: detail?.subject?.species?.label,
    brainRegion: detail?.brainLocation?.brainRegion?.label,
    numberOfMeasurement: detail?.numberOfCells,
    createdBy: detail?._createdBy?.split('/')?.pop(),
    subjectAge: serializeSubjectAge(),
    mType: serializeMType(),
    meanPlusMinusStd: serializeMeanPlusMinusStd(),
    numberOfCells: serializeStatisticFields('N'),
    sem: serializeStatisticFields('standard error of the mean'),
    standardDeviation: serializeStatisticFields('standard deviation'),
    creationDate: serializeCreationDate(),
    thickness: serializeThickness(),
    eType: serializeEType(),
    contributors: detail?.contributors,
    weight: serializeWeight(),
    license: detail?.license?.['@id'],
    brainConfiguration: detail?.brainConfiguration,
    attribute: detail?.attribute,
    status: detail?.status,
    tags: formatTags(),
    updatedAt: timeElapsedFromToday(detail?._updatedAt),
    dimensions: formatDimensions(),
  };
}
