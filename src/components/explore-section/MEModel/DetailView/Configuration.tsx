import EModelCard from '@/components/build-section/virtual-lab/me-model/EModelCard';
import MorphologyCard from '@/components/build-section/virtual-lab/me-model/MorphologyCard';
import { useUnwrappedValue } from '@/hooks/hooks';
import { detailFamily } from '@/state/explore-section/detail-view-atoms';
import { EModelResource } from '@/types/explore-section/delta-model';

export default async function Configuration({
  meModelId,
  org,
  project,
}: {
  meModelId: string;
  org: string;
  project: string;
}) {
  const detail = useUnwrappedValue(detailFamily({ id: meModelId, org, project })) as EModelResource;

  if (!detail) return undefined;

  const eModelId = detail.hasPart.find(({ '@type': type }) => type === 'EModel');

  console.log(detail.hasPart, eModelId);

  return (
    <div className="flex w-full flex-col gap-4">
      <MorphologyCard />
      <EModelCard selectedEModel={eModelId} />
    </div>
  );
}
