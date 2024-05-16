'use client';

import { useSetAtom } from 'jotai';
import { useEffect } from 'react';

import ExploreSectionListingView from '@/components/explore-section/ExploreSectionListingView';
import { DataType } from '@/constants/explore-section/list-views';
import { meModelSectionAtom } from '@/state/virtual-lab/build/me-model';
import MorphologyCard from '@/components/build-section/virtual-lab/me-model/MorphologyCard';

export default function ElectrophysiologyPage() {
  const setMEModelSection = useSetAtom(meModelSectionAtom);

  useEffect(() => setMEModelSection('electrophysiology'), [setMEModelSection]);

  return (
    <>
      <div className="p-10">
        <MorphologyCard />
      </div>
      <div className="h-full px-10" id="explore-table-container-for-observable">
        <ExploreSectionListingView dataType={DataType.CircuitEModel} brainRegionSource="selected" />
      </div>
    </>
  );
}
