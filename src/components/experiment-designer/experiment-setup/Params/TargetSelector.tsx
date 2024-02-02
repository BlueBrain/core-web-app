'use client';

import { PrimitiveAtom, useAtom } from 'jotai';
import { ExportOutlined } from '@ant-design/icons';

import { TargetsDropdown } from '@/components/experiment-designer';
import { ExpDesignerTargetParameter } from '@/types/experiment-designer';
import { classNames } from '@/util/utils';

type Props = {
  paramAtom: PrimitiveAtom<ExpDesignerTargetParameter>;
  className?: string;
  onChangeParamType?: () => void;
  showSwitcher?: boolean;
};

export default function TargetSelector({
  paramAtom,
  className,
  onChangeParamType,
  showSwitcher = true,
}: Props) {
  const [data, setData] = useAtom(paramAtom);

  const setSimulateTarget = (target: string) => {
    setData((oldAtomData) => ({
      ...oldAtomData,
      value: target,
    }));
  };

  return (
    <div
      className={classNames('flex items-center gap-3 font-bold', className)}
      aria-label="target-dropdown"
    >
      <div className="grow">Simulated Neurons</div>
      <TargetsDropdown onChange={setSimulateTarget} defaultValue={data.value} />
      {showSwitcher && <ExportOutlined onClick={onChangeParamType} />}
    </div>
  );
}
