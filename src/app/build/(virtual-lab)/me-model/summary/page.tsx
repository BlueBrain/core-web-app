'use client';

import { useAtomValue } from 'jotai';

import { selectedEModelAtom, selectedMModelAtom } from '@/state/virtual-lab/build/me-model';

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
    <div className="flex h-full flex-col items-center justify-center gap-10">
      <div className="text-2xl font-bold">ME Model</div>
      <div>
        <div className="text-xl font-bold">M-Model</div>
        <div>{mModelPicked.name}</div>
        <div>{mModelPicked['@id']}</div>
      </div>
      <div>
        <div className="text-xl font-bold">E-Model</div>
        <div>{eModelPicked.name}</div>
        <div>{eModelPicked['@id']}</div>
      </div>
    </div>
  );
}
