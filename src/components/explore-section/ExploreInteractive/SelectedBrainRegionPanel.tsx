'use client';

import { useAtomValue } from 'jotai';
import { useMemo } from 'react';
import { unwrap } from 'jotai/utils';
import { ExperimentsTotals } from './ExperimentsTotals';
import { LiteratureForExperimentType } from './LiteratureForExperimentType';
import { BrainRegion } from '@/types/ontologies';
import { brainRegionsAtom, dataBrainRegionsAtom } from '@/state/brain-regions';

export const defaultTabColor = '#ffffff';

export default function SelectedBrainRegionPanel() {
  const dataBrainRegions = useAtomValue(dataBrainRegionsAtom);
  const brainRegions = useAtomValue(useMemo(() => unwrap(brainRegionsAtom), []));
  const dataBrainRegionDetails = Object.keys(dataBrainRegions).reduce<BrainRegion[]>(
    (acc, selectedRegion) => {
      const selected = brainRegions?.find((brainRegion) => brainRegion.id === selectedRegion);

      return selected ? [...acc, selected] : acc;
    },
    []
  );

  return dataBrainRegionDetails.length > 0 ? (
    <div className="absolute bottom-0 bg-[#000000b3] z-10 w-full px-10 min-h-[200px]">
      <div className="flex">
        <ExperimentsTotals />
        <LiteratureForExperimentType brainRegions={dataBrainRegionDetails} />
      </div>
    </div>
  ) : null;
}
