import { useState, useEffect } from 'react';

import { CampaignDescriptor, useAccessToken } from './current-campaign-descriptor';
import LimitedCache from './limited-cache';
import { nexus } from '@/config';
import { fetchSimulationsFromEs } from '@/api/explore-section/simulations';
import { assertType } from '@/util/type-guards';
import { logError } from '@/util/logger';

export interface SimulationDefinition {
  campaignId: string;
  simulationId: string;
  sonataFile: string;
  coords: Record<string, number>;
}

interface SimulationHit {
  _id: string;
  _source: {
    parameter: {
      coords: Record<string, number>;
    };
  };
}

const simulationsCache = new LimitedCache<SimulationDefinition[]>(1024);

export function useSimulations(
  campaignDescriptor: CampaignDescriptor | undefined
): SimulationDefinition[] {
  const [simulations, setSimulations] = useState<SimulationDefinition[]>([]);
  const accessToken = useAccessToken();
  useEffect(() => {
    const action = async () => {
      if (!accessToken) return;
      if (!campaignDescriptor) return;

      const simulationsList = await simulationsCache.get(campaignDescriptor.id, async () => {
        let list = await fetchSimulations(accessToken, campaignDescriptor.id);
        if (list.length === 0) {
          // eslint-disable-next-line no-console
          console.warn(
            'We are using a hardcoded campaign id because this one is empty:',
            campaignDescriptor.id
          );
          // This campaign has no simulation.
          // Since we are still in test mode, we will
          // use a campaign we know to be not empty.
          list = await fetchSimulations(
            accessToken,
            'https://bbp.epfl.ch/data/bbp/mmb-point-neuron-framework-model/09c5b1b4-fd41-45d0-b42f-2cff917945a9'
          );
        }
        // eslint-disable-next-line no-restricted-syntax
        const simulationObjects = await Promise.all(
          list.map((sim) => fetchFromDelta(accessToken, sim.simulationId))
        );
        console.log('🚀 [simulations] simulationObjects = ', simulationObjects); // @FIXME: Remove this line written on 2023-10-06 at 14:13
        return list.map((item, index) => ({
          ...item,
          sonataFile: extractSonataFile(simulationObjects[index]),
        }));
      });
      setSimulations(simulationsList);
    };
    action();
  }, [accessToken, campaignDescriptor]);
  return simulations;
}

async function fetchFromDelta(accessToken: string, objectId: string) {
  const url = `${nexus.url}/resources/${nexus.org}/${nexus.project}/_/${encodeURIComponent(
    objectId
  )}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: new Headers({
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      Accept: '*/*',
    }),
  });
  const data = await response.json();
  return data;
}

async function fetchSimulations(
  accessToken: string,
  campaignId: string
): Promise<SimulationDefinition[]> {
  const data = await fetchSimulationsFromEs(accessToken, campaignId);
  assertType<{
    hits: SimulationHit[];
  }>(data, {
    hits: [
      'array',
      {
        _id: 'string',
        _source: {
          parameter: {
            coords: ['map', 'number'],
          },
        },
      },
    ],
  });
  return data.hits.map(({ _id, _source }: SimulationHit) => {
    const simulation: SimulationDefinition = {
      campaignId,
      simulationId: _id,
      coords: _source.parameter.coords,
      sonataFile: '',
    };
    return simulation;
  });
}

function extractSonataFile(simulation: unknown): string {
  try {
    assertType<{ log_url: string }>(simulation, {
      log_url: 'string',
    });
    const logUrl = simulation.log_url;
    const start = logUrl.indexOf('/gpfs/');
    const logPath = logUrl.substring(start);
    const end = logPath.lastIndexOf('/');
    const path = logPath.substring(0, end + 1);
    return `${path}simulation_config.json`;
  } catch (ex) {
    logError('Unexpected format for a simulation:', ex, simulation);
    return '';
  }
}
