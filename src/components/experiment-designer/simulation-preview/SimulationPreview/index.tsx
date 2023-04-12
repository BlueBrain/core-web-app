'use client';

import { useEffect, useRef, useState } from 'react';
import threeCtxWrapper from '@/visual/ThreeCtxWrapper';
import PreviewMesh from '@/components/experiment-designer/simulation-preview/PreviewMesh';

export default function SimulationPreview() {
  const [ready, isReady] = useState(false);
  const threeDeeDiv = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (threeDeeDiv.current) {
      threeCtxWrapper.init({ targetDiv: threeDeeDiv.current });
      isReady(true);
    }
  }, [threeDeeDiv]);

  return (
    <>
      <div className="flex h-full w-full" ref={threeDeeDiv} />
      {ready ? <PreviewMesh /> : null}
    </>
  );
}
