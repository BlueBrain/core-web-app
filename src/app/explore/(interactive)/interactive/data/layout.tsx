'use client';

import { ErrorBoundary } from 'react-error-boundary';
import { ReactNode } from 'react';
import type { MenuProps } from 'antd';
import { Button, Menu } from 'antd';
import { useParams, usePathname, useRouter } from 'next/navigation';
import SimpleErrorComponent from '@/components/GenericErrorFallback';
import { BASE_EXPLORE_PATH, INTERACTIVE_PATH } from '@/constants/explore-section/experiment-types';
import useTotalResults from '@/hooks/useTotalResults';
import BackToInteractiveExplorationBtn from '@/components/explore-section/BackToInteractiveExplorationBtn';
import { filterDataTypes } from '@/util/explore-section/data-types';
import { DataGroups } from '@/types/explore-section/data-groups';

const menuItemWidth = `${Math.floor(100 / filterDataTypes(DataGroups.ExperimentData).length)}%`;

const brainRegionSource = 'selected';

function MenuItemLabel({
  label,
  experimentTypeName,
}: {
  label: string;
  experimentTypeName: string;
}) {
  return `${label} ${useTotalResults({ experimentTypeName, brainRegionSource })}`;
}

export default function ExploreInteractiveDataLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();

  const activeExperimentPath = pathname?.split(BASE_EXPLORE_PATH).pop() || 'morphology';

  const onClick: MenuProps['onClick'] = (info) => {
    const { key, domEvent } = info;

    domEvent.preventDefault();
    domEvent.stopPropagation();

    router.push(`${BASE_EXPLORE_PATH}${key}`);
  };

  if (params?.id)
    return <ErrorBoundary FallbackComponent={SimpleErrorComponent}>{children}</ErrorBoundary>;

  const items = filterDataTypes(DataGroups.ExperimentData).map((k) => {
    return {
      active: k.name === activeExperimentPath,
      label: k.title,
      key: k.name,
      experimentTypeName: k.key,
    };
  });

  return (
    <div className="h-screen bg-primary-9 flex overflow-hidden">
      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <BackToInteractiveExplorationBtn href={INTERACTIVE_PATH} />

        <div className="flex-1 pt-12">
          <div className="flex items-center mb-8">
            <Button
              type="default"
              className="ml-10 border-1 border-primary-4 bg-primary-9 text-white font-bold cursor-default"
              style={{ borderRadius: '0px', fontSize: '1.5rem', lineHeight: '2rem' }}
              size="large"
            >
              Experimental Data
            </Button>
          </div>

          <Menu
            onClick={onClick}
            selectedKeys={[activeExperimentPath]}
            mode="horizontal"
            theme="dark"
            style={{ backgroundColor: '#002766' }}
            className="flex justify-start pl-10"
          >
            {items.map((item) => (
              <Menu.Item
                key={item.key}
                className="font-semibold text-center"
                style={{
                  backgroundColor: item.active ? 'white' : '#002766',
                  color: item.active ? '#002766' : 'white',
                  flexBasis: menuItemWidth,
                }}
              >
                <MenuItemLabel label={item.label} experimentTypeName={item.experimentTypeName} />
              </Menu.Item>
            ))}
          </Menu>
          <div className="bg-primary-9 text-white h-full w-full">{children}</div>
        </div>
      </ErrorBoundary>
    </div>
  );
}
