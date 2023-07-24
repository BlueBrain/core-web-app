'use client';

import { ReactNode, Suspense } from 'react';

import { ConnectomeModelAssignmentTabs } from '@/components/connectome-model-assignment';

type ConnectomeModelAssignmentLayoutProps = {
  children: ReactNode;
};

export default function ConnectomeModelAssignmentLayout({
  children,
}: ConnectomeModelAssignmentLayoutProps) {
  return (
    <div>
      <div>
        <ConnectomeModelAssignmentTabs />
      </div>

      <Suspense fallback={null}>{children}</Suspense>
    </div>
  );
}
