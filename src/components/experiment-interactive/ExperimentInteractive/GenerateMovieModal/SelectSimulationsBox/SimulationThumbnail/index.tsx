import { SimulationPreviewElement } from '@/components/experiment-interactive/types';
import SimulationCanvas from '@/components/experiment-interactive/ExperimentInteractive/MainPanel/SimulationGrid/SimulationBox/SimulationCanvas';
import Image from 'next/image';
import { basePath } from '@/config';

interface SimulationThumbnailProps {
  index: number;
  simulationPreview: SimulationPreviewElement;
}

export default function SimulationThumbnail({
  simulationPreview,
  index,
}: SimulationThumbnailProps) {
  return (
    <div className="relative overflow-hidden border border-white/20 p-1 h-[90px]">
      <div
        className="bg-cover bg-center bg-no-repeat w-full h-full absolute"
        style={{ backgroundImage: `url(${basePath}/images/experiment-interactive/mock.png)` }}
      />
      <div className="absolute left-1 top-1 font-bold flex flex-row gap-3">{index}</div>
    </div>
  );
}
