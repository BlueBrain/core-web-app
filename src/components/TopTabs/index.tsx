import { useAtomValue } from 'jotai/react';
import { ErrorBoundary } from 'react-error-boundary';
import { Suspense } from 'react';

import Tabs from '@/components/BrainFactoryTabs';
import BuildModelBtn from '@/components/BuildModelBtn';
import { themeAtom } from '@/state/theme';
import { SimpleErrorComponent } from '@/components/GenericErrorFallback';
import SimulationBtn, { PlaceholderLoadingButton } from '@/components/TopTabs/SimulationBtn';

export default function TopTabs() {
  const theme = useAtomValue(themeAtom);
  const bgClassName = theme === 'light' ? 'bg-neutral-1' : 'bg-black';

  return (
    <div className={bgClassName}>
      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <Tabs>
          <BuildModelBtn className="w-[250px]" />
          <Suspense fallback={<PlaceholderLoadingButton />}>
            <SimulationBtn />
          </Suspense>
        </Tabs>
      </ErrorBoundary>
    </div>
  );
}
