import Image from 'next/image';

import { basePath } from '@/config';

export default function Visualization() {
  return (
    <div className="bg-black flex flex-col justify-center items-center h-full">
      <Image
        className="mv-1"
        src={`${basePath}/images/experiment-designer-viz-placeholder.png`}
        alt="Experiment designer viz placeholder image"
        width={400}
        height={400}
      />
    </div>
  );
}
