'use client';

import { useSetAtom } from 'jotai';
import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import ExploreSectionListingView from '@/components/explore-section/ExploreSectionListingView';
import { DataType } from '@/constants/explore-section/list-views';
import { selectedMModelIdAtom, morphologyTypeAtom } from '@/state/virtual-lab/build/me-model';
import { Btn } from '@/components/Btn';
import { ExploreSectionResource } from '@/types/explore-section/resources';
import { ExploreESHit } from '@/types/explore-section/es';
import { ReconstructedNeuronMorphology } from '@/types/explore-section/es-experiment';

export default function ReconstrucedMorphologyPage() {
  const setMorphologyType = useSetAtom(morphologyTypeAtom);
  const setSelectedMModelId = useSetAtom(selectedMModelIdAtom);
  const router = useRouter();

  useEffect(() => setMorphologyType('reconstructed'), [setMorphologyType]);

  const onMorphPicked = useCallback(
    (selectedRows: ExploreESHit<ExploreSectionResource>[]) => {
      if (selectedRows.length > 1) {
        throw new Error(
          'Multiple morphologies selected for ME-Model building. Only one is allowed'
        );
      }

      const morph = selectedRows[0]._source as ReconstructedNeuronMorphology;
      setSelectedMModelId(morph['@id']);
      router.push('/build/me-model/electrophysiology');
    },
    [setSelectedMModelId, router]
  );

  return (
    <div className="h-full" id="explore-table-container-for-observable">
      <ExploreSectionListingView
        dataType={DataType.ExperimentalNeuronMorphology}
        brainRegionSource="selected"
        selectionType="radio"
        enableDownload
        renderButton={({ selectedRows }) => (
          <Btn
            className="fit-content sticky bottom-0 ml-auto w-fit bg-secondary-2"
            onClick={() => onMorphPicked(selectedRows)}
          >
            Use morphology
          </Btn>
        )}
      />
    </div>
  );
}
