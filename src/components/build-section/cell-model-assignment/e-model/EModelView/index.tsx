import { Divider } from 'antd';
import { ErrorBoundary } from 'react-error-boundary';

import ExemplarMorphology from './ExemplarMorphology';
import ExperimentalTraces from './ExperimentalTraces';
import FeatureSelectionContainer from './FeatureSelectionContainer';
import Mechanism from './Mechanism';
import SimulationParameters from './SimulationParameters';
import EModelTitle from './EModelTitle';
import WorkflowAttributes from './WorkflowAttributes';
import DefaultLoadingSuspense from '@/components/DefaultLoadingSuspense';
import SimpleErrorComponent from '@/components/GenericErrorFallback';

export default function EModelView({ showTitle = true }: { showTitle?: boolean }) {
  return (
    <>
      {showTitle && (
        <>
          <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
            <DefaultLoadingSuspense>
              <EModelTitle />
            </DefaultLoadingSuspense>
          </ErrorBoundary>
          <Divider />
        </>
      )}

      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <DefaultLoadingSuspense>
          <SimulationParameters />
        </DefaultLoadingSuspense>
      </ErrorBoundary>

      <Divider />

      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <DefaultLoadingSuspense>
          <ExemplarMorphology />
        </DefaultLoadingSuspense>
      </ErrorBoundary>

      <Divider />

      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <DefaultLoadingSuspense>
          <ExperimentalTraces />
        </DefaultLoadingSuspense>
      </ErrorBoundary>

      <Divider />

      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <DefaultLoadingSuspense>
          <FeatureSelectionContainer />
        </DefaultLoadingSuspense>
      </ErrorBoundary>

      <Divider />

      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <DefaultLoadingSuspense>
          <Mechanism />
        </DefaultLoadingSuspense>
      </ErrorBoundary>

      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <DefaultLoadingSuspense>
          <WorkflowAttributes />
        </DefaultLoadingSuspense>
      </ErrorBoundary>
    </>
  );
}
