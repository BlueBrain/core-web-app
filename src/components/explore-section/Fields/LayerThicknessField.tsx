import { formatNumber } from '@/util/common';
import {
  ExperimentalBoutonDensity,
  ExperimentalLayerThickness,
  ExperimentalNeuronDensity,
  ExperimentalSynapsesPerConnection,
} from '@/types/explore-section/delta-experiment';
import useStats from '@/components/explore-section/Fields/useStats';

type LayerThicknessFieldProps = {
  detail:
    | ExperimentalBoutonDensity
    | ExperimentalLayerThickness
    | ExperimentalNeuronDensity
    | ExperimentalSynapsesPerConnection;
};

export default function LayerThicknessField({ detail }: LayerThicknessFieldProps) {
  const { mean } = useStats(detail);

  return (
    mean && (
      <>
        {formatNumber(mean.value)} <span className="text-neutral-4"> {mean.unitCode}</span>
      </>
    )
  );
}
