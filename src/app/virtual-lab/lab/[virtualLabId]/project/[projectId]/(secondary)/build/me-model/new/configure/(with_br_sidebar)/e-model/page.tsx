'use client';

import { useSetAtom } from 'jotai';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import ExploreSectionListingView from '@/components/explore-section/ExploreSectionListingView';
import { OnCellClick } from '@/components/explore-section/ExploreSectionListingView/ExploreSectionTable';
import { DataType } from '@/constants/explore-section/list-views';
import { selectedEModelIdAtom, meModelSectionAtom } from '@/state/virtual-lab/build/me-model';
import { Btn } from '@/components/Btn';
import { ESeModel, ExploreESHit, ExploreResource } from '@/types/explore-section/es';
import { ExploreDataScope } from '@/types/explore-section/application';
import { detailUrlBuilder } from '@/util/common';
import { generateVlProjectUrl } from '@/util/virtual-lab/urls';

type Params = {
  params: {
    virtualLabId: string;
    projectId: string;
  };
};

export default function ElectrophysiologyPage({ params }: Params) {
  const setMEModelSection = useSetAtom(meModelSectionAtom);
  const setSelectedEModelId = useSetAtom(selectedEModelIdAtom);

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

  const vlProjectUrl = generateVlProjectUrl(params.virtualLabId, params.projectId);
  const baseExploreUrl = `${vlProjectUrl}/explore/interactive/model/e-model`;

  const onCellClick: OnCellClick = (_basePath, record) => {
    router.push(detailUrlBuilder(baseExploreUrl, record));
  };

  return (
    <>
      <div className="h-full px-10" id="explore-table-container-for-observable">
        <ExploreSectionListingView
          dataType={DataType.CircuitEModel}
          dataScope={ExploreDataScope.Build}
          onCellClick={onCellClick}
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
        />
      </div>
    </>
  );
}
