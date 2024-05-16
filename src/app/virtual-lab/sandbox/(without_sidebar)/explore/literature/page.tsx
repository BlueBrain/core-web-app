import { ErrorBoundary } from 'react-error-boundary';

import { QAContainer } from '@/components/explore-section/Literature/components';
import SimpleErrorComponent from '@/components/GenericErrorFallback';

export default async function LiteraturePage() {
  return (
    <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
      <div className="bg-white">
        <QAContainer />
      </div>
    </ErrorBoundary>
  );
}
