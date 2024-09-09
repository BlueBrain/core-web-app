import { useEffect, useState } from 'react';
import { fetchJsonFileByUrl, fetchResourceById } from '@/api/nexus';
import { getSession } from '@/authFetch';
import { nexus } from '@/config';
import useNotification from '@/hooks/notifications';
import { SynaptomeSimulation } from '@/types/nexus';
import { SimulationPayload } from '@/types/simulation/single-neuron';
import { NexusMEModel } from '@/types/me-model';
import { SingleNeuronSynaptomeResource } from '@/types/synaptome';

export function useSynaptomeSimulation({
  modelId,
  org,
  project,
}: {
  modelId: string;
  org?: string;
  project?: string;
}) {
  const [simulationResource, setSimulationResource] = useState<SynaptomeSimulation | null>(null);
  const [simulationConfig, setSimulationConfig] = useState<SimulationPayload | null>(null);
  const [meModel, setMeModel] = useState<NexusMEModel | null>(null);

  const { error: notifyError } = useNotification();

  useEffect(() => {
    (async () => {
      try {
        const session = await getSession();
        if (!session) throw new Error('no session');
        const simulationResourceObject = await fetchResourceById<SynaptomeSimulation>(
          modelId,
          session,
          modelId.startsWith(nexus.defaultIdBaseUrl)
            ? {}
            : {
                org,
                project,
              }
        );

        setSimulationResource(simulationResourceObject);

        const synaptomeResource = await fetchResourceById<SingleNeuronSynaptomeResource>(
          simulationResourceObject.used['@id'],
          session,
          simulationResourceObject.used['@id'].startsWith(nexus.defaultIdBaseUrl)
            ? {}
            : {
                org,
                project,
              }
        );
        const meModelData = await fetchResourceById<NexusMEModel>(
          synaptomeResource.used['@id'],
          session,
          synaptomeResource.used['@id'].startsWith(nexus.defaultIdBaseUrl)
            ? {}
            : {
                org,
                project,
              }
        );
        setMeModel(meModelData);

        const distribution = Array.isArray(simulationResourceObject.distribution)
          ? simulationResourceObject.distribution[0].contentUrl
          : simulationResourceObject.distribution.contentUrl;
        const simulationDistribution = await fetchJsonFileByUrl<SimulationPayload>(
          distribution,
          session
        );
        setSimulationConfig(simulationDistribution);
      } catch (error) {
        notifyError('Error while loading the resource details', undefined, 'topRight');
      }
    })();
  }, [modelId, notifyError, org, project, setMeModel, setSimulationConfig]);

  return { simulationResource, simulationConfig, meModel };
}
