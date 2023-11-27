import { ErrorBoundary } from 'react-error-boundary';

import SimpleErrorComponent from '@/components/GenericErrorFallback';
import Main from '@/components/main';

export default function MainPage() {
  return (
    <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
      <Main />
    </ErrorBoundary>
  );
}
