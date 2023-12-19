'use client';

import { ErrorBoundary } from 'react-error-boundary';
import { ReactNode } from 'react';
import type { MenuProps } from 'antd';
import { Menu, Button } from 'antd';
import { usePathname, useRouter, useParams } from 'next/navigation';

import SimpleErrorComponent from '@/components/GenericErrorFallback';
import {
  BASE_EXPLORE_PATH,
  EXPERIMENT_DATA_TYPES,
  INTERACTIVE_PATH,
} from '@/constants/explore-section/experiment-types';
import { SIMULATION_CAMPAIGNS } from '@/constants/explore-section/list-views';
import useTotalResults from '@/hooks/useTotalResults';
import BackToInteractiveExplorationBtn from '@/components/explore-section/BackToInteractiveExplorationBtn';

const menuItemWidth = `${Math.floor(100 / Object.keys(EXPERIMENT_DATA_TYPES).length)}%`;

const brainRegionSource = 'data';

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

  const items = Object.keys(EXPERIMENT_DATA_TYPES)
    .filter((item) => item !== SIMULATION_CAMPAIGNS)
    .map((k) => {
      return {
        active: EXPERIMENT_DATA_TYPES[k].name === activeExperimentPath,
        label: EXPERIMENT_DATA_TYPES[k].title,
        key: EXPERIMENT_DATA_TYPES[k].name,
        experimentTypeName: k,
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
