import { Dispatch, SetStateAction } from 'react';
import { useAtomValue } from 'jotai';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { densityOrCountLabelAtom, selectedBrainRegionAtom } from '@/state/brain-regions';

export default function CollapsedRegionDetails({
  setIsSidebarExpanded,
}: {
  setIsSidebarExpanded: Dispatch<SetStateAction<boolean>>;
}) {
  const { title } = useAtomValue(selectedBrainRegionAtom) ?? { title: '' };
  const densityOrCountLabel = useAtomValue(densityOrCountLabelAtom);

  return (
    <div className="flex w-[40px] flex-col items-center pt-2">
      <Button
        className="mb-2"
        type="text"
        size="small"
        icon={<PlusOutlined style={{ color: 'white' }} />}
        onClick={() => setIsSidebarExpanded(true)}
      />
      <div
        className="flex items-center gap-x-3.5 text-white"
        style={{
          writingMode: 'vertical-rl',
          transform: 'rotate(180deg)',
          cursor: 'e-resize',
        }}
        role="presentation"
        onClick={() => setIsSidebarExpanded(true)}
      >
        <div className="text-sm">
          <span className="font-bold">{densityOrCountLabel}</span>
        </div>
        <div className="text-lg font-bold text-secondary-4">{title}</div>
      </div>
    </div>
  );
}
