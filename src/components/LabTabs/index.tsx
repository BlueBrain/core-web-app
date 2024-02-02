import { ReactNode } from 'react';
import * as Popover from '@radix-ui/react-popover';

import TopNavigation from '@/components/TopNavigation';

type BrainFactoryTabsProps = {
  children: ReactNode;
};

export default function BrainFactoryTabs({ children }: BrainFactoryTabsProps) {
  return (
    <div className="flex w-full">
      <TopNavigation.Main>
        <div className="flex">
          <Popover.Root>
            <Popover.Trigger className="flex-auto bg-secondary-2 px-8 text-white">
              Build & Simulate
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content className="z-[100] flex flex-col text-white">
                {children}
                <Popover.Arrow className="fill-white" />
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
        </div>
      </TopNavigation.Main>

      <TopNavigation.PrimaryDropdown
        items={[
          {
            label: 'Cell composition',
            href: '/build/cell-composition/interactive',
            baseHref: '/build/cell-composition',
          },
          {
            label: 'Cell model assignment',
            href: '/build/cell-model-assignment',
            baseHref: '/build/cell-model-assignment',
          },
          {
            label: 'Connectome definition',
            href: '/build/connectome-definition/configuration/macro',
            baseHref: '/build/connectome-definition',
          },
          {
            label: 'Connectome model assignment',
            href: '/build/connectome-model-assignment/configuration',
            baseHref: '/build/connectome-model-assignment',
          },
        ]}
      />
    </div>
  );
}
