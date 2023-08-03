import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import {
  GenerativeQABuilder,
  GenerativeQAResultList,
} from '@/components/explore-section/Literature/components';
import SimpleErrorComponent from '@/components/GenericErrorFallback';

export default async function LiteraturePage() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full min-h-screen mx-auto bg-white max-w-7xl">
      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <GenerativeQABuilder />
        <GenerativeQAResultList />
      </ErrorBoundary>
    </div>
  );
}
