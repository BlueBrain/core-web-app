'use client';

import { ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import useAuth from '@/hooks/auth';
import { SimpleErrorComponent } from '@/components/GenericErrorFallback';
import useSessionState from '@/hooks/session';

type GenericLayoutProps = {
  children: ReactNode;
};

export default function GenericLayout({ children }: GenericLayoutProps) {
  useAuth(true);
  useSessionState();

  return <ErrorBoundary FallbackComponent={SimpleErrorComponent}>{children}</ErrorBoundary>;
}
