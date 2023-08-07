import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { GenerativeQAContainer } from '@/components/explore-section/Literature/components';
import SimpleErrorComponent from '@/components/GenericErrorFallback';

export default async function LiteraturePage() {
  return (
    <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
      <GenerativeQAContainer />
    </ErrorBoundary>
  );
}
