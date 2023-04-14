'use client';

import { InputNumber } from 'antd';
import { ExportOutlined } from '@ant-design/icons';
import { PrimitiveAtom, useAtom } from 'jotai';

import type { ExpDesignerNumberParameter } from '@/types/experiment-designer';
import { classNames } from '@/util/utils';

type Props = {
  paramAtom: PrimitiveAtom<ExpDesignerNumberParameter>;
  className?: string;
  showSwitcher?: boolean;
};

export default function ConstantParameter({ paramAtom, className, showSwitcher = true }: Props) {
  const [data, setData] = useAtom(paramAtom);

  const changed = (inputNumberValue: number | null) => {
    if (inputNumberValue === null) return;

    setData((oldAtomData) => ({
      ...oldAtomData,
      value: inputNumberValue,
    }));
  };

  return (
    <div className={classNames('flex gap-3', className)}>
      <div className="grow font-bold">{data.name}</div>
      <InputNumber
        value={data.value}
        addonAfter={data.unit}
        size="small"
        style={{ width: 90 }}
        controls={false}
        onChange={changed}
      />
      {showSwitcher && <ExportOutlined />}
    </div>
  );
}
