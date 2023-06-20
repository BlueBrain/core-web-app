import { useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import { Tag } from 'antd';
import { DeltaResource, SerializedDeltaResource } from '@/types/explore-section/resources';
import { Series } from '@/types/explore-section/fields';
import { ensureArray } from '@/util/nexus';
import timeElapsedFromToday from '@/util/date';
import { NO_DATA_STRING } from '@/constants/explore-section/queries';
import { formatNumber } from '@/util/common';
import {
  subjectAgeSelectorFn,
  weightSelectorFn,
  eTypeSelectorFn,
  mTypeSelectorFn,
  semSelectorFn,
  attrsSelectorFn,
  dimensionsSelectorFn,
} from '@/state/explore-section/selector-functions';

export default function useExploreSerializedFields(
  detail: DeltaResource | null
): SerializedDeltaResource {
  const seriesArray: Series[] | undefined = detail?.series && ensureArray(detail.series);

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

  // renders thickness
  const serializeThickness = () =>
    mean && (
      <>
        {mean.value} <span className="text-neutral-4"> {mean.unitCode}</span>
      </>
    );

  // renders creation day in a dd.MM.yyyy format
  const serializeCreationDate = () =>
    detail?._createdAt && (
      <div className="mt-3">{format(parseISO(detail._createdAt), 'dd.MM.yyyy')}</div>
    );

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

  return {
    description: detail?.description,
    brainRegion: detail?.brainLocation?.brainRegion?.label,
    numberOfMeasurement: detail?.numberOfMeasurement,
    createdBy: detail?.createdBy,
    meanPlusMinusStd: serializeMeanPlusMinusStd(),
    numberOfCells: serializeStatisticFields('N'),
    standardDeviation: serializeStatisticFields('standard deviation'),
    creationDate: serializeCreationDate(),
    thickness: serializeThickness(),
    layer: detail?.brainLocation?.layer?.label,
    brainConfiguration: detail?.brainConfiguration,
    attribute: detail?.attribute,
    conditions: detail?.conditions,
    status: detail?.status,
    tags: formatTags(),
    updatedAt: timeElapsedFromToday(detail?._updatedAt),
    dimensions: dimensionsSelectorFn(detail),
    subjectAge: subjectAgeSelectorFn(detail),
    weight: weightSelectorFn(detail),
    mType: mTypeSelectorFn(detail),
    eType: eTypeSelectorFn(detail),
    sem: semSelectorFn(detail),
    attrs: attrsSelectorFn(detail),
    campaign: detail?.campaign,
    startedAt: timeElapsedFromToday(detail?.startedAt),
    completedAt: timeElapsedFromToday(detail?.completedAt),
  };
}
