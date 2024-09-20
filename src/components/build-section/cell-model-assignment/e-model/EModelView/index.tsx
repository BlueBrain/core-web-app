import { ErrorBoundary } from 'react-error-boundary';

import { StandardFallback } from './ErrorMessageLine';
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
    <div className="flex flex-col gap-12">
      {showTitle && (
        <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
          <DefaultLoadingSuspense>
            <EModelTitle />
          </DefaultLoadingSuspense>
        </ErrorBoundary>
      )}

      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <DefaultLoadingSuspense>
          <SimulationParameters />
        </DefaultLoadingSuspense>
      </ErrorBoundary>

      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <DefaultLoadingSuspense>
          <ErrorBoundary
            fallback={<StandardFallback type="error">Exemplar morphology</StandardFallback>}
          >
            <ExemplarMorphology />
          </ErrorBoundary>
        </DefaultLoadingSuspense>
      </ErrorBoundary>

      <DefaultLoadingSuspense>
        <ErrorBoundary fallback={<StandardFallback type="info">Exemplar traces</StandardFallback>}>
          <ExperimentalTraces />
        </ErrorBoundary>
      </DefaultLoadingSuspense>

      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <DefaultLoadingSuspense>
          <FeatureSelectionContainer />
        </DefaultLoadingSuspense>
      </ErrorBoundary>

      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <DefaultLoadingSuspense>
          <Mechanism />
        </DefaultLoadingSuspense>
      </ErrorBoundary>

      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <WorkflowAttributes />
      </ErrorBoundary>
    </div>
  );
}
