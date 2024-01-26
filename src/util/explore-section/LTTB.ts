/**
 * The code is pasted (almost) directly from the source-code of `downsample` library because this (now seemingly unmaintained) library does not minify correctly
 * with the swc minifier used by default by nextjs.
 * More details are available here - https://bbpgitlab.epfl.ch/project/sbo/core-web-app/-/merge_requests/1240
 *
 * Note - All usages of `isA` function are replaced by suitable functions from lodash or vanilla js to avoid importing yet another library (ts-type-checked).
 *
 * Original Code - https://github.com/janjakubnanista/downsample/blob/master/src/methods/LTTB.ts
 * Library - https://www.npmjs.com/package/downsample
 *
 */

/* eslint-disable no-plusplus */

import isDate from 'lodash/isDate';
import isObject from 'lodash/isObject';

/**
 * Possible types for the X coordinate (most probably time)
 */
type X = number | Date;

/**
 * Possible types for the Value coordinate
 */
type Value = number;

type NormalizedDataPoint = [Value, Value];

type TupleDataPoint = [X, Value];

interface XYDataPoint {
  x: X;
  y: Value;
}

export type DataPoint = TupleDataPoint | XYDataPoint;

type NumericPropertyNames<T> = {
  [K in keyof T]: T[K] extends Value ? K : never;
}[keyof T];

// TODO P extends [] does not cover all the tuple cases with heterogenous tuples
// and it would be nice to have a (generated) type for that
type NumericPropertyAccessor<P> = P extends unknown[] ? number : NumericPropertyNames<P>;

type PointValueExtractor<P> = (point: P, index: number) => Value;

interface DownsamplingFunctionConfig<P> {
  x: NumericPropertyAccessor<P> | PointValueExtractor<P>;
  y: NumericPropertyAccessor<P> | PointValueExtractor<P>;
}

interface SmoothingFunctionConfig<P> extends DownsamplingFunctionConfig<P> {
  toPoint: (x: number, y: number, index: number) => P;
}

type Indexable<T> = {
  length: number;
  [index: number]: T;
};

type DownsamplingFunction<
  T,
  Params extends unknown[] = [],
  Input extends Indexable<T> = Indexable<T>
> = (data: Input, ...params: Params) => Input;

function calculateAverageDataPoint(
  ...points: NormalizedDataPoint[]
): NormalizedDataPoint | undefined {
  const { length } = points;
  if (!length) return undefined;

  let averageX = 0;
  let averageY = 0;
  for (let i = 0; i < length; i++) {
    averageX += points[i][0];
    averageY += points[i][1];
  }

  return [averageX / length, averageY / length];
}

const createXYDataPoint = (time: number, value: number): XYDataPoint => ({
  x: time,
  y: value,
});

const createLegacyDataPointConfig = (): SmoothingFunctionConfig<DataPoint> => ({
  x: (point: DataPoint) => {
    const t =
      isObject(point) && (point as XYDataPoint).x
        ? (point as XYDataPoint).x
        : (point as TupleDataPoint)[0];

    return isDate(t) ? t.getTime() : t;
  },
  y: (point: DataPoint) => ('y' in point ? point.y : point[1]),
  toPoint: createXYDataPoint,
});

function calculateTriangleArea(
  pointA: NormalizedDataPoint,
  pointB: NormalizedDataPoint,
  pointC: NormalizedDataPoint
): number {
  return (
    Math.abs(
      (pointA[0] - pointC[0]) * (pointB[1] - pointA[1]) -
        (pointA[0] - pointB[0]) * (pointC[1] - pointA[1])
    ) / 2
  );
}

function LTTBIndexesForBuckets(buckets: NormalizedDataPoint[][]): number[] {
  const bucketCount: number = buckets.length;
  const bucketDataPointIndexes: number[] = [0];

  let previousBucketsSize = 1;
  let lastSelectedDataPoint: NormalizedDataPoint = buckets[0][0];
  for (let index = 1; index < bucketCount - 1; index++) {
    const bucket: NormalizedDataPoint[] = buckets[index];
    const nextBucket: NormalizedDataPoint[] = buckets[index + 1];
    const averageDataPointFromNextBucket = calculateAverageDataPoint(...nextBucket);
    if (averageDataPointFromNextBucket === undefined) continue;

    let maxArea = -1;
    let maxAreaIndex = -1;
    for (let j = 0; j < bucket.length; j++) {
      const dataPoint: NormalizedDataPoint = bucket[j];
      const area = calculateTriangleArea(
        lastSelectedDataPoint,
        dataPoint,
        averageDataPointFromNextBucket
      );

      if (area > maxArea) {
        maxArea = area;
        maxAreaIndex = j;
      }
    }

    lastSelectedDataPoint = bucket[maxAreaIndex];
    bucketDataPointIndexes.push(previousBucketsSize + maxAreaIndex);

    previousBucketsSize += bucket.length;
  }

  bucketDataPointIndexes.push(previousBucketsSize);

  return bucketDataPointIndexes;
}

const getPointValueExtractor = <P>(
  accessor: NumericPropertyAccessor<P> | PointValueExtractor<P>
): PointValueExtractor<P> => {
  if (typeof accessor === 'function') return accessor;

  return (point: P) => (point as any)[accessor];
};

const mapToArray = <P, R>(input: Indexable<P>, callback: (element: P, index: number) => R): R[] => {
  const { length } = input;
  const result = new Array(length);
  for (let i = 0; i < length; i++) result[i] = callback(input[i], i);

  return result;
};

const createNormalize = <P>(
  x: NumericPropertyAccessor<P> | PointValueExtractor<P>,
  y: NumericPropertyAccessor<P> | PointValueExtractor<P>
) => {
  const getX = getPointValueExtractor(x);
  const getY = getPointValueExtractor(y);

  return (data: Indexable<P>): NormalizedDataPoint[] =>
    mapToArray(data, (point, index) => [getX(point, index), getY(point, index)]);
};

// Largest triangle three buckets data downsampling algorithm implementation
const createLTTB = <P>(
  config: DownsamplingFunctionConfig<P>
): DownsamplingFunction<P, [number]> => {
  const normalize = createNormalize(config.x, config.y);

  return <Input extends Indexable<P> = Indexable<P>>(data: Input, desiredLength: number): Input => {
    if (desiredLength < 0) {
      throw new Error(`Supplied negative desiredLength parameter to LTTB: ${desiredLength}`);
    }

    const { length } = data;
    if (length <= 1 || length <= desiredLength) return data;

    const normalizedData: NormalizedDataPoint[] = normalize(data);
    const buckets: NormalizedDataPoint[][] = splitIntoBuckets(normalizedData, desiredLength);
    const bucketDataPointIndexes: number[] = LTTBIndexesForBuckets(buckets);
    const output = iterableBasedOn(data, bucketDataPointIndexes.length);

    for (let i = 0; i < bucketDataPointIndexes.length; i++)
      output[i] = data[bucketDataPointIndexes[i]];

    return output;
  };
};

const iterableBasedOn = <P, Input extends Indexable<P>>(input: Input, length: number): Input =>
  new (input.constructor as any)(length);

function splitIntoBuckets<T>(data: T[], desiredLength: number): T[][] {
  if (data.length === 2) {
    return [[data[0]], [data[1]]];
  }

  const first: T = data[0];
  const center: T[] = data.slice(1, data.length - 1);
  const last: T = data[data.length - 1];

  // First and last bucket are formed by the first and the last data points
  // so we only have N - 2 buckets left to fill
  const bucketSize: number = center.length / (desiredLength - 2);
  const splitData: T[][] = [[first]];

  for (let i = 0; i < desiredLength - 2; i++) {
    const bucketStartIndex: number = Math.floor(i * bucketSize);
    const bucketEndIndex: number = Math.floor((i + 1) * bucketSize);
    const dataPointsInBucket: T[] = center.slice(bucketStartIndex, bucketEndIndex);

    splitData.push(dataPointsInBucket);
  }

  splitData.push([last]);

  return splitData;
}

export const LTTB = createLTTB(createLegacyDataPointConfig());
