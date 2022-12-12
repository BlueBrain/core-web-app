import React from 'react';
import { Image } from 'antd';
import { basePath } from '@/config';

export default function CellDistribution() {
  return (
    <div>
      <Image
        src={`${basePath}/images/brain-factory/BBM_Distribution_V1_221119.png`}
        alt="Coming soon"
        className="object-contain"
      />
    </div>
  );
}
