'use client';

import { useSetAtom } from 'jotai';
import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import ExploreSectionListingView from '@/components/explore-section/ExploreSectionListingView';
import { DataType } from '@/constants/explore-section/list-views';
import { eModelPickedAtom, meModelSectionAtom } from '@/state/virtual-lab/build/me-model';
import MorphologyCard from '@/components/build-section/virtual-lab/me-model/MorphologyCard';
import { Btn } from '@/components/Btn';
import { ESeModel, ExploreESHit, ExploreResource } from '@/types/explore-section/es';

export default function ElectrophysiologyPage() {
  const setMEModelSection = useSetAtom(meModelSectionAtom);
  const setEModelPicked = useSetAtom(eModelPickedAtom);
  const router = useRouter();

  useEffect(() => setMEModelSection('electrophysiology'), [setMEModelSection]);

  const onEModelPicked = useCallback(
    (selectedRows: ExploreESHit<ExploreResource>[]) => {
      if (selectedRows.length > 1) {
        throw new Error('Multiple e-models selected for ME-Model building. Only one is allowed');
      }

      const emodel = selectedRows[0]._source as ESeModel;
      setEModelPicked(emodel);
      router.push('/build/me-model/summary');
    },
    [setEModelPicked, router]
  );

  return (
    <>
      <div className="p-10">
        <MorphologyCard />
      </div>
      <div className="h-full px-10" id="explore-table-container-for-observable">
        <ExploreSectionListingView
          dataType={DataType.CircuitEModel}
          brainRegionSource="selected"
          enableDownload
          selectionType="radio"
          renderButton={({ selectedRows }) => (
            <Btn
              className="fit-content sticky bottom-0 ml-auto w-fit bg-secondary-2"
              onClick={() => onEModelPicked(selectedRows)}
            >
              Validate
            </Btn>
          )}
        />
      </div>
    </>
  );
}
