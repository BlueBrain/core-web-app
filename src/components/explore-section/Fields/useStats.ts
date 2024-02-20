import {
  ExperimentalBoutonDensity,
  ExperimentalLayerThickness,
  ExperimentalNeuronDensity,
  ExperimentalSynapsesPerConnection,
} from '@/types/explore-section/delta-experiment';
import { SeriesStatistic } from '@/types/explore-section/delta-properties';
import { ensureArray } from '@/util/nexus';

export default function useStats(
  detail:
    | ExperimentalBoutonDensity
    | ExperimentalLayerThickness
    | ExperimentalNeuronDensity
    | ExperimentalSynapsesPerConnection
) {
  const seriesArray: SeriesStatistic[] | undefined = detail?.series && ensureArray(detail.series);
  const mean = seriesArray && seriesArray.find((s) => s.statistic === 'mean');
  const std = seriesArray && seriesArray.find((s) => s.statistic === 'standard deviation');

  return { mean, std };
}
