import { ErrorBoundary } from 'react-error-boundary';

import AssignmentAlgorithm from './AssignmentAlgorithm';
import AxonAssignment from './AxonAssignment';
import DefaultLoadingSuspense from '@/components/DefaultLoadingSuspense';
import SimpleErrorComponent from '@/components/GenericErrorFallback';
import FeatureWithEModel from '@/components/build-section/cell-model-assignment/me-model/FeatureWithEModel';

export default function MEModelView() {
  return (
    <div className="h-[80vh] overflow-auto p-6">
      <div className="relative mt-10">
        <div className="w-full h-full absolute flex justify-center items-center z-10 text-red-500 text-4xl">
          <span className="-rotate-45">Coming soon</span>
        </div>
        <div className="flex flex-col gap-10 opacity-30">
          <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
            <DefaultLoadingSuspense>
              <AssignmentAlgorithm />
            </DefaultLoadingSuspense>
          </ErrorBoundary>

          <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
            <DefaultLoadingSuspense>
              <FeatureWithEModel />
            </DefaultLoadingSuspense>
          </ErrorBoundary>

          <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
            <DefaultLoadingSuspense>
              <AxonAssignment />
            </DefaultLoadingSuspense>
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
}
