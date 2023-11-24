export type CardMetricIds = 'metadata' | 'morphometrics';

export type CardMetric = {
  id: CardMetricIds;
  name: string;
  description: string;
};
