'use client';

import { useSetAtom } from 'jotai';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import ExploreSectionListingView from '@/components/explore-section/ExploreSectionListingView';
import { DataType } from '@/constants/explore-section/list-views';
import { selectedEModelIdAtom, meModelSectionAtom } from '@/state/virtual-lab/build/me-model';
import { Btn } from '@/components/Btn';
import { ESeModel, ExploreESHit, ExploreResource } from '@/types/explore-section/es';
import { usePendingValidationModal } from '@/components/build-section/virtual-lab/me-model/pending-validation-modal-hook';
import { ExploreDataScope, StatusAttribute } from '@/types/explore-section/application';

type Params = {
  params: {
    virtualLabId: string;
    projectId: string;
  };
};

export default function ElectrophysiologyPage({ params }: Params) {
  const setMEModelSection = useSetAtom(meModelSectionAtom);
  const setSelectedEModelId = useSetAtom(selectedEModelIdAtom);

  const { contextHolder } = usePendingValidationModal();

  useEffect(() => setMEModelSection('electrophysiology'), [setMEModelSection]);

  const router = useRouter();

  const onEModelPicked = (selectedRows: ExploreESHit<ExploreResource>[]) => {
    if (selectedRows.length > 1) {
      throw new Error('Multiple e-models selected for ME-Model building. Only one is allowed');
    }

    const emodel = selectedRows[0]._source as ESeModel;
    setSelectedEModelId(emodel['@id']);

    router.push('../configure');
  };

  return (
    <>
      <div className="h-full px-10" id="explore-table-container-for-observable">
        <ExploreSectionListingView
          dataType={DataType.CircuitEModel}
          dataScope={ExploreDataScope.SelectedBrainRegion}
          selectionType="radio"
          virtualLabInfo={{ virtualLabId: params.virtualLabId, projectId: params.projectId }}
          renderButton={({ selectedRows }) => (
            <Btn
              className="fit-content sticky bottom-0 ml-auto w-fit bg-primary-8"
              onClick={() => onEModelPicked(selectedRows)}
            >
              Select e-model
            </Btn>
          )}
          statusAttribute={StatusAttribute.AnalysisSuitable}
        />
      </div>
      {contextHolder}
    </>
  );
}
