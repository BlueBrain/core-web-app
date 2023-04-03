'use client';

import { useSetAtom } from 'jotai';

import { expDesignerSimulateRegions } from '@/state/experiment-designer';
import { BrainRegionsDropdown } from '@/components/experiment-designer';
import { ExpDesignerDropdownParameter } from '@/types/experiment-designer';
import { BrainRegion } from '@/types/ontologies';

type Props = {
  data: ExpDesignerDropdownParameter;
  className?: string;
};

export default function TargetRegionSelector({ data, className }: Props) {
  const setSimulateRegions = useSetAtom(expDesignerSimulateRegions);

  const simulateRegionChanged = (newRegion: BrainRegion) => {
    setSimulateRegions(newRegion);
  };

  return (
    <BrainRegionsDropdown
      onChange={simulateRegionChanged}
      defaultValue={data.value}
      className={className}
    />
  );
}
