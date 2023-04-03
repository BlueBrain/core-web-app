'use client';

import { ReactNode } from 'react';

import { ExperimentDesignerTopTabs, SaveBtn, SimulateBtn } from '@/components/experiment-designer';
import useAuth from '@/hooks/auth';

type ExperimentDesignerLayoutProps = {
  children: ReactNode;
};

export default function ExperimentDesignerLayout({ children }: ExperimentDesignerLayoutProps) {
  useAuth(true);

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
