'use client';

import { Select } from 'antd';
import { ExportOutlined } from '@ant-design/icons';
import { Atom, useAtomValue } from 'jotai';

import type { ExpDesignerDropdownParameter, ExpDesignerParam } from '@/types/experiment-designer';
import { classNames } from '@/util/utils';

type Props = {
  paramAtom: Atom<ExpDesignerParam>;
  className?: string;
  showSwitcher?: boolean;
};

export default function DropdownParameter({ paramAtom, className, showSwitcher = true }: Props) {
  const data = useAtomValue(paramAtom as Atom<ExpDesignerDropdownParameter>);
  const options = data.options?.length ? data.options : [{ label: data.value, value: data.value }];

  return (
    <div className={classNames('flex gap-3 items-center font-bold', className)}>
      <div className="grow">{data.name}</div>
      <Select defaultValue={[data.value]} size="small" options={options} style={{ width: 200 }} />
      {showSwitcher && <ExportOutlined />}
    </div>
  );
}
