import { ErrorBoundary } from 'react-error-boundary';

import SimpleErrorComponent from '@/components/GenericErrorFallback';
import { QAContainer } from '@/components/explore-section/Literature/components';

function LiteratureSearch() {
  return (
    <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
      <QAContainer />
    </ErrorBoundary>
  );
}

export default LiteratureSearch;
