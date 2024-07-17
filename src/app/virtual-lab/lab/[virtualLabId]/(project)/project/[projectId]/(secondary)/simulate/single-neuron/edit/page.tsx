import { Title, StepTabs, Visualization, ParameterView } from '@/components/simulate/single-neuron';
import LaunchButton from '@/components/simulate/single-neuron/parameters/LaunchButton';

export default function VirtualLabSimulationPage() {
  return (
    <>
      <Title />
      <StepTabs />
      <div className="flex h-[calc(100vh-72px)]">
        <div className="flex w-1/2 items-center justify-center bg-black">
          <Visualization />
        </div>
        <div className="flex w-1/2">
          <ParameterView />
        </div>
      </div>
      <LaunchButton />
    </>
  );
}
