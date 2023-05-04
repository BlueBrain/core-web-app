'use client';

import { PrimitiveAtom, useAtom } from 'jotai';

import { TargetsDropdown } from '@/components/experiment-designer';
import { ExpDesignerTargetParameter } from '@/types/experiment-designer';
import { classNames } from '@/util/utils';

type Props = {
  paramAtom: PrimitiveAtom<ExpDesignerTargetParameter>;
  className?: string;
};

export default function TargetSelector({ paramAtom, className }: Props) {
  const [data, setData] = useAtom(paramAtom);

  const setSimulateTarget = (target: string) => {
    setData((oldAtomData) => ({
      ...oldAtomData,
      value: target,
    }));
  };

  return (
    <div className={classNames('flex gap-3 items-center font-bold', className)}>
      <div className="grow">Population</div>
      <TargetsDropdown onChange={setSimulateTarget} defaultValue={data.value} />
    </div>
  );
}
