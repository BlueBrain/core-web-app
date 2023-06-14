'use client';

import { useMemo } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { ExpDesignerSectionName } from '@/types/experiment-designer';
import { Params, Visualization } from '@/components/experiment-designer/experiment-setup';
import { getFocusedAtom } from '@/components/experiment-designer/utils';
import SimpleErrorComponent from '@/components/GenericErrorFallback';

const SECTION_NAME: ExpDesignerSectionName = 'setup';

export default function ExperimentSetupPage() {
  const focusedAtom = useMemo(() => getFocusedAtom(SECTION_NAME), []);

  return (
    <div className="grid grid-cols-2 h-full">
      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <Params focusedAtom={focusedAtom} />
      </ErrorBoundary>

      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <Visualization sectionName={SECTION_NAME} />
      </ErrorBoundary>
    </div>
  );
}
