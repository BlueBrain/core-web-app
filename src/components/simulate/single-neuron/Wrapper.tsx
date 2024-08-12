import DefaultLoadingSuspense from '@/components/DefaultLoadingSuspense';
import { Title, StepTabs } from '@/components/simulate/single-neuron';

type Props = {
  viewer: JSX.Element | null;
  children: React.ReactNode;
};

export default function Wrapper({ viewer, children }: Props) {
  return (
    <div className="h-screen w-full overflow-hidden">
      <Title />
      <StepTabs />
      <div className="flex h-[calc(100vh-105px)]">
        <div className="flex w-1/2 items-center justify-center bg-black">{viewer}</div>
        <div className="secondary-scrollbar mb-20 flex w-1/2 flex-col overflow-y-auto">
          <DefaultLoadingSuspense>{children}</DefaultLoadingSuspense>
        </div>
      </div>
    </div>
  );
}
