'use client';

import { useMemo } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { Params, Visualization } from '@/components/experiment-designer/stimulation-protocol';
import { getFocusedAtom } from '@/components/experiment-designer/utils';
import SimpleErrorComponent from '@/components/GenericErrorFallback';
import { ExpDesignerSectionName } from '@/types/experiment-designer';

const SECTION_NAME: ExpDesignerSectionName = 'stimuli';

export default function StimulationProtocolPage() {
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
