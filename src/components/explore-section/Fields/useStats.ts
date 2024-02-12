import { DeltaResource } from '@/types/explore-section/resources';
import { Statistic } from '@/types/explore-section/es-properties';
import { ensureArray } from '@/util/nexus';

export default function useStats(detail: DeltaResource) {
  const seriesArray: Statistic[] | undefined = detail?.series && ensureArray(detail.series);
  const mean = seriesArray && seriesArray.find((s) => s.statistic === 'mean');
  const std = seriesArray && seriesArray.find((s) => s.statistic === 'standard deviation');

  return { mean, std };
}
