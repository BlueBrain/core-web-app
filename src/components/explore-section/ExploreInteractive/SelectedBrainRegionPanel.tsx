'use client';

import { useAtomValue } from 'jotai';
import { useMemo } from 'react';
import { unwrap } from 'jotai/utils';
import { BrainRegionExperimentsCount } from './BrainRegionExperimentsCount';
import { LiteratureForExperimentType } from './LiteratureForExperimentType';
import { visibleExploreBrainRegionsAtom } from '@/state/explore-section/interactive';
import { brainRegionsAtom } from '@/state/brain-regions';
import { BrainRegion } from '@/types/ontologies';

export const defaultTabColor = '#ffffff';

export default function SelectedBrainRegionPanel() {
  const visualizedBrainRegions = useAtomValue(visibleExploreBrainRegionsAtom);
  const brainRegions = useAtomValue(useMemo(() => unwrap(brainRegionsAtom), []));
  const visualizedBrainRegionDetails = visualizedBrainRegions.reduce<BrainRegion[]>(
    (acc, selectedRegion) => {
      const selected = brainRegions?.find((brainRegion) => brainRegion.id === selectedRegion);

      return selected ? [...acc, selected] : acc;
    },
    []
  );

  return visualizedBrainRegionDetails.length > 0 ? (
    <div className="absolute bottom-0 bg-[#000000b3] z-10 w-full px-10 min-h-[200px]">
      <div className="flex">
        <BrainRegionExperimentsCount brainRegions={visualizedBrainRegionDetails} />
        <LiteratureForExperimentType brainRegions={visualizedBrainRegionDetails} />
      </div>
    </div>
  ) : null;
}
