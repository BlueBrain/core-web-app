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
      console.log('🚀 [simulations] campaignId, accessToken = ', campaignId, accessToken); // @FIXME: Remove this line written on 2023-10-02 at 13:04
      if (!accessToken) return;
      if (!campaignId) return;

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
      setSimulations(
        data.hits.map(({ _id, _source }: SimulationHit) => {
          const simulation: SimulationDefinition = {
            id: _id,
            coords: _source.parameter.coords,
          };
          return simulation;
        })
      );
      console.log('🚀 [SlotsSelector] simulations = ', data.hits); // @FIXME: Remove this line written on 2023-09-27 at 14:41
    };
    action();
  }, [accessToken, campaignId]);
  return simulations;
}
