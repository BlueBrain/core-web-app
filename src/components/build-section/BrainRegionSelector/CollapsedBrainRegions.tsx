import { Dispatch, SetStateAction } from 'react';
import { useAtomValue } from 'jotai';
import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';

import { selectedBrainRegionAtom } from '@/state/brain-regions';

export default function CollapsedBrainRegionsSidebar({
  setIsCollapsed,
}: {
  setIsCollapsed: Dispatch<SetStateAction<boolean>>;
}) {
  const selectedBrainRegion = useAtomValue(selectedBrainRegionAtom);

  return (
    <div className="flex flex-col items-center pt-2 w-[40px]">
      <Button
        className="mb-2"
        type="text"
        size="small"
        icon={<PlusOutlined style={{ color: 'white' }} />}
        onClick={() => setIsCollapsed(false)}
      />

      <div
        className="text-white flex gap-x-3.5 items-center max-h-[90vh]"
        style={{
          writingMode: 'vertical-rl',
          transform: 'rotate(180deg)',
          cursor: 'e-resize',
        }}
        role="presentation"
        onClick={() => setIsCollapsed(false)}
      >
        <div className="text-sm whitespace-nowrap text-secondary-4">
          {selectedBrainRegion?.title}
        </div>
        <div className="text-lg font-bold whitespace-nowrap">Brain region</div>
      </div>
    </div>
  );
}
