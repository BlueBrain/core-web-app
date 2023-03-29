'use client';

import { ReactNode } from 'react';

import ExperimentDesignerTopTabs from '@/components/experiment-designer/ExperimentDesignerTopTabs';
import SaveBtn from '@/components/experiment-designer/SaveBtn';
import SimulateBtn from '@/components/experiment-designer/SimulateBtn';

type ExperimentDesignerLayoutProps = {
  children: ReactNode;
};

export default function ExperimentDesignerLayout({ children }: ExperimentDesignerLayoutProps) {
  return (
    <div className="h-screen">
      <ExperimentDesignerTopTabs />

      <div className="h-full">{children}</div>

      <div className="absolute bottom-5 right-5 flex gap-5">
        <SaveBtn />
        <SimulateBtn />
      </div>
    </div>
  );
}
