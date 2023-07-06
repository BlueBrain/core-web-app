import { Button } from 'antd';
import { MinusOutlined } from '@ant-design/icons';
import React, { Dispatch, SetStateAction, useCallback } from 'react';
import { useAtomValue } from 'jotai';

import { selectedBrainRegionAtom } from '@/state/brain-regions';
import List from '@/components/build-section/cell-model-assignment/m-model/Panel/List';
import { BrainRegionIcon } from '@/components/icons';
import { classNames } from '@/util/utils';
import ApplyToAllMTypesPanel from '@/components/build-section/cell-model-assignment/m-model/Panel/ApplyToAllMTypesPanel';

interface PanelTitleProps {
  title?: string;
  onClick: () => void;
  className?: string;
}

function PanelTitle({ title, onClick, className }: PanelTitleProps) {
  return (
    <div className={classNames(className, 'flex justify-between items-start mb-5')}>
      <div className="flex space-x-2 justify-start items-center text-2xl text-white font-bold">
        <BrainRegionIcon style={{ height: '1em' }} />
        <span className="text-secondary-4 text-[16px]">{title ?? 'Select a region first'}</span>
      </div>
      <Button
        type="text"
        icon={<MinusOutlined style={{ color: 'white' }} />}
        onClick={onClick}
        style={{ alignItems: 'center', display: 'flex', justifyContent: 'center' }}
      />
    </div>
  );
}

interface PanelExpandedProps {
  setIsSidebarExpanded: Dispatch<SetStateAction<boolean>>;
}

export default function PanelExpanded({ setIsSidebarExpanded }: PanelExpandedProps) {
  const brainRegion = useAtomValue(selectedBrainRegionAtom);

  const handleClick = useCallback(() => setIsSidebarExpanded(false), [setIsSidebarExpanded]);

  return (
    <div className="flex flex-1 flex-col overflow-y-auto py-6 min-w-[300px]">
      <PanelTitle title={brainRegion?.title} onClick={handleClick} className="px-7" />

      <ApplyToAllMTypesPanel />

      <List />
    </div>
  );
}
