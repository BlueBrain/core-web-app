import { formatNumber } from '@/util/common';
import useStats from '@/components/explore-section/Fields/useStats';
import {
  ExperimentalBoutonDensity,
  ExperimentalLayerThickness,
  ExperimentalNeuronDensity,
  ExperimentalSynapsesPerConnection,
} from '@/types/explore-section/delta-experiment';

type MeanStdFieldProps = {
  detail:
    | ExperimentalBoutonDensity
    | ExperimentalLayerThickness
    | ExperimentalNeuronDensity
    | ExperimentalSynapsesPerConnection;
};

const muMinusOne = (
  <span className="text-neutral-4">
    µm<sup>⁻1</sup>
  </span>
);

export default function MeanStdField({ detail }: MeanStdFieldProps) {
  const { mean, std } = useStats(detail);
  if (!mean) return null;
  return std ? (
    <>
      {formatNumber(mean.value)} ± {formatNumber(std.value)} {muMinusOne}
    </>
  ) : (
    <>
      {formatNumber(mean.value)} {muMinusOne}
    </>
  );
}
