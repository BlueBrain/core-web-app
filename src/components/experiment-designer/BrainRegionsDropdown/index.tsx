'use client';

import { useAtomValue } from 'jotai';
import { loadable } from 'jotai/utils';
import { Select } from 'antd';

import { brainRegionsAtom } from '@/state/brain-regions';

type Props = {
  onChange?: any;
  defaultValue?: string;
  className?: string;
};

export default function BrainRegionsDropdown({ onChange, defaultValue, className }: Props) {
  const brainRegionsLoadable = useAtomValue(loadable(brainRegionsAtom));

  const brainRegions = brainRegionsLoadable.state === 'hasData' ? brainRegionsLoadable.data : [];

  const options = brainRegions?.map((region) => ({
    value: region.id,
    label: region.title,
  }));

  const onSelect = (regionId: string | undefined) => {
    if (!regionId) return;
    const newSelectedBrainRegion = brainRegions?.find((br) => br.id === regionId);
    onChange(newSelectedBrainRegion);
  };

  return (
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
  );
}
