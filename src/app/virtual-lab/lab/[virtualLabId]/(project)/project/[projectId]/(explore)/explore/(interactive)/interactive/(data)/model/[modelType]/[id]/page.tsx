'use client';

import { Suspense } from 'react';
import { UseQueryStateReturn, parseAsString, useQueryState, Options } from 'nuqs';

import CentralLoadingSpinner from '@/components/CentralLoadingSpinner';
import Detail from '@/components/explore-section/Detail';
import { E_MODEL_FIELDS } from '@/constants/explore-section/detail-views-fields';
import SectionTabs, {
  EMODEL_TABS,
  EmodelTabKeys,
} from '@/components/explore-section/EModel/DetailView/SectionTabs';
import {
  Analysis,
  Configuration,
  Simulation,
} from '@/components/explore-section/EModel/DetailView';
import If from '@/components/ConditionalRenderer/If';

export default function EModelPage() {
  const [activeTab] = useQueryState(
    'tab',
    parseAsString.withDefault(EMODEL_TABS.at(0)!.key)
  ) as UseQueryStateReturn<EmodelTabKeys, Options>;

  return (
    <Suspense fallback={<CentralLoadingSpinner />}>
      <Detail fields={E_MODEL_FIELDS}>
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
                  <Simulation />
                </If>
              </Suspense>
            </div>
          </>
        )}
      </Detail>
    </Suspense>
  );
}
