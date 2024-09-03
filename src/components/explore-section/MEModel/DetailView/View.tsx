'use client';

import { Suspense, useEffect } from 'react';
import { UseQueryStateReturn, parseAsString, useQueryState, Options } from 'nuqs';
import { useSetAtom } from 'jotai';

import { Analysis, Configuration, Simulation } from '.';
import CentralLoadingSpinner from '@/components/CentralLoadingSpinner';
import Detail from '@/components/explore-section/Detail';
import {
  ME_MODEL_FIELDS,
  ME_MODEL_COMMON_FIELDS,
} from '@/constants/explore-section/detail-views-fields';
import SectionTabs, {
  EMODEL_TABS,
  EmodelTabKeys,
} from '@/components/explore-section/EModel/DetailView/SectionTabs';
import If from '@/components/ConditionalRenderer/If';
import GenericButton from '@/components/Global/GenericButton';
import useResourceInfoFromPath from '@/hooks/useResourceInfoFromPath';
import { initializeSummaryAtom } from '@/state/virtual-lab/build/me-model-setter';

type Params = {
  projectId: string;
  virtualLabId: string;
};

type Props = {
  vlProjectUrl: string;
  params: Params;
  showViewMode?: boolean;
};

export default function MEModelDetailView({ vlProjectUrl, params, showViewMode = false }: Props) {
  const [activeTab] = useQueryState(
    'tab',
    parseAsString.withDefault(EMODEL_TABS.at(0)!.key)
  ) as UseQueryStateReturn<EmodelTabKeys, Options>;

  // setup the e-model and m-model based on me-model resource
  const setInitializeSummary = useSetAtom(initializeSummaryAtom);

  const { id, org, project } = useResourceInfoFromPath();

  useEffect(() => {
    if (!id) return;
    setInitializeSummary(id, org, project);
  }, [setInitializeSummary, id, org, project]);

  return (
    <Suspense fallback={<CentralLoadingSpinner />}>
      <Detail
        fields={ME_MODEL_FIELDS}
        commonFields={ME_MODEL_COMMON_FIELDS}
        showViewMode={showViewMode}
      >
        {() => (
          <>
            <SectionTabs />
            <div className="w-full flex-1">
              <Suspense fallback={<CentralLoadingSpinner />}>
                <If id="configuration" condition={activeTab === 'configuration'}>
                  <Configuration />
                </If>
                <If id="analysis" condition={activeTab === 'analysis'}>
                  <Analysis />
                </If>
                <If id="simulation" condition={activeTab === 'simulation'}>
                  <Simulation {...{ params }} />
                </If>
              </Suspense>
            </div>
            <GenericButton
              text="New model"
              className="fixed bottom-10 right-10 w-[200px] bg-primary-9 font-bold text-white hover:!bg-primary-7"
              href={`${vlProjectUrl}/build/me-model/new`}
            />
          </>
        )}
      </Detail>
    </Suspense>
  );
}
