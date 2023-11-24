import { ErrorBoundary } from 'react-error-boundary';

import EModelDropdown from './EModelDropdown';
import DefaultLoadingSuspense from '@/components/DefaultLoadingSuspense';
import SimpleErrorComponent from '@/components/GenericErrorFallback';

export default function MEModelView() {
  return (
    <div className="h-[80vh] overflow-auto p-6">
      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <DefaultLoadingSuspense>
          <EModelDropdown />
        </DefaultLoadingSuspense>
      </ErrorBoundary>
    </div>
  );
}
