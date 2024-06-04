import { ErrorBoundary } from 'react-error-boundary';
import { ReactNode } from 'react';
import { useAuthenticatedRoute } from '@/hooks/server-safe-hooks';
import SimpleErrorComponent from '@/components/GenericErrorFallback';

export default async function VirtualLabLayout({ children }: { children: ReactNode }) {
  await useAuthenticatedRoute();
  return (
    <div className="h-screen overflow-y-auto bg-primary-9 text-white">
      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>{children}</ErrorBoundary>
    </div>
  );
}
