'use client';

import { useState } from 'react';
import MorphoWrapper from './MorphoWrapper';
import { MorphoViewerOptions } from './MorphologyViewer';
import { DeltaResource } from '@/types/explore-section/resources';

function MorphoViewerContainer({ resource }: { resource: DeltaResource }) {
  const [options, setOptions] = useState<MorphoViewerOptions>({
    asPolyline: false,
    focusOn: true,
    somaMode: 'fromOrphanSections',
    showScale: true,
    showOrientation: true,
    showLegend: true,
  });

  const handleAsPolyline = () => {
    setOptions({
      ...options,
      asPolyline: !options.asPolyline,
    });
  };

  return (
    <MorphoWrapper
      {...{
        resource,
        options,
        onPolylineClick: handleAsPolyline,
      }}
    />
  );
}

export default MorphoViewerContainer;
