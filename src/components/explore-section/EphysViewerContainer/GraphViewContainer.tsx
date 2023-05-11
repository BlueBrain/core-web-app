import GraphViewComponent from './GraphViewComponent';
import { DeltaResource } from '@/types/explore-section';

interface GraphViewContainerProps {
  defaultStimulusType?: string;
  defaultRepetition?: string;
  resource: DeltaResource;
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
