import { ErrorBoundary } from 'react-error-boundary';

import { StandardFallback } from './ErrorMessageLine';
import ExemplarMorphology from './ExemplarMorphology';
import FeatureSelectionContainer from './FeatureSelectionContainer';
import Mechanism from './Mechanism';
import SimulationParameters from './SimulationParameters';
import EModelTitle from './EModelTitle';
import WorkflowAttributes from './WorkflowAttributes';
import DefaultLoadingSuspense from '@/components/DefaultLoadingSuspense';
import SimpleErrorComponent from '@/components/GenericErrorFallback';
import ExemplarTraces from '@/components/explore-section/EModel/DetailView/ExemplarTraces';

type Params = {
  id: string;
  projectId: string;
  virtualLabId: string;
};

export default function EModelView({
  params,
  showTitle = true,
}: {
  params: Params;
  showTitle?: boolean;
}) {
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
            <ExemplarMorphology params={params} />
          </ErrorBoundary>
        </DefaultLoadingSuspense>
      </ErrorBoundary>

      <DefaultLoadingSuspense>
        <ErrorBoundary fallback={<StandardFallback type="info">Exemplar traces</StandardFallback>}>
          <ExemplarTraces params={params} />
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
