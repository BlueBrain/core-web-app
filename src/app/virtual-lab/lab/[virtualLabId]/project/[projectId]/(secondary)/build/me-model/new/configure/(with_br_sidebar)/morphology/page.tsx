'use client';

import { useAtom, useSetAtom } from 'jotai';
import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import ExploreSectionListingView from '@/components/explore-section/ExploreSectionListingView';
import { OnCellClick } from '@/components/explore-section/ExploreSectionListingView/ExploreSectionTable';
import { DataType } from '@/constants/explore-section/list-views';
import { selectedMModelIdAtom, morphologyTypeAtom } from '@/state/virtual-lab/build/me-model';
import { Btn } from '@/components/Btn';
import { ExploreSectionResource } from '@/types/explore-section/resources';
import { ExploreESHit } from '@/types/explore-section/es';
import { ReconstructedNeuronMorphology } from '@/types/explore-section/es-experiment';
import { ExploreDataScope } from '@/types/explore-section/application';
import { meModelDetailsAtom } from '@/state/virtual-lab/build/me-model-setter';
import { detailUrlBuilder } from '@/util/common';
import { generateVlProjectUrl } from '@/util/virtual-lab/urls';

type Params = {
  params: {
    projectId: string;
    virtualLabId: string;
  };
};

export default function ReconstrucedMorphologyPage({ params }: Params) {
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

      if (meModelDetails === null) {
        router.push('./'); // Redirects to (...)/build/me-model/new

        return undefined;
      }

      // if a brain region is not already set for the me-model, setting the brain region of the morphology selected
      if (!meModelDetails.brainRegion) {
        setMEModelDetails({
          ...meModelDetails,
          brainRegion: {
            id: morph.brainRegion['@id'],
            title: morph.brainRegion.label,
          },
        });
      }

      setSelectedMModelId(morph['@id']);
      router.push('../configure');
    },
    [setSelectedMModelId, router, meModelDetails, setMEModelDetails]
  );

  const vlProjectUrl = generateVlProjectUrl(params.virtualLabId, params.projectId);
  const baseExploreUrl = `${vlProjectUrl}/explore/interactive/experimental/morphology`;

  const onCellClick: OnCellClick = (_basePath, record) => {
    router.push(detailUrlBuilder(baseExploreUrl, record));
  };

  return (
    <div className="h-full" id="explore-table-container-for-observable">
      <ExploreSectionListingView
        dataType={DataType.ExperimentalNeuronMorphology}
        dataScope={ExploreDataScope.Build}
        onCellClick={onCellClick}
        selectionType="radio"
        renderButton={({ selectedRows }) => (
          <Btn
            className="fit-content sticky bottom-0 ml-auto w-fit bg-primary-8"
            onClick={() => onMorphPicked(selectedRows)}
          >
            Select m-model
          </Btn>
        )}
      />
    </div>
  );
}
