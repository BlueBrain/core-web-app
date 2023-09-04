import { DeltaResource } from '@/types/explore-section/resources';

type WeightFieldProps = {
  detail: DeltaResource;
};

export default function WeightField({ detail }: WeightFieldProps) {
  if (!detail?.subject?.weight) return null;
  let value;
  if (detail?.subject?.weight.minValue && detail?.subject?.weight.maxValue) {
    value = `${detail.subject?.weight?.minValue} - ${detail.subject?.weight?.maxValue}`;
  }
  if (detail?.subject?.weight.minValue) {
    value = `${detail.subject?.weight?.minValue}`;
  }
  if (detail?.subject?.weight.maxValue) {
    value = `${detail.subject?.weight?.maxValue}`;
  }

  return (
    <>
      {value}
      <span className="ml-1 text-neutral-4">{detail.subject.weight.unitCode}</span>
    </>
  );
}
