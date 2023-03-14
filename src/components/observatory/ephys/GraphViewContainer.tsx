import { NexusClient } from '@bbp/nexus-sdk';
import GraphViewComponent from './GraphViewComponent';
import { EphysDeltaResource } from '@/types/observatory';

import ephysDistribution from '@/components/observatory/ephys/useEphysDistribution';

interface GraphViewContainerProps {
  resource: EphysDeltaResource;
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
