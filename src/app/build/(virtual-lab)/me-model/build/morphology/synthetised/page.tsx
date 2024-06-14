'use client';

import { useSetAtom } from 'jotai';
import { useEffect } from 'react';

import { morphologyTypeAtom } from '@/state/virtual-lab/build/me-model';

export default function SynthetisedMorphologyPage() {
  const setMorphologyType = useSetAtom(morphologyTypeAtom);

  useEffect(() => setMorphologyType('synthetised'), [setMorphologyType]);

  return (
    <div className="h-full">
      <div>SYNTHETISED_MORPHOLOGIES_LIST</div>
    </div>
  );
}
