import EModelCard from '@/components/build-section/virtual-lab/me-model/EModelCard';
import MorphologyCard from '@/components/build-section/virtual-lab/me-model/MorphologyCard';

export default function Configuration() {
  return (
    <div className="flex w-full flex-col gap-4">
      <MorphologyCard />
      <EModelCard />
    </div>
  );
}
