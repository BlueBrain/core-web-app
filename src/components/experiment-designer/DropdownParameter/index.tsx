'use client';

import { Select } from 'antd';
import { ExportOutlined } from '@ant-design/icons';
import { PrimitiveAtom, useAtom } from 'jotai';

import type { ExpDesignerDropdownParameter } from '@/types/experiment-designer';
import { classNames } from '@/util/utils';

type Props = {
  paramAtom: PrimitiveAtom<ExpDesignerDropdownParameter>;
  className?: string;
  showSwitcher?: boolean;
};

export default function DropdownParameter({ paramAtom, className, showSwitcher = true }: Props) {
  const [data, setData] = useAtom(paramAtom);
  const options = data.options?.length ? data.options : [{ label: data.value, value: data.value }];

  const selected = (newSelection: string) => {
    setData((oldAtomData) => ({
      ...oldAtomData,
      value: newSelection,
    }));
  };

  return (
    <div className={classNames('flex gap-3 items-center font-bold', className)}>
      <div className="grow">{data.name}</div>
      <Select
        defaultValue={[data.value]}
        size="small"
        options={options}
        style={{ width: 200 }}
        onSelect={selected}
      />
      {showSwitcher && <ExportOutlined />}
    </div>
  );
}
