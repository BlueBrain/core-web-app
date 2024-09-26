'use client';

import { Suspense } from 'react';
import { UseQueryStateReturn, parseAsString, useQueryState, Options } from 'nuqs';

import CentralLoadingSpinner from '@/components/CentralLoadingSpinner';
import {
  EMODEL_TABS,
  EmodelTabKeys,
} from '@/components/explore-section/EModel/DetailView/SectionTabs';
import {
  Analysis,
  Configuration,
  Simulation,
} from '@/components/explore-section/EModel/DetailView';
import If from '@/components/ConditionalRenderer/If';

export default function EModelDetailPage() {
  const [activeTab] = useQueryState(
    'tab',
    parseAsString.withDefault(EMODEL_TABS.at(0)!.key)
  ) as UseQueryStateReturn<EmodelTabKeys, Options>;

  return (
    <Suspense fallback={<CentralLoadingSpinner />}>
      <If id="configuration" condition={activeTab === 'configuration'}>
        <Configuration
          params={{
            id: '',
            projectId: '',
            virtualLabId: '',
          }}
        />
      </If>
      <If id="analysis" condition={activeTab === 'analysis'}>
        <Analysis />
      </If>
      <If id="simulation" condition={activeTab === 'simulation'}>
        <Simulation />
      </If>
    </Suspense>
  );
}
