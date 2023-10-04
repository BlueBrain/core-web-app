import { useState, useEffect } from 'react';
import { useAccessToken } from './current-campaign-id';
import { fetchSimulationsFromEs } from '@/api/explore-section/simulations';
import { assertType } from '@/util/type-guards';

export interface SimulationDefinition {
  id: string;
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

      let list = await fetchSimulations(accessToken, campaignId);
      if (list.length === 0) {
        console.warn('We are using a hardcoded campaign id because this one is empty:', campaignId);
        // This campaign has no simulation.
        // Since we are still in test mode, we will
        // use a campaign we know to be not empty.
        list = await fetchSimulations(
          accessToken,
          'https://bbp.epfl.ch/data/bbp/mmb-point-neuron-framework-model/37c79ef0-099c-44ed-bad2-846cdf10faaf'
        );
      }
      setSimulations(list);
      console.log('🚀 [SlotsSelector] list = ', list); // @FIXME: Remove this line written on 2023-09-27 at 14:41
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
  console.log('🚀 [simulations] data = ', data); // @FIXME: Remove this line written on 2023-10-02 at 13:48
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
      id: _id,
      coords: _source.parameter.coords,
    };
    return simulation;
  });
}
