'use client';

import { Suspense } from 'react';

import { ErrorBoundary } from 'react-error-boundary';
import ConnectomeModelAssignmentView from '@/components/ConnectomeModelAssignment';
import useLiteratureCleanNavigate from '@/components/explore-section/Literature/useLiteratureCleanNavigate';

export default function ConnectomeModelAssignmentPage() {
  useLiteratureCleanNavigate();

  return (
    <Suspense fallback={null}>
      <ErrorBoundary fallback={null}>
        <ConnectomeModelAssignmentView />
      </ErrorBoundary>
    </Suspense>
  );
}
