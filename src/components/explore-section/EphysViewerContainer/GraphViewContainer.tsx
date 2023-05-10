import GraphViewComponent from './GraphViewComponent';
import { DeltaResource } from '@/types/explore-section';

import ephysDistribution from '@/components/explore-section/EphysViewerContainer/hooks/useEphysDistribution';

interface GraphViewContainerProps {
  resource: DeltaResource;
  defaultStimulusType?: string;
  defaultRepetition?: string;
}

function GraphViewContainer({
  resource,
  defaultStimulusType,
  defaultRepetition,
}: GraphViewContainerProps) {
  const traceCollectionData = ephysDistribution(resource);
  return (
    <GraphViewComponent
      {...{
        traceCollectionData,
        defaultRepetition,
        defaultStimulusType,
      }}
    />
  );
}

export default GraphViewContainer;
