import { formatNumber } from '@/util/common';
import useStats from '@/components/explore-section/Fields/useStats';
import { WithSeries } from '@/types/explore-section/delta';

type MeanStdFieldProps = {
  detail: WithSeries;
};

export default function MeanStdField({ detail }: MeanStdFieldProps) {
  const { mean, std } = useStats(detail);

  if (!mean) return null;

  return std ? (
    <>
      {formatNumber(mean.value)} ± {formatNumber(std.value)}{' '}
      <span className="text-neutral-4"> {mean.unitCode}</span>
    </>
  ) : (
    <>
      {formatNumber(mean.value)} <span className="text-neutral-4"> {mean.unitCode}</span>
    </>
  );
}
