'use client';

import { useMemo } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { ExpDesignerSectionName } from '@/types/experiment-designer';
import { Params, Visualization } from '@/components/experiment-designer/sensory-input';
import { getFocusedAtom } from '@/components/experiment-designer/utils';
import SimpleErrorComponent from '@/components/GenericErrorFallback';

const SECTION_NAME: ExpDesignerSectionName = 'input';

export default function SensoryInputPage() {
  const focusedAtom = useMemo(() => getFocusedAtom(SECTION_NAME), []);

  return (
    <div className="grid h-full grid-cols-2">
      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <Params focusedAtom={focusedAtom} />
      </ErrorBoundary>

      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <Visualization sectionName={SECTION_NAME} />
      </ErrorBoundary>
    </div>
  );
}
