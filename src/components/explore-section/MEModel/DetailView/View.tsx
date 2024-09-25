'use client';

import { Suspense, useEffect } from 'react';
import { UseQueryStateReturn, parseAsString, useQueryState, Options } from 'nuqs';
import { useSetAtom } from 'jotai';
import Link from 'next/link';

import { Analysis, Configuration, Simulation } from '.';

import { ModelTypeNames } from '@/constants/explore-section/data-types/model-data-types';
import {
  DataTypeToNewSimulationPage,
  DataTypeToNexusType,
} from '@/constants/explore-section/list-views';

import CentralLoadingSpinner from '@/components/CentralLoadingSpinner';
import Detail from '@/components/explore-section/Detail';
import {
  ME_MODEL_FIELDS,
  MODEL_DATA_COMMON_FIELDS,
} from '@/constants/explore-section/detail-views-fields';
import SectionTabs, {
  EMODEL_TABS,
  EmodelTabKeys,
} from '@/components/explore-section/EModel/DetailView/SectionTabs';
import If from '@/components/ConditionalRenderer/If';

import useResourceInfoFromPath from '@/hooks/useResourceInfoFromPath';

import { initializeSummaryAtom } from '@/state/virtual-lab/build/me-model-setter';

import { generateVlProjectUrl } from '@/util/virtual-lab/urls';
import { to64 } from '@/util/common';

type Params = {
  id: string;
  modelType: ModelTypeNames;
  projectId: string;
  virtualLabId: string;
};

type Props = {
  params: Params;
  showViewMode?: boolean;
};

export default function MEModelDetailView({ params, showViewMode = false }: Props) {
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

  const getSimulationId = (meModelId: string) => {
    const vlProjectUrl = generateVlProjectUrl(params.virtualLabId, params.projectId);
    const basePath = `${vlProjectUrl}/simulate/${DataTypeToNewSimulationPage[DataTypeToNexusType.CircuitMEModel]}/new`;
    return `${basePath}/${to64(`${params.projectId}!/!${meModelId}`)}`;
  };

  return (
    <Suspense fallback={<CentralLoadingSpinner />}>
      <Detail
        fields={ME_MODEL_FIELDS}
        commonFields={MODEL_DATA_COMMON_FIELDS}
        showViewMode={showViewMode}
        extraHeaderAction={
          id && (
            <Link
              className="flex h-11 items-center gap-2 rounded-none border border-gray-300 px-8 shadow-none"
              href={getSimulationId(id)}
            >
              Simulate
            </Link>
          )
        }
      >
        {() => (
          <>
            <SectionTabs />
            <div className="w-full flex-1">
              <Suspense fallback={<CentralLoadingSpinner />}>
                <If id="configuration" condition={activeTab === 'configuration'}>
                  <Configuration params={params} />
                </If>
                <If id="analysis" condition={activeTab === 'analysis'}>
                  <Analysis />
                </If>
                <If id="simulation" condition={activeTab === 'simulation'}>
                  <Simulation {...{ params }} />
                </If>
              </Suspense>
            </div>
            {/* Hiding button SfN */}
            {/* <GenericButton
              text="New model"
              className="fixed bottom-10 right-10 w-[200px] bg-primary-9 font-bold text-white hover:!bg-primary-7"
              href={`${vlProjectUrl}/build/me-model/new`}
            /> */}
          </>
        )}
      </Detail>
    </Suspense>
  );
}
