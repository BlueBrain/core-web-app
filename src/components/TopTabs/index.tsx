import { ErrorBoundary } from 'react-error-boundary';

import Tabs from '@/components/LabTabs';
import SimpleErrorComponent from '@/components/GenericErrorFallback';

export default function TopTabs() {
  return (
    <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
      <Tabs />
    </ErrorBoundary>
  );
}
