'use client';

import { useState } from 'react';
import { BrainRegion } from '@/types/ontologies';

type Props = {
  brainRegion: BrainRegion;
  isActive: boolean;
};

export function BrainRegionTabLabel({ brainRegion, isActive }: Props) {
  const [isHovering, setIsHovering] = useState(false);
  return (
    <span
      style={{ color: isHovering || isActive ? brainRegion.colorCode : '#ffffff' }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      data-testid="brain-region-tab-label"
    >
      {brainRegion.title}
    </span>
  );
}
