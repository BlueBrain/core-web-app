'use client';

import { ReactNode } from 'react';

import {
  SubsectionTabs,
  ModeTabs,
} from '@/components/build-section/cell-model-assignment/CellModelAssignmentTabs';
import usePathname from '@/hooks/pathname';
import { classNames } from '@/util/utils';

type Props = {
  children: ReactNode;
};

export default function CellModelAssignmentLayout({ children }: Props) {
  const pathName = usePathname();
  const isInteractive = pathName?.includes('interactive');
  const tabsBackgroundColor = isInteractive ? 'bg-[#0c1840]' : '';
  const textColor = isInteractive ? 'text-white border-white' : 'text-primary-8 border-primary-8';

  return (
    <div className="flex flex-col h-full">
      <div className={classNames('flex justify-between p-4 flex-initial', tabsBackgroundColor)}>
        <SubsectionTabs className={textColor} />
        <ModeTabs />
      </div>

      <div className="relative flex-1">{children}</div>
    </div>
  );
}
