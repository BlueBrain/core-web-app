'use client';

import { ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { ExperimentDesignerTopTabs, SaveBtn, SimulateBtn } from '@/components/experiment-designer';
import useAuth from '@/hooks/auth';
import { SimpleErrorComponent } from '@/components/GenericErrorFallback';
import useSessionState from '@/hooks/session';

type ExperimentDesignerLayoutProps = {
  children: ReactNode;
};

export default function ExperimentDesignerLayout({ children }: ExperimentDesignerLayoutProps) {
  useAuth(true);
  useSessionState();

  return (
    <div className="h-screen">
      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <ExperimentDesignerTopTabs />
      </ErrorBoundary>

      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <div className="h-full">{children}</div>
      </ErrorBoundary>

      <div className="absolute bottom-5 right-5 flex gap-5">
        <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
          <SaveBtn />
          <SimulateBtn />
        </ErrorBoundary>
      </div>
    </div>
  );
}
