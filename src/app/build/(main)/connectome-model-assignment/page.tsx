'use client';

import { Suspense } from 'react';

import ConnectomeModelAssignmentView from '@/components/ConnectomeModelAssignment';

export default function ConnectomeModelAssignmentPage() {
  return (
    <Suspense fallback={null}>
      <ConnectomeModelAssignmentView />
    </Suspense>
  );
}
