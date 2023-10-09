import { useState, useEffect } from 'react';
import { useAccessToken } from './current-campaign-id';
import { fetchSimulationsFromEs } from '@/api/explore-section/simulations';
import { assertType } from '@/util/type-guards';

export interface SimulationDefinition {
  campaignId: string;
  simulationId: string;
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

export function useSimulations(campaignId: string | undefined) {
  const [simulations, setSimulations] = useState<SimulationDefinition[]>([]);
  const accessToken = useAccessToken();
  useEffect(() => {
    const action = async () => {
      if (!accessToken) return;
      if (!campaignId) return;

      const list = await fetchSimulations(accessToken, campaignId);

      setSimulations(list);
    };
    action();
  }, [accessToken, campaignId]);
  return simulations;
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
    };
    return simulation;
  });
}
