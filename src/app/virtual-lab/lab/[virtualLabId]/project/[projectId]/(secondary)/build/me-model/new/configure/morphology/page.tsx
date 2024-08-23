'use client';

import { useAtom, useSetAtom } from 'jotai';
import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import ExploreSectionListingView from '@/components/explore-section/ExploreSectionListingView';
import { DataType } from '@/constants/explore-section/list-views';
import { selectedMModelIdAtom, morphologyTypeAtom } from '@/state/virtual-lab/build/me-model';
import { Btn } from '@/components/Btn';
import { ExploreSectionResource } from '@/types/explore-section/resources';
import { ExploreESHit } from '@/types/explore-section/es';
import { ReconstructedNeuronMorphology } from '@/types/explore-section/es-experiment';
import { ExploreDataScope, StatusAttribute } from '@/types/explore-section/application';
import { meModelDetailsAtom } from '@/state/virtual-lab/build/me-model-setter';

export default function ReconstrucedMorphologyPage() {
  const setMorphologyType = useSetAtom(morphologyTypeAtom);
  const [meModelDetails, setMEModelDetails] = useAtom(meModelDetailsAtom);

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
      // if a brain region is not already set for the me-model, setting the brain region of the morphology selected
      if (!meModelDetails.brainRegion) {
        setMEModelDetails(
          Promise.resolve({
            ...meModelDetails,
            brainRegion: {
              id: morph.brainRegion['@id'],
              title: morph.brainRegion.label,
            },
          })
        );
      }

      setSelectedMModelId(morph['@id']);
      router.push('../configure');
    },
    [setSelectedMModelId, router, meModelDetails, setMEModelDetails]
  );

  return (
    <div className="h-full" id="explore-table-container-for-observable">
      <ExploreSectionListingView
        dataType={DataType.ExperimentalNeuronMorphology}
        dataScope={ExploreDataScope.SelectedBrainRegion}
        selectionType="radio"
        renderButton={({ selectedRows }) => (
          <Btn
            className="fit-content sticky bottom-0 ml-auto w-fit bg-primary-8"
            onClick={() => onMorphPicked(selectedRows)}
          >
            Select morphology
          </Btn>
        )}
        statusAttribute={StatusAttribute.SimulationReady}
      />
    </div>
  );
}
