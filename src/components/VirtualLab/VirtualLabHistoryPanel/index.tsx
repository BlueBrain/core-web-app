'use client';

import { CloseOutlined, MenuOutlined } from '@ant-design/icons';
import { useState } from 'react';
import VirtualLabHistoryTable from './VirtualLabHistoryTable';

export default function VirtualLabHistoryPanel() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const onClick = () => setIsOpen(!isOpen);
  return (
    <div className="w-full bg-black p-5">
      <div
        className="flex items-center justify-between"
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={onClick}
      >
        <div>
          <span className="font-bold">History</span> (32)
        </div>
        {isOpen ? <CloseOutlined /> : <MenuOutlined />}
      </div>
      {isOpen && (
        <div className="max-h-[300px] overflow-y-scroll">
          <VirtualLabHistoryTable />
        </div>
      )}
    </div>
  );
}
