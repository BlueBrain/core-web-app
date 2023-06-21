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
    <>
      <div className="flex justify-between my-4">
        <SubsectionTabs />
        <ModeTabs />
      </div>

      {children}
    </>
  );
}
