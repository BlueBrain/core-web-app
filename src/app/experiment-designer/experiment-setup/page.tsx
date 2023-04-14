'use client';

import { useMemo } from 'react';

import { Params, Visualization } from '@/components/experiment-designer/experiment-setup';
import { getFocusedAtom } from '@/components/experiment-designer/utils';

export default function ExperimentSetupPage() {
  const sectionName = 'setup';
  const focusedAtom = useMemo(() => getFocusedAtom(sectionName), [sectionName]);

  return (
    <div className="columns-2 h-full">
      <Params focusedAtom={focusedAtom} />
      <Visualization focusedAtom={focusedAtom} />
    </div>
  );
}
