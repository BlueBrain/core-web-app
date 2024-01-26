'use client';

import { ReactNode, useMemo } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import { usePathname, useRouter, useParams } from 'next/navigation';
import SimpleErrorComponent from '@/components/GenericErrorFallback';
import BackToInteractiveExplorationBtn from '@/components/explore-section/BackToInteractiveExplorationBtn';
import { DataType } from '@/constants/explore-section/list-views';
import { DATA_TYPES_TO_CONFIGS } from '@/constants/explore-section/data-types';
import { EXPERIMENT_DATA_TYPES } from '@/constants/explore-section/data-types/experiment-data-types';
import { useLoadableValue } from '@/hooks/hooks';
import { totalByExperimentAndRegionsAtom } from '@/state/explore-section/list-view-atoms';
import { INTERACTIVE_PATH } from '@/constants/explore-section/paths';
import { DATA_TYPE_GROUPS_CONFIG } from '@/constants/explore-section/data-type-groups';
import { DataTypeGroup } from '@/types/explore-section/data-types';

const menuItemWidth = `${Math.floor(100 / Object.keys(EXPERIMENT_DATA_TYPES).length) - 0.01}%`;

const brainRegionSource = 'selected';

function MenuItemLabel({ label, dataType }: { label: string; dataType: DataType }) {
  const totalByExperimentAndRegions = useLoadableValue(
    totalByExperimentAndRegionsAtom({ dataType, brainRegionSource })
  );
  return `${label} ${
    totalByExperimentAndRegions.state === 'hasData' ? `(${totalByExperimentAndRegions.data})` : ''
  }`;
}

export default function ExploreInteractiveDataLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();

  const dataTypeGroup = DataTypeGroup.ExperimentalData;
  const config = EXPERIMENT_DATA_TYPES;
  const { basePath } = DATA_TYPE_GROUPS_CONFIG[dataTypeGroup];
  const activePath = pathname?.split(basePath).pop() || 'morphology';

  const onClick: MenuProps['onClick'] = (info) => {
    const { key, domEvent } = info;

    domEvent.preventDefault();
    domEvent.stopPropagation();

    router.push(`${basePath}${key}`);
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
          label: <MenuItemLabel dataType={dataType as DataType} label={label} />,
          className: 'text-center font-semibold',
          style: {
            backgroundColor: active ? 'white' : '#002766',
            color: active ? '#002766' : 'white',
            flexBasis: menuItemWidth,
          },
        };
      }),
    [activePath, config]
  );

  if (params?.id)
    return <ErrorBoundary FallbackComponent={SimpleErrorComponent}>{children}</ErrorBoundary>;

  return (
    <div className="h-screen bg-primary-9 flex overflow-hidden" id="interactive-data-layout">
      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <BackToInteractiveExplorationBtn href={INTERACTIVE_PATH} />
        <div className="flex-1">
          <Menu
            onClick={onClick}
            selectedKeys={[activePath]}
            mode="horizontal"
            theme="dark"
            style={{ backgroundColor: '#002766' }}
            className="flex justify-start w-full"
            items={items}
          />
          <div className="bg-primary-9 text-white h-full w-full">{children}</div>
        </div>
      </ErrorBoundary>
    </div>
  );
}
