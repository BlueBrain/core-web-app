'use client';

import { ErrorBoundary } from 'react-error-boundary';
import ActivityTable from '@/components/VirtualLab/ActivityView/ActivityTable';

export default function VirtualLabProjectActivityPage() {
  return (
    <ErrorBoundary
      fallback={
        <div className="flex h-full items-center justify-center">Something went wrong...</div>
      }
    >
      <div className="flex h-full w-full flex-col">
        <ActivityTable />
      </div>
    </ErrorBoundary>
  );
}
