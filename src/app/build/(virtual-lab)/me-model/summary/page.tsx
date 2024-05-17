'use client';

import { useAtomValue } from 'jotai';

import { selectedEModelAtom, selectedMModelAtom } from '@/state/virtual-lab/build/me-model';
import MorphologyCard from '@/components/build-section/virtual-lab/me-model/MorphologyCard';
import EModelCard from '@/components/build-section/virtual-lab/me-model/EModelCard';

export default function SummaryPage() {
  const selectedEModel = useAtomValue(selectedEModelAtom);
  const selectedMModel = useAtomValue(selectedMModelAtom);

  if (!selectedEModel || !selectedMModel) {
    return (
      <h2 className="flex h-full items-center justify-center">
        Select Morpholgy and EModel first.
      </h2>
    );
  }

  return (
    <div className="flex h-full flex-col gap-10 p-10">
      <div className="text-2xl font-bold text-primary-8">Single Neuron</div>
      <MorphologyCard />
      <EModelCard />
    </div>
  );
}
