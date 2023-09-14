interface Bucket {
  key: string;
  doc_count: number;
}

interface BucketAggregation {
  buckets: Bucket[];
  excludeOwnFilter: { buckets: Bucket[] };
}

interface NestedStatsAggregation {
  [key: string]: { [key: string]: Statistics };
}

interface Statistics {
  avg?: number;
  count: number;
  max?: number;
  min?: number;
  sum: number;
  doc_count?: number;
}

type StatsAggregation = NestedStatsAggregation | Statistics;

export default interface Aggregations {
  [key: string]: BucketAggregation | StatsAggregation;
}
