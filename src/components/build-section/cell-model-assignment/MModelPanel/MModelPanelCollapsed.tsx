import React, { Dispatch, SetStateAction } from 'react';
import { useAtomValue } from 'jotai';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { selectedBrainRegionAtom } from '@/state/brain-regions';

interface MModelPanelCollapsedProps {
  setIsSidebarExpanded: Dispatch<SetStateAction<boolean>>;
}

export default function MModelPanelCollapsed({ setIsSidebarExpanded }: MModelPanelCollapsedProps) {
  const { title } = useAtomValue(selectedBrainRegionAtom) ?? { title: '' };

  return (
    <div className="flex flex-col items-center pt-2 w-[40px]">
      <Button
        className="mb-4"
        type="text"
        size="small"
        icon={<PlusOutlined style={{ color: 'white' }} />}
        onClick={() => setIsSidebarExpanded(true)}
      />
      <div
        className="text-white flex gap-x-3.5 items-center"
        style={{
          writingMode: 'vertical-rl',
          transform: 'rotate(180deg)',
          cursor: 'e-resize',
        }}
        role="presentation"
        onClick={() => setIsSidebarExpanded(true)}
      >
        <div className="text-lg font-semibold">{title}</div>
      </div>
    </div>
  );
}
