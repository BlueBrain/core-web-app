'use client';

import { Select } from 'antd';
import { ImportOutlined } from '@ant-design/icons';
import { PrimitiveAtom, useAtom } from 'jotai';

import type {
  DropdownOptionType,
  ExpDesignerMultipleDropdownParameter,
} from '@/types/experiment-designer';
import { classNames } from '@/util/utils';

type Props = {
  paramAtom: PrimitiveAtom<ExpDesignerMultipleDropdownParameter>;
  className?: string;
  showSwitcher?: boolean;
  onChangeParamType?: () => void;
};

export default function MultiDropdown({
  paramAtom,
  className,
  showSwitcher = true,
  onChangeParamType,
}: Props) {
  const [data, setData] = useAtom(paramAtom);
  let options: DropdownOptionType[] = [];
  if (data.options.length) {
    options = data.options;
  } else if (data.value.length) {
    options = [{ label: data.value[0], value: data.value[0] }];
  } else {
    options = [{ label: 'NO DATA', value: 'NO DATA' }];
  }

  const handleChange = (newSelections: string[]) => {
    setData((oldAtomData) => ({
      ...oldAtomData,
      value: newSelections,
    }));
  };

  return (
    <div className={classNames('flex gap-3 items-center font-bold', className)}>
      <div className="grow">{data.name}</div>
      <Select
        mode="multiple"
        showSearch={false}
        defaultValue={data.value}
        size="small"
        options={options}
        style={{ width: 200 }}
        onChange={handleChange}
      />
      {showSwitcher && <ImportOutlined onClick={onChangeParamType} />}
    </div>
  );
}
