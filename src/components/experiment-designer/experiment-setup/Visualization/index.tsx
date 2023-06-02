import SimulationPreview from '@/components/experiment-designer/simulation-preview';
import { TargetList } from '@/types/experiment-designer';

type VisualizationProps = {
  targetsToDisplay: TargetList;
};

//

export default function Visualization({ targetsToDisplay }: VisualizationProps) {
  return (
    <div className="bg-black flex flex-col justify-center items-center h-full text-white">
      <SimulationPreview targetsToDisplay={targetsToDisplay} />
    </div>
  );
}
