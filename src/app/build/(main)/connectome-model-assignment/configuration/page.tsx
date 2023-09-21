'use client';

import { Suspense } from 'react';

import { ErrorBoundary } from 'react-error-boundary';
import ConnectomeModelAssignmentView from '@/components/ConnectomeModelAssignment';

export default function ConnectomeModelAssignmentPage() {
  return (
    <Suspense fallback={null}>
      <ErrorBoundary fallback={null}>
        <ConnectomeModelAssignmentView />
      </ErrorBoundary>
    </Suspense>
  );
}
