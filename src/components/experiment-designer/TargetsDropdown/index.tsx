'use client';

import { useAtomValue } from 'jotai';
import { loadable } from 'jotai/utils';
import { Select, Spin } from 'antd';

import { targetListAtom } from '@/state/experiment-designer';

type Props = {
  onChange?: any;
  defaultValue?: string;
  className?: string;
};

const loadableTargetListAtom = loadable(targetListAtom);

export default function TargetsDropdown({ onChange, defaultValue = 'SELECT', className }: Props) {
  const targetsLoadable = useAtomValue(loadableTargetListAtom);

  const targets = targetsLoadable.state === 'hasData' ? targetsLoadable.data : [];

  const isLoading = targetsLoadable.state === 'loading';
  const isEmpty = !isLoading && !targets.length;

  const options = targets?.map((target) => ({
    value: target,
    label: target,
  }));

  const onSelect = (target: string) => {
    if (!target) return;
    onChange(target);
  };

  return (
    <div aria-label="target-dropdown">
      {isLoading && <Spin />}
      {!isLoading && isEmpty && 'Not node_sets were found'}
      {!isLoading && !isEmpty && (
        <Select
          defaultValue={[defaultValue]}
          size="small"
          options={options}
          onSelect={onSelect}
          style={{ width: 200 }}
          className={className}
          showSearch
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
        />
      )}
    </div>
  );
}
