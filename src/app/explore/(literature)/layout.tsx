'use client';

import { ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import SimpleErrorComponent from '@/components/GenericErrorFallback';
import Sidebar from '@/components/explore-section/Literature/components/SideBar';

type LiteratureLayoutProps = {
  children: ReactNode;
};

export default function GenericLayout({ children }: LiteratureLayoutProps) {
  return (
    <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
      <Sidebar />
      {children}
    </ErrorBoundary>
  );
}
