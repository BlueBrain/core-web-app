'use client';

import { PrimitiveAtom, useAtom } from 'jotai';

import { BrainRegionsDropdown } from '@/components/experiment-designer';
import { ExpDesignerRegionParameter } from '@/types/experiment-designer';
import { classNames } from '@/util/utils';
import { BrainRegion } from '@/types/ontologies';

type Props = {
  paramAtom: PrimitiveAtom<ExpDesignerRegionParameter>;
  className?: string;
};

export default function TargetRegionSelector({ paramAtom, className }: Props) {
  const [data, setData] = useAtom(paramAtom);

  const setSimulateRegions = (newBrainRegion: BrainRegion) => {
    setData((oldAtomData) => ({
      ...oldAtomData,
      value: newBrainRegion.title,
    }));
  };

  return (
    <div className={classNames('flex gap-3 items-center font-bold', className)}>
      <div className="grow">Population</div>
      <BrainRegionsDropdown onChange={setSimulateRegions} defaultValue={data.value} />
    </div>
  );
}
