'use client';

import { useAtomValue, useSetAtom } from 'jotai';
import { useQueryState } from 'nuqs';

import { useEffect } from 'react';
import { selectedEModelAtom, selectedMModelAtom } from '@/state/virtual-lab/build/me-model';
import MorphologyCard from '@/components/build-section/virtual-lab/me-model/MorphologyCard';
import EModelCard from '@/components/build-section/virtual-lab/me-model/EModelCard';
import { initializeSummaryAtom } from '@/state/virtual-lab/build/me-model-setter';
import { useSessionAtomValue } from '@/hooks/hooks';

export default function SummaryPage() {
  const selectedEModel = useAtomValue(selectedEModelAtom);
  const selectedMModel = useAtomValue(selectedMModelAtom);
  const initializeSummary = useSetAtom(initializeSummaryAtom);
  const [meModelId] = useQueryState('meModelId');
  const session = useSessionAtomValue();

  useEffect(() => {
    if (!meModelId || !session) return;
    // info already set
    if (selectedEModel && selectedMModel) return;

    initializeSummary(meModelId);
  }, [meModelId, session, initializeSummary, selectedEModel, selectedMModel]);

  if (!meModelId)
    return (
      <div className="flex h-full items-center justify-center text-2xl text-primary-8">
        No ME-Model found in URL
      </div>
    );

  return (
    <div className="flex h-full flex-col gap-10 p-10">
      <div className="text-2xl font-bold text-primary-8">Single Neuron</div>
      <MorphologyCard />
      <EModelCard />
    </div>
  );
}
