'use client';

import { useMemo } from 'react';

import { Params, Visualization } from '@/components/experiment-designer/stimulation-protocol';
import { getFocusedAtom } from '@/components/experiment-designer/utils';

export default function StimulationProtocolPage() {
  const sectionName = 'stimuli';
  const focusedAtom = useMemo(() => getFocusedAtom(sectionName), [sectionName]);

  return (
    <div className="grid grid-cols-2">
      <Params focusedAtom={focusedAtom} />
      <Visualization focusedAtom={focusedAtom} />
    </div>
  );
}
