'use client';

import { useMemo } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useAtomValue } from 'jotai';

import { Params, Visualization } from '@/components/experiment-designer/sensory-input';
import {
  extractTargetNamesFromSection,
  getFocusedAtom,
} from '@/components/experiment-designer/utils';
import SimpleErrorComponent from '@/components/GenericErrorFallback';

const SECTION_NAME = 'input';

export default function SensoryInputPage() {
  const focusedAtom = useMemo(() => getFocusedAtom(SECTION_NAME), []);
  const inputSectionParams = useAtomValue(focusedAtom);

  const targetsToDisplay = useMemo(
    () => extractTargetNamesFromSection(inputSectionParams),
    [inputSectionParams]
  );

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
