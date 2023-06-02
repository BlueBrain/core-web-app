'use client';

import { useMemo } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useAtomValue } from 'jotai/index';

import { Params, Visualization } from '@/components/experiment-designer/stimulation-protocol';
import {
  extractTargetNamesFromSection,
  getFocusedAtom,
} from '@/components/experiment-designer/utils';
import SimpleErrorComponent from '@/components/GenericErrorFallback';

const SECTION_NAME = 'stimuli';

export default function StimulationProtocolPage() {
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
