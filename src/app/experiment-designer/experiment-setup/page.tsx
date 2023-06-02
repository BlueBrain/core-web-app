'use client';

import { useMemo } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import find from 'lodash/find';
import isArray from 'lodash/isArray';
import { useAtomValue } from 'jotai';

import { Params, Visualization } from '@/components/experiment-designer/experiment-setup';
import { getFocusedAtom } from '@/components/experiment-designer/utils';
import SimpleErrorComponent from '@/components/GenericErrorFallback';
import { ExpDesignerTargetParameter } from '@/types/experiment-designer';

const SECTION_NAME = 'setup';

export default function ExperimentSetupPage() {
  const focusedAtom = useMemo(() => getFocusedAtom(SECTION_NAME), []);
  const setupConfig = useAtomValue(focusedAtom);

  const targetsToDisplay = useMemo(() => {
    const simulatedNeurons = find(
      setupConfig,
      (setupEntry) => setupEntry.id === 'simulatedNeurons'
    ) as ExpDesignerTargetParameter;
    const targetsValue: string | string[] = simulatedNeurons?.value;
    return isArray(targetsValue) ? targetsValue : [targetsValue];
  }, [setupConfig]);

  return (
    <div className="grid grid-cols-2 h-full">
      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <Params focusedAtom={focusedAtom} />
      </ErrorBoundary>

      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <Visualization targetsToDisplay={targetsToDisplay} />
      </ErrorBoundary>
    </div>
  );
}
