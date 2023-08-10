import { Divider } from 'antd';
import { ErrorBoundary } from 'react-error-boundary';

import ExamplarMorphology from './ExamplarMorphology';
import ExperimentalTraces from './ExperimentalTraces';
import FeatureSelectionContainer from './FeatureSelectionContainer';
import Mechanism from './Mechanism';
import SimulationParameters from './SimulationParameters';
import DefaultLoadingSuspense from '@/components/DefaultLoadingSuspense';
import SimpleErrorComponent from '@/components/GenericErrorFallback';

export default function EModelView() {
  return (
    <div className="h-[90vh] overflow-auto p-6">
      <div className="text-3xl font-bold text-primary-8">cNAC_1234_2023</div>
      <Divider />

      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <DefaultLoadingSuspense>
          <SimulationParameters />
        </DefaultLoadingSuspense>
      </ErrorBoundary>

      <Divider />

      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <DefaultLoadingSuspense>
          <ExamplarMorphology />
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

      <Mechanism />
    </div>
  );
}
