'use client';

import { useMemo } from 'react';

import { ErrorBoundary } from 'react-error-boundary';
import { Params, Visualization } from '@/components/experiment-designer/experiment-setup';
import { getFocusedAtom } from '@/components/experiment-designer/utils';
import SimpleErrorComponent from '@/components/GenericErrorFallback';

export default function ExperimentSetupPage() {
  const sectionName = 'setup';
  const focusedAtom = useMemo(() => getFocusedAtom(sectionName), [sectionName]);

  return (
    <div className="grid grid-cols-2 h-full">
      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <Params focusedAtom={focusedAtom} />
      </ErrorBoundary>

      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <Visualization focusedAtom={focusedAtom} />
      </ErrorBoundary>
    </div>
  );
}
