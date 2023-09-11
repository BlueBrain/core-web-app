import GraphViewComponent from './GraphViewComponent';
import { ExperimentalTrace } from '@/types/explore-section/delta';

interface GraphViewContainerProps {
  defaultStimulusType?: string;
  defaultRepetition?: string;
  resource: ExperimentalTrace;
}

function GraphViewContainer({
  resource,
  defaultStimulusType,
  defaultRepetition,
}: GraphViewContainerProps) {
  return (
    <GraphViewComponent
      {...{
        defaultRepetition,
        defaultStimulusType,
        resource,
      }}
    />
  );
}

export default GraphViewContainer;
