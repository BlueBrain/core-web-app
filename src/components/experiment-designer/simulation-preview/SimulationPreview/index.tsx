'use client';

import { useEffect, useRef, useState } from 'react';
import threeCtxWrapper from '@/visual/ThreeCtxWrapper';
import PreviewMesh from '@/components/experiment-designer/simulation-preview/PreviewMesh';

export default function SimulationPreview() {
  const [ready, isReady] = useState(false);
  const threeDeeDiv = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (threeDeeDiv.current) {
      threeCtxWrapper.init({
        targetDiv: threeDeeDiv.current,
        cameraPositionXYZ: [-17970.783508199806, -17086.701412939885, -19588.70241470358],
      });
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
