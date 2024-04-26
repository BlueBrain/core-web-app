'use client';

import { basePath } from '@/config';
import { SwapOutlined } from '@ant-design/icons';

export default function VirtualLabsSelect() {
  return (
    <a
      href={`${basePath}/virtual-lab/select`}
      className="flex items-center justify-between border border-primary-7 p-3 text-primary-3"
    >
      <span>Switch virtual lab</span> <SwapOutlined />
    </a>
  );
}
