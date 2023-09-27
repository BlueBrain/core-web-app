import { useAtomValue } from 'jotai';
import { ErrorBoundary } from 'react-error-boundary';

import Tabs from '@/components/LabTabs';
import { themeAtom } from '@/state/theme';
import SimpleErrorComponent from '@/components/GenericErrorFallback';

export default function TopTabs() {
  const theme = useAtomValue(themeAtom);
  const bgClassName = theme === 'light' ? 'bg-neutral-1' : 'bg-black';

  return (
    <div className={bgClassName}>
      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <Tabs />
      </ErrorBoundary>
    </div>
  );
}
