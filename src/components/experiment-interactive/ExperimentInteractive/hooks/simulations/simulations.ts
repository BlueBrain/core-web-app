import { useState, useEffect } from 'react';

import { CampaignDescriptor, useAccessToken } from '../current-campaign-descriptor';
import LimitedCache from '../limited-cache';
import { parseTemplateFile } from './parse-template-file';
import { nexus } from '@/config';
import { fetchSimulationsFromEs } from '@/api/explore-section/simulations';
import { assertType } from '@/util/type-guards';
import { logError } from '@/util/logger';

export interface SimulationDefinition {
  campaignId: string;
  simulationId: string;
  sonataFile: string;
  coords: Record<string, number>;
  startTime: number;
  endTime: number;
  stepDuration: number;
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

/**
 * @returns
 * - `null`: An error occured.
 * - `undefined`: Still fetching data.
 */
export function useSimulations(
  campaignDescriptor: CampaignDescriptor | undefined
): SimulationDefinition[] | undefined | null {
  const [simulations, setSimulations] = useState<SimulationDefinition[] | undefined | null>(
    undefined
  );
  const accessToken = useAccessToken();
  useEffect(() => {
    const action = async () => {
      if (!accessToken) return;
      if (!campaignDescriptor) return;

      setSimulations(undefined);
      try {
        const simulationsList = await simulationsCache.get(campaignDescriptor.id, async () => {
          const list = await fetchSimulations(accessToken, campaignDescriptor.id);
          return list;
        });
        setSimulations(simulationsList);
      } catch (ex) {
        logError(`Unable to load simulations for campaign "${campaignDescriptor.id}"!`, ex);
        setSimulations(null);
      }
    };
    action();
  }, [accessToken, campaignDescriptor]);
  return simulations;
}

async function fetchFromDelta(
  accessToken: string,
  objectId: string,
  contentType = 'application/json'
) {
  const url = `${nexus.url}/resources/${nexus.org}/${nexus.project}/_/${encodeURIComponent(
    objectId
  )}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: new Headers({
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': contentType,
      Accept: '*/*',
    }),
  });
  if (contentType === 'application/json') {
    return response.json();
  }
  return response.blob();
}

async function fetchUrlFromNexus(accessToken: string, url: string, contentType: string) {
  const response = await fetch(url, {
    method: 'GET',
    headers: new Headers({
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': contentType,
      Accept: '*/*',
    }),
  });
  return response.blob();
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
  const simulationIds = data.hits.map(({ _id }) => _id);
  const simulationObjects: SimulationDefinition[] = await Promise.all(
    simulationIds.map(async (simulationId) => {
      const simObject = await fetchFromDelta(accessToken, simulationId);
      assertType<{
        log_url: string;
        parameter: {
          coords: Record<string, number>;
        };
        wasGeneratedBy: {
          '@id': string;
        };
      }>(simObject, {
        log_url: 'string',
        parameter: {
          coords: ['map', 'number'],
        },
        wasGeneratedBy: {
          '@id': 'string',
        },
      });
      const simExec = await fetchFromDelta(accessToken, simObject.wasGeneratedBy['@id']);
      assertType<{
        used: { '@id': string };
      }>(simExec, { used: { '@id': 'string' } });
      const simConfig = await fetchFromDelta(accessToken, simExec.used['@id']);
      assertType<{ template: { contentUrl: string; encodingFormat: 'string' } }>(simConfig, {
        template: {
          contentUrl: 'string',
          encodingFormat: 'string',
        },
      });
      const blob = await fetchUrlFromNexus(
        accessToken,
        simConfig.template.contentUrl,
        simConfig.template.encodingFormat
      );
      const template = await parseTemplateFile(blob);
      assertType<{
        reports: Record<
          string,
          {
            start_time: number;
            end_time: number;
            dt: number;
            type: string;
          }
        >;
      }>(template, {
        reports: [
          'map',
          {
            start_time: 'number',
            end_time: 'number',
            dt: 'number',
            type: 'string',
          },
        ],
      });
      const report = Object.values(template.reports).find((item) => item.type === 'compartment');
      return {
        campaignId,
        simulationId,
        coords: simObject.parameter.coords,
        sonataFile: extractSonataFile(simObject.log_url),
        startTime: report?.start_time ?? 0,
        endTime: report?.end_time ?? 0,
        stepDuration: report?.dt ?? 0,
      };
    })
  );
  return simulationObjects;
}

function extractSonataFile(logUrl: string): string {
  const start = logUrl.indexOf('/gpfs/');
  const logPath = logUrl.substring(start);
  const end = logPath.lastIndexOf('/');
  const path = logPath.substring(0, end + 1);
  return `${path}simulation_config.json`;
}
