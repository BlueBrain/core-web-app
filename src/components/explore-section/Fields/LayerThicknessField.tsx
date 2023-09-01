import { formatNumber } from '@/util/common';
import { DeltaResource } from '@/types/explore-section/resources';
import useStats from '@/components/explore-section/Fields/useStats';

type LayerThicknessFieldProps = {
  detail: DeltaResource;
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
