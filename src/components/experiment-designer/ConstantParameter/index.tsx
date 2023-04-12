'use client';

import { InputNumber } from 'antd';
import { ExportOutlined } from '@ant-design/icons';
import { Atom, useAtomValue } from 'jotai';

import type { ExpDesignerNumberParameter, ExpDesignerParam } from '@/types/experiment-designer';
import { classNames } from '@/util/utils';

type Props = {
  paramAtom: Atom<ExpDesignerParam>;
  className?: string;
  showSwitcher?: boolean;
};

export default function ConstantParameter({ paramAtom, className, showSwitcher = true }: Props) {
  const data = useAtomValue(paramAtom as Atom<ExpDesignerNumberParameter>);

  return (
    <div className={classNames('flex gap-3', className)}>
      <div className="grow font-bold">{data.name}</div>
      <InputNumber
        defaultValue={data.value}
        addonAfter={data.unit}
        size="small"
        style={{ width: 100 }}
      />
      {showSwitcher && <ExportOutlined />}
    </div>
  );
}
