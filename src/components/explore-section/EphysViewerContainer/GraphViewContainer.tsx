import GraphViewComponent from './GraphViewComponent';
import { EntityResource } from '@/types/nexus';

interface GraphViewContainerProps {
  defaultStimulusType?: string;
  defaultRepetition?: string;
  resource: EntityResource;
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
