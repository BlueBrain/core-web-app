'use client';

import { useSetAtom } from 'jotai';
import { useEffect } from 'react';

import ExploreSectionListingView from '@/components/explore-section/ExploreSectionListingView';
import { DataType } from '@/constants/explore-section/list-views';
import { morphologyTypeAtom } from '@/state/virtual-lab/build/me-model';

export default function ReconstrucedMorphologyPage() {
  const setMorphologyType = useSetAtom(morphologyTypeAtom);

  useEffect(() => setMorphologyType('reconstructed'), [setMorphologyType]);

  return (
    <div className="h-full" id="explore-table-container-for-observable">
      <ExploreSectionListingView
        dataType={DataType.ExperimentalNeuronMorphology}
        brainRegionSource="selected"
      />
    </div>
  );
}
