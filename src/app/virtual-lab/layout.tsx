import { ErrorBoundary } from 'react-error-boundary';
import { ReactNode } from 'react';
import SimpleErrorComponent from '@/components/GenericErrorFallback';

export default async function VirtualLabLayout({ children }: { children: ReactNode }) {
  return <ErrorBoundary FallbackComponent={SimpleErrorComponent}>{children}</ErrorBoundary>;
}
