'use client';

import { useSetAtom } from 'jotai';
import { useEffect } from 'react';

import { morphologyTypeAtom } from '@/state/virtual-lab/build/me-model';

export default function ReconstrucedMorphologyPage() {
  const setMorphologyType = useSetAtom(morphologyTypeAtom);

  useEffect(() => setMorphologyType('reconstructed'), [setMorphologyType]);

  return (
    <div className="h-full">
      <div>RECONSTRUCTED_MORPHOLOGIES_LIST</div>
    </div>
  );
}
