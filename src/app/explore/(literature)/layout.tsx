'use client';

import { ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import SimpleErrorComponent from '@/components/GenericErrorFallback';
import LiteratureSidebar from '@/components/explore-section/Literature/components/LiteratureSideBar';

type LiteratureLayoutProps = {
  children: ReactNode;
};

export default function GenericLayout({ children }: LiteratureLayoutProps) {
  return (
    <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
      <div className="h-full overflow-hidden">
        <LiteratureSidebar />
        {children}
      </div>
    </ErrorBoundary>
  );
}
