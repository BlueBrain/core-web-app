'use client';

import { ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import SimpleErrorComponent from '@/components/GenericErrorFallback';
import VirtualLabTopMenu from '@/components/VirtualLab/VirtualLabTopMenu';
import WrapperBanner from '@/components/WrapperBanner';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <WrapperBanner>
      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <VirtualLabTopMenu className="absolute right-10 top-10 text-white" />
        {children}
      </ErrorBoundary>
    </WrapperBanner>
  );
}
