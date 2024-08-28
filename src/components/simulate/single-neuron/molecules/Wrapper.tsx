import StepTabs from './StepTabs';
import DefaultLoadingSuspense from '@/components/DefaultLoadingSuspense';
import { SimulationType } from '@/types/simulation/common';

type Props = {
  viewer: JSX.Element | null;
  children: React.ReactNode;
  type: SimulationType;
};

export default function Wrapper({ viewer, type, children }: Props) {
  return (
    <div className="h-screen w-full overflow-hidden">
      <StepTabs type={type} />
      <div className="flex h-[calc(100vh-105px)]">
        <div className="secondary-scrollbar mb-20 flex w-1/2 flex-col overflow-y-auto">
          <DefaultLoadingSuspense>{children}</DefaultLoadingSuspense>
        </div>
        <div className="flex w-1/2 items-center justify-center bg-black">{viewer}</div>
      </div>
    </div>
  );
}
