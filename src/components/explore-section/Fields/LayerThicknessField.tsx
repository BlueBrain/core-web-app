import { formatNumber } from '@/util/common';
import { WithSeries } from '@/types/explore-section/delta';
import useStats from '@/components/explore-section/Fields/useStats';

type LayerThicknessFieldProps = {
  detail: WithSeries;
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
