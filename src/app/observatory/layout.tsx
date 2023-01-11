'use client';

import { ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import useEnsureLogin from '@/hooks/ensure-login';
import { SimpleErrorComponent } from '@/components/GenericErrorFallback';

type GenericLayoutProps = {
  children: ReactNode;
};

export default function GenericLayout({ children }: GenericLayoutProps) {
  useEnsureLogin();

  return <ErrorBoundary FallbackComponent={SimpleErrorComponent}>{children}</ErrorBoundary>;
}
