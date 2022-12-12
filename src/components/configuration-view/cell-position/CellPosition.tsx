import React from 'react';
import { Image } from 'antd';
import { basePath } from '@/config';

export default function CellPosition() {
  return (
    <div>
      <Image
        src={`${basePath}/images/brain-factory/BBM_ComingSoon_221119.png`}
        alt="Coming soon"
        className="object-contain"
      />
    </div>
  );
}
