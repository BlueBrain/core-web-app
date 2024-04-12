import { ErrorBoundary } from 'react-error-boundary';

import SimpleErrorComponent from '@/components/GenericErrorFallback';
import InviteLoader from '@/components/Invites';

export default function InvitePage() {
  return (
    <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
      <InviteLoader />
    </ErrorBoundary>
  );
}
