'use client';

import { useSetAtom } from 'jotai';
import { useEffect } from 'react';

import { meModelSectionAtom } from '@/state/virtual-lab/build/me-model';

export default function ElectrophysiologyPage() {
  const setMEModelSection = useSetAtom(meModelSectionAtom);

  useEffect(() => setMEModelSection('electrophysiology'), [setMEModelSection]);

  return (
    <div className="h-full px-10">
      <div>Electrophysiology</div>
    </div>
  );
}
