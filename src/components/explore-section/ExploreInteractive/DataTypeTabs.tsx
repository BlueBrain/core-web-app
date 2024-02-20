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
      <div className="z-10 flex max-h-[80px] w-full items-start justify-between px-4">
        <h1
          className="flex w-1/2 items-center justify-start self-start  pl-4 pt-2 text-[1.6rem] font-bold"
          style={{ color: selected?.colorCode }}
          title={selectedBrainRegion?.title}
        >
          <span
            className="mr-2 inline-block h-[10px] min-h-[10px] w-[10px] min-w-[10px] rounded-full leading-9"
            style={{ background: selected.colorCode }}
          />
          <span className="line-clamp-2">{selectedBrainRegion?.title}</span>
        </h1>
        <div className="flex w-fit flex-nowrap">
          <MenuTabs items={DATA_TYPE_TABS} onTabClick={onTabClick} activeKey={dataTypeActiveTab} />
        </div>
      </div>
    )
  );
}
