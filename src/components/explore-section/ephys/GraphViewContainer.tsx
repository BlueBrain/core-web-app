import { NexusClient } from '@bbp/nexus-sdk';
import GraphViewComponent from './GraphViewComponent';
import { DeltaResource } from '@/types/explore-section';

import ephysDistribution from '@/components/explore-section/ephys/useEphysDistribution';

interface GraphViewContainerProps {
  resource: DeltaResource;
  nexus: NexusClient;
  defaultStimulusType?: string;
  defaultRepetition?: string;
}

function GraphViewContainer({
  resource,
  nexus,
  defaultStimulusType,
  defaultRepetition,
}: GraphViewContainerProps) {
  const traceCollectionData = ephysDistribution(resource, nexus);
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
