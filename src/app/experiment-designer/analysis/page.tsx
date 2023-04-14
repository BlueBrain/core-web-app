'use client';

import { useMemo } from 'react';

import { Params, Visualization } from '@/components/experiment-designer/analysis';
import { getFocusedAtom } from '@/components/experiment-designer/utils';

export default function AnalysisPage() {
  const sectionName = 'analysis';
  const focusedAtom = useMemo(() => getFocusedAtom(sectionName), [sectionName]);

  return (
    <div className="columns-2 h-full">
      <Params focusedAtom={focusedAtom} />
      <Visualization focusedAtom={focusedAtom} />
    </div>
  );
}
