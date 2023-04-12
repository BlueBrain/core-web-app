'use client';

import { Atom, useAtomValue, useSetAtom } from 'jotai';

import { expDesignerSimulateRegions } from '@/state/experiment-designer';
import { BrainRegionsDropdown } from '@/components/experiment-designer';
import { ExpDesignerParam, ExpDesignerRegionParameter } from '@/types/experiment-designer';
import { classNames } from '@/util/utils';

type Props = {
  paramAtom: Atom<ExpDesignerParam>;
  className?: string;
};

export default function RecordingTargetRegionSelector({ paramAtom, className }: Props) {
  const data = useAtomValue(paramAtom as Atom<ExpDesignerRegionParameter>);
  const setRecordingRegions = useSetAtom(expDesignerSimulateRegions);

  return (
    <div className={classNames('flex gap-3 items-center font-bold', className)}>
      <div className="grow">Target</div>
      <BrainRegionsDropdown onChange={setRecordingRegions} defaultValue={data.value} />
    </div>
  );
}
