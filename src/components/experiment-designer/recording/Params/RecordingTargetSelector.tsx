'use client';

import { PrimitiveAtom, useAtom } from 'jotai';

import { TargetsDropdown } from '@/components/experiment-designer';
import { ExpDesignerTargetParameter } from '@/types/experiment-designer';
import { classNames } from '@/util/utils';

type Props = {
  paramAtom: PrimitiveAtom<ExpDesignerTargetParameter>;
  className?: string;
};

export default function RecordingTargetSelector({ paramAtom, className }: Props) {
  const [data, setData] = useAtom(paramAtom);

  const setRecordingTarget = (target: string) => {
    setData((oldAtomData) => ({
      ...oldAtomData,
      value: target,
    }));
  };

  return (
    <div className={classNames('flex items-center gap-3 font-bold', className)}>
      <div className="grow">Target</div>
      <TargetsDropdown onChange={setRecordingTarget} defaultValue={data.value} />
    </div>
  );
}
