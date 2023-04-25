import { PrimitiveAtom, useAtom, useAtomValue } from 'jotai';
import { ImportOutlined } from '@ant-design/icons';
import { loadable } from 'jotai/utils';

import { Select } from 'antd';
import type { ExpDesignerTargetDropdownGroupParameter } from '@/types/experiment-designer';
import { classNames } from '@/util/utils';
import { targetListAtom } from '@/state/experiment-designer';

type Props = {
  paramAtom: PrimitiveAtom<ExpDesignerTargetDropdownGroupParameter>;
  className?: string;
  showSwitcher?: boolean;
  showTitle?: boolean;
  onChangeParamType?: () => void;
};

const loadableTargetListAtom = loadable(targetListAtom);

export default function MultiTargetDropdown({
  paramAtom,
  className,
  showSwitcher = true,
  showTitle = true,
  onChangeParamType,
}: Props) {
  const [data, setData] = useAtom(paramAtom);

  const targetListLoadable = useAtomValue(loadableTargetListAtom);

  const targetList = targetListLoadable.state === 'hasData' ? targetListLoadable.data : [];

  const options = targetList?.map((target) => ({
    value: target,
    label: target,
  }));

  const initialTarget = data.value[0]?.toString();

  const onAdd = (target: string) => {
    if (!target) return;

    setData((oldAtomData) => ({
      ...oldAtomData,
      value: [...oldAtomData.value, target],
    }));
  };

  const onRemove = (target: string) => {
    if (!target) return;

    setData((oldAtomData) => ({
      ...oldAtomData,
      value: oldAtomData.value.filter((t) => t !== target),
    }));
  };

  return (
    <div className={classNames('flex gap-3', className)}>
      {showTitle && <div className="grow font-bold">{data.name}</div>}

      {!options?.length && 'Loading...'}
      {options?.length && (
        <Select
          mode="multiple"
          defaultValue={initialTarget}
          size="small"
          options={options}
          onSelect={onAdd}
          onDeselect={onRemove}
          style={{ width: 200 }}
          showSearch
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
        />
      )}
      {showSwitcher && <ImportOutlined onClick={onChangeParamType} />}
    </div>
  );
}
