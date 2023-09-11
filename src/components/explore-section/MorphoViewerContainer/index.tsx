'use client';

import { useState } from 'react';
import MorphoWrapper from './MorphoWrapper';
import { MorphoViewerOptions } from './MorphologyViewer';
import { ReconstructedNeuronMorphology } from '@/types/explore-section/delta';

function MorphoViewerContainer({ resource }: { resource: ReconstructedNeuronMorphology }) {
  const [options, setOptions] = useState<MorphoViewerOptions>({
    asPolyline: false,
    focusOn: true,
    somaMode: 'fromOrphanSections',
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
