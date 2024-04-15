'use client';

import { SwapOutlined } from '@ant-design/icons';

export default function VirtualLabsSelect() {
  return (
    <a
      href="/virtual-lab/select"
      className="flex items-center justify-between border border-primary-7 p-3 text-primary-3"
    >
      <span>Switch Virtual Lab</span> <SwapOutlined />
    </a>
  );
}
