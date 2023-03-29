import Params from '@/components/experiment-designer/experiment-setup/Params';
import Visualization from '@/components/experiment-designer/experiment-setup/Visualization';

export default function ExperimentSetupView() {
  return (
    <div className="columns-2 h-full">
      <Params />
      <Visualization />
    </div>
  );
}
