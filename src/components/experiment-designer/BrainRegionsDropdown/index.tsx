'use client';

import { useAtomValue } from 'jotai';
import { loadable } from 'jotai/utils';
import { Select } from 'antd';

import { brainRegionsAtom } from '@/state/brain-regions';
import { BrainRegion } from '@/types/ontologies';

type Props = {
  onChange?: any;
  defaultValue?: string;
  className?: string;
};

const loadableBrainRegionsAtom = loadable(brainRegionsAtom);

export default function BrainRegionsDropdown({
  onChange,
  defaultValue = 'SELECT',
  className,
}: Props) {
  const brainRegionsLoadable = useAtomValue(loadableBrainRegionsAtom);

  const brainRegions = brainRegionsLoadable.state === 'hasData' ? brainRegionsLoadable.data : [];

  const options = brainRegions?.map((region) => ({
    value: region.id,
    label: region.title,
    region,
  }));

  const onSelect = (regionId: string, { region }: { region: BrainRegion }) => {
    if (!regionId) return;
    onChange(region);
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
