'use client';

import { ReactNode, useMemo } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import { useParams, usePathname, useRouter } from 'next/navigation';
import SimpleErrorComponent from '@/components/GenericErrorFallback';
import BackToInteractiveExplorationBtn from '@/components/explore-section/BackToInteractiveExplorationBtn';
import { DataType } from '@/constants/explore-section/list-views';
import { DATA_TYPES_TO_CONFIGS } from '@/constants/explore-section/data-types';
import { EXPERIMENT_DATA_TYPES } from '@/constants/explore-section/data-types/experiment-data-types';
import { MODEL_DATA_TYPES } from '@/constants/explore-section/data-types/model-data-types';
import { useLoadableValue } from '@/hooks/hooks';
import { totalByExperimentAndRegionsAtom } from '@/state/explore-section/list-view-atoms';
import { VirtualLabInfo } from '@/types/virtual-lab/common';
import { ExploreDataScope } from '@/types/explore-section/application';

const menuItemWidth = `${Math.floor(100 / Object.keys(EXPERIMENT_DATA_TYPES).length) - 0.01}%`;

const dataScope = ExploreDataScope.SelectedBrainRegion;

function MenuItemLabel({
  label,
  dataType,
  virtualLabInfo,
}: {
  label: string;
  dataType: DataType;
  virtualLabInfo?: VirtualLabInfo;
}) {
  const totalByExperimentAndRegions = useLoadableValue(
    totalByExperimentAndRegionsAtom({ dataType, dataScope, virtualLabInfo })
  );
  return `${label} ${
    totalByExperimentAndRegions.state === 'hasData' ? `(${totalByExperimentAndRegions.data})` : ''
  }`;
}

export default function ExploreListingLayout({
  children,
  virtualLabInfo,
}: {
  children: ReactNode;
  virtualLabInfo?: VirtualLabInfo;
}) {
  const pathname = usePathname();
  const splittedPathname = pathname.split('/');
  const interactivePageHref = splittedPathname.slice(0, splittedPathname.length - 2).join('/');
  const router = useRouter();
  const params = useParams();
  const config = pathname.includes('experimental') ? EXPERIMENT_DATA_TYPES : MODEL_DATA_TYPES;

  const activePath = pathname?.split('/').pop() || 'morphology';
  const onClick: MenuProps['onClick'] = (info) => {
    const { key, domEvent } = info;

    domEvent.preventDefault();
    domEvent.stopPropagation();
    router.push(key);
  };

  const items = useMemo(
    () =>
      Object.keys(config).map((dataType) => {
        const key = DATA_TYPES_TO_CONFIGS[dataType as DataType].name;
        const active = DATA_TYPES_TO_CONFIGS[dataType as DataType].name === activePath;
        const label = DATA_TYPES_TO_CONFIGS[dataType as DataType].title;

        return {
          key,
          title: label,
          label: (
            <MenuItemLabel
              dataType={dataType as DataType}
              label={label}
              virtualLabInfo={virtualLabInfo}
            />
          ),
          className: 'text-center font-semibold',
          style: {
            backgroundColor: active ? 'white' : '#002766',
            color: active ? '#002766' : 'white',
            flexBasis: menuItemWidth,
          },
        };
      }),
    [activePath, config, virtualLabInfo]
  );

  if (params?.id)
    return <ErrorBoundary FallbackComponent={SimpleErrorComponent}>{children}</ErrorBoundary>;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-primary-9" id="interactive-data-layout">
      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <BackToInteractiveExplorationBtn href={interactivePageHref} />
        <div className="flex-1">
          <Menu
            onClick={onClick}
            selectedKeys={[activePath]}
            mode="horizontal"
            theme="dark"
            style={{ backgroundColor: '#002766' }}
            className="flex w-full justify-start"
            items={items}
          />
          <div className="h-full w-full bg-primary-9 text-white">{children}</div>
        </div>
      </ErrorBoundary>
    </div>
  );
}
