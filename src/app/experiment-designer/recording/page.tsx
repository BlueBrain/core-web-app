'use client';

import { useMemo } from 'react';

import { Params, Visualization } from '@/components/experiment-designer/recording';
import { getFocusedAtom } from '@/components/experiment-designer/utils';

export default function RecordingPage() {
  const sectionName = 'recording';
  const focusedAtom = useMemo(() => getFocusedAtom(sectionName), [sectionName]);

  return (
    <div className="grid grid-cols-2 h-full">
      <Params focusedAtom={focusedAtom} />
      <Visualization focusedAtom={focusedAtom} />
    </div>
  );
}
