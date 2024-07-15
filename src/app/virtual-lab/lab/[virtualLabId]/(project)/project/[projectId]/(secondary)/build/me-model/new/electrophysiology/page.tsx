'use client';

import { useSetAtom } from 'jotai';
import { useEffect } from 'react';

import ExploreSectionListingView from '@/components/explore-section/ExploreSectionListingView';
import { DataType } from '@/constants/explore-section/list-views';
import { selectedEModelIdAtom, meModelSectionAtom } from '@/state/virtual-lab/build/me-model';
import MorphologyCard from '@/components/build-section/virtual-lab/me-model/MorphologyCard';
import { Btn } from '@/components/Btn';
import { ESeModel, ExploreESHit, ExploreResource } from '@/types/explore-section/es';
import { createMEModelAtom } from '@/state/virtual-lab/build/me-model-setter';
import { usePendingValidationModal } from '@/components/build-section/virtual-lab/me-model/pending-validation-modal-hook';
import { generateVlProjectUrl } from '@/util/virtual-lab/urls';
import { ExploreDataScope } from '@/types/explore-section/application';
import { VirtualLabInfo } from '@/types/virtual-lab/common';

type Params = {
  params: {
    virtualLabId: string;
    projectId: string;
  };
};

export default function ElectrophysiologyPage({ params }: Params) {
  const virtualLabInfo: VirtualLabInfo = {
    virtualLabId: params.virtualLabId,
    projectId: params.projectId,
  };
  const setMEModelSection = useSetAtom(meModelSectionAtom);
  const setSelectedEModelId = useSetAtom(selectedEModelIdAtom);
  const createMEModel = useSetAtom(createMEModelAtom);

  const { createModal, contextHolder } = usePendingValidationModal();

  useEffect(() => setMEModelSection('electrophysiology'), [setMEModelSection]);

  const onEModelPicked = (selectedRows: ExploreESHit<ExploreResource>[]) => {
    if (selectedRows.length > 1) {
      throw new Error('Multiple e-models selected for ME-Model building. Only one is allowed');
    }

    const emodel = selectedRows[0]._source as ESeModel;
    setSelectedEModelId(emodel['@id']);
    createMEModel(virtualLabInfo);
    const virtualLabHomeLink = `${generateVlProjectUrl(params.virtualLabId, params.projectId)}/home`;
    createModal(virtualLabHomeLink);
  };

  return (
    <>
      <div className="p-10">
        <MorphologyCard />
      </div>
      <div className="h-full px-10" id="explore-table-container-for-observable">
        <ExploreSectionListingView
          dataType={DataType.CircuitEModel}
          dataScope={ExploreDataScope.SelectedBrainRegion}
          selectionType="radio"
          virtualLabInfo={{ virtualLabId: params.virtualLabId, projectId: params.projectId }}
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
      {contextHolder}
    </>
  );
}
