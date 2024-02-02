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
    <div className="flex w-[40px] flex-col items-center pt-2">
      <Button
        className="mb-2"
        type="text"
        size="small"
        icon={<PlusOutlined style={{ color: 'white' }} />}
        onClick={() => setIsCollapsed(false)}
      />

      <div
        className="flex max-h-[90vh] items-center gap-x-3.5 text-white"
        style={{
          writingMode: 'vertical-rl',
          transform: 'rotate(180deg)',
          cursor: 'e-resize',
        }}
        role="presentation"
        onClick={() => setIsCollapsed(false)}
      >
        <div className="whitespace-nowrap text-sm text-secondary-4">
          {selectedBrainRegion?.title}
        </div>
        <div className="whitespace-nowrap text-lg font-bold">Brain region</div>
      </div>
    </div>
  );
}
