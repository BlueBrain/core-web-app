import { ErrorBoundary } from 'react-error-boundary';

import BoxLegend from './BoxLegend';
import { ToolbarPanel } from './ToolbarPanel';
import ParamsEditor from './ParamsEditor';
import SimulationPreviewProvider from './SimulationPreviewProvider';
import LoadingIndicator from './LoadingIndicator';
import SimulationCanvas from './SimulationCanvas';
import { classNames } from '@/util/utils';
import { SimulationPreviewElement } from '@/components/experiment-interactive/types';
import SimpleErrorComponent from '@/components/GenericErrorFallback';

import styles from './simulation-box.module.css';

interface SimulationBoxProps {
  index: number;
  simulationPreview: SimulationPreviewElement;
}

export default function SimulationBox({ simulationPreview, index }: SimulationBoxProps) {
  return (
    <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
      <SimulationPreviewProvider simulationPreview={simulationPreview} index={index}>
        <div className={classNames('relative w-full h-full overflow-hidden', styles.main)}>
          <SimulationCanvas />

          <LoadingIndicator />

          <BoxLegend index={index} simParams={simulationPreview.simParams} />

          <ToolbarPanel />

          <ParamsEditor />
        </div>
      </SimulationPreviewProvider>
    </ErrorBoundary>
  );
}
