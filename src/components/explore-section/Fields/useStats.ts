import { DeltaResource } from '@/types/explore-section/resources';
import { Series } from '@/types/explore-section/fields';
import { ensureArray } from '@/util/nexus';

export default function useStats(detail: DeltaResource) {
  const seriesArray: Series[] | undefined = detail?.series && ensureArray(detail.series);
  const mean = seriesArray && seriesArray.find((s) => s.statistic === 'mean');
  const std = seriesArray && seriesArray.find((s) => s.statistic === 'standard deviation');

  return { mean, std };
}
