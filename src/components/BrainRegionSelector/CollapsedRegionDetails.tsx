import React, { Dispatch, SetStateAction } from 'react';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

export default function CollapsedRegionDetails({
  title,
  setisMeTypeOpen,
}: {
  title: string;
  setisMeTypeOpen: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <div className="flex flex-col items-center pt-2 w-[40px]">
      <Button
        className="mb-4"
        type="text"
        size="small"
        icon={<PlusOutlined style={{ color: 'white' }} />}
        onClick={() => setisMeTypeOpen(true)}
      />
      <div
        className="text-white flex gap-x-3.5 items-center"
        style={{
          writingMode: 'vertical-rl',
          transform: 'rotate(180deg)',
          cursor: 'e-resize',
        }}
        role="presentation"
        onClick={() => setisMeTypeOpen(true)}
      >
        <div className="text-sm">
          View <span className="font-bold">Counts[N]</span>
        </div>
        <div className="text-lg text-secondary-4 font-bold">{title}</div>
      </div>
    </div>
  );
}
