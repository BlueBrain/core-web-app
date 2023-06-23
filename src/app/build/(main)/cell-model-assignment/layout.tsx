'use client';

import { ReactNode } from 'react';

import {
  SubsectionTabs,
  ModeTabs,
} from '@/components/build-section/cell-model-assignment/CellModelAssignmentTabs';

type Props = {
  children: ReactNode;
};

export default function CellModelAssignmentLayout({ children }: Props) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between py-4 flex-initial bg-dark">
        <SubsectionTabs />
        <ModeTabs />
      </div>

      <div className="relative flex-1">{children}</div>
    </div>
  );
}
