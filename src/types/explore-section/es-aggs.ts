interface Bucket {
  key: string;
  doc_count: number;
}

export interface BucketAggregation {
  buckets: Bucket[];
  excludeOwnFilter: { buckets: Bucket[] };
}

export interface NestedBucketAggregation {
  [key: string]: { [key: string]: BucketAggregation };
}

export interface NestedStatsAggregation {
  [key: string]: { [key: string]: Statistics };
}

export interface Statistics {
  avg?: number;
  count: number;
  max?: number;
  min?: number;
  sum: number;
  doc_count?: number;
}

type StatsAggregation = NestedStatsAggregation | Statistics;

export default interface Aggregations {
  [key: string]: BucketAggregation | NestedBucketAggregation | StatsAggregation;
}
