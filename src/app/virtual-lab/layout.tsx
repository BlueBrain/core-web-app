import { ErrorBoundary } from 'react-error-boundary';
import { ReactNode } from 'react';
import SimpleErrorComponent from '@/components/GenericErrorFallback';

export default async function VirtualLabLayout({ children }: { children: ReactNode }) {
  return (
    <div className="h-screen overflow-y-auto bg-primary-9 text-white">
      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>{children}</ErrorBoundary>
    </div>
  );
}
