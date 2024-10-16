import { useEffect, useState } from 'react';

import { fetchJsonFileByUrl, fetchResourceById } from '@/api/nexus';
import { getSession } from '@/authFetch';
import { nexus } from '@/config';
import { SynaptomeSimulation, SingleNeuronSimulation } from '@/types/nexus';
import { SimulationPayload } from '@/types/simulation/single-neuron';
import { NexusMEModel } from '@/types/me-model';
import { SingleNeuronSynaptomeResource } from '@/types/synaptome';
import { ensureArray } from '@/util/nexus';
import useNotification from '@/hooks/notifications';
import { DeepSnakeCase, convertObjectKeystoCamelCase } from '@/util/object-keys-format';

export function useSimulation({
  modelId,
  org,
  project,
  type,
}: {
  modelId: string;
  org?: string;
  project?: string;
  type: 'single-neuron-simulation' | 'synaptome-simulation';
}) {
  const [simulationResource, setSimulationResource] = useState<
    SynaptomeSimulation | SingleNeuronSimulation | null
  >(null);
  const [simulationConfig, setSimulationConfig] = useState<SimulationPayload | null>(null);
  const [synaptomeModel, setSynaptomeModel] = useState<SingleNeuronSynaptomeResource | null>(null);
  const [meModel, setMeModel] = useState<NexusMEModel | null>(null);

  const { error: notifyError } = useNotification();

  useEffect(() => {
    (async () => {
      try {
        const session = await getSession();
        if (!session) throw new Error('no session');
        const simulationResourceObject = await fetchResourceById<
          SynaptomeSimulation | SingleNeuronSimulation
        >(
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
        let synaptomeResource = null;
        if (type === 'synaptome-simulation') {
          synaptomeResource = await fetchResourceById<SingleNeuronSynaptomeResource>(
            simulationResourceObject.used['@id'],
            session,
            simulationResourceObject.used['@id'].startsWith(nexus.defaultIdBaseUrl)
              ? {}
              : {
                  org,
                  project,
                }
          );
          setSynaptomeModel(synaptomeResource);
        }
        const meModelUrl =
          type === 'synaptome-simulation' && synaptomeResource
            ? synaptomeResource.used['@id']
            : simulationResourceObject.used['@id'];

        const meModelData = await fetchResourceById<NexusMEModel>(
          meModelUrl,
          session,
          meModelUrl.startsWith(nexus.defaultIdBaseUrl)
            ? {}
            : {
                org,
                project,
              }
        );
        setMeModel(meModelData);

        const distribution = ensureArray(simulationResourceObject.distribution)[0].contentUrl;
        const simulationDistribution = await fetchJsonFileByUrl<DeepSnakeCase<SimulationPayload>>(
          distribution,
          session
        );
        setSimulationConfig({
          simulation: Object.keys(simulationDistribution.simulation).reduce((prev, curr) => {
            return {
              ...prev,
              [curr]: convertObjectKeystoCamelCase(simulationDistribution.simulation[curr]),
            };
          }, {}),
          stimulus: convertObjectKeystoCamelCase(simulationDistribution.stimulus),
          config: convertObjectKeystoCamelCase(simulationDistribution.config),
        });
      } catch (error) {
        notifyError('Error while loading the resource details', undefined, 'topRight');
      }
    })();
  }, [modelId, notifyError, org, project, setMeModel, setSimulationConfig, type]);

  return {
    simulationResource,
    simulationConfig,
    meModel,
    synaptomeModel,
  };
}
