'use client';

import { useMemo } from 'react';
import { useAtomValue, atom, useAtom } from 'jotai';
import { unwrap } from 'jotai/utils';

import { brainRegionsAtom, selectedBrainRegionAtom } from '@/state/brain-regions';
import MenuTabs from '@/components/MenuTabs';

enum DataTypeTabsEnum {
  'Experimental data' = 'experimental-data',
  'Model data' = 'model-data',
  'Literature' = 'literature',
}

type DataTypeActiveTab = `${DataTypeTabsEnum}`;

export const dataTabAtom = atom<DataTypeActiveTab>('experimental-data');

const DATA_TYPE_TABS = Object.keys(DataTypeTabsEnum).map((key) => ({
  id: DataTypeTabsEnum[key as keyof typeof DataTypeTabsEnum],
  label: key,
}));

export default function DataTypeTabs() {
  const [dataTypeActiveTab, setDataTypeTab] = useAtom(dataTabAtom);
  const selectedBrainRegion = useAtomValue(selectedBrainRegionAtom);
  const brainRegions = useAtomValue(useMemo(() => unwrap(brainRegionsAtom), []));
  const selected = brainRegions?.find((brainRegion) => brainRegion.id === selectedBrainRegion?.id);
  const onTabClick = (activeKey: string) => setDataTypeTab(activeKey as DataTypeActiveTab);

  return (
    selected && (
      <div className="z-10 flex max-h-[65px] w-full items-center justify-between px-4 py-2">
        <h1
          className="flex items-center justify-center text-3xl font-bold"
          style={{ color: selected?.colorCode }}
        >
          <span
            className="mr-2 inline-block h-[10px] w-[10px] rounded-full leading-9"
            style={{ background: selected.colorCode }}
          />
          {selectedBrainRegion?.title}
        </h1>
        <div className="flex">
          <MenuTabs items={DATA_TYPE_TABS} onTabClick={onTabClick} activeKey={dataTypeActiveTab} />
        </div>
      </div>
    )
  );
}
