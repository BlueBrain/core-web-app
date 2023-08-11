import every from 'lodash/every';
import { Session } from 'next-auth';
import { fetchFileByUrl } from '@/api/nexus';
import { createHeaders } from '@/util/utils';
import { Dimension } from '@/components/explore-section/Simulations/types';
import {
  ExploreSectionResponse,
  Simulation,
  SimulationResource,
} from '@/types/explore-section/resources';
import calculateDimensionValues from '@/api/explore-section/dimensions';
import { API_SEARCH } from '@/constants/explore-section/queries';

/**
 * Checks if a given simulation falls within a given dimension
 * @param simulation
 * @param dimension
 */
const simulationIncludesDimension = (simulation: Simulation, dimension: Dimension) => {
  const dimensionValues = calculateDimensionValues(dimension.value);

  return dimensionValues.includes(simulation.dimensions[dimension.id]);
};

/**
 * Checks if the given simulation falls within all dimensions
 * @param simulation
 * @param otherDimensions
 */
const simulationIncludesAllDimensions = (simulation: Simulation, otherDimensions: Dimension[]) =>
  every(otherDimensions, (otherDimension) =>
    simulationIncludesDimension(simulation, otherDimension)
  );

export default function findSimulation(
  x: number,
  y: number,
  xDimension: Dimension,
  yDimension: Dimension,
  simulations: Simulation[],
  status: string,
  otherDimensions?: Dimension[]
) {
  if (xDimension && yDimension && otherDimensions) {
    const simulation = simulations.find(
      (sim: Simulation) =>
        sim.dimensions[xDimension.id] === x && sim.dimensions[yDimension.id] === y
    );

    if (
      simulation &&
      (simulation.status.toLowerCase() === status || status === 'all') &&
      simulationIncludesAllDimensions(simulation, otherDimensions)
    ) {
      return simulation;
    }
  }

  return undefined;
}

export async function fetchSimulationsFromEs(accessToken: string, campaignId: string) {
  if (!accessToken) throw new Error('Access token should be defined');

  return fetch(API_SEARCH, {
    method: 'POST',
    headers: createHeaders(accessToken),
    body: JSON.stringify({
      query: {
        bool: {
          filter: [
            {
              term: {
                'campaign.identifier.keyword': campaignId,
              },
            },
          ],
        },
      },
    }),
  })
    .then((response) => response.json())
    .then<ExploreSectionResponse>((data) => ({
      hits: data?.hits?.hits,
      total: data?.hits?.total,
      aggs: data.aggregations,
    }));
}

export async function fetchAnalysisReportsFromEs(session: Session, simulationIds: string[]) {
  const { accessToken } = session;

  if (!accessToken) throw new Error('Access token should be defined');

  return fetch(API_SEARCH, {
    method: 'POST',
    headers: createHeaders(accessToken),
    body: JSON.stringify({
      query: {
        bool: {
          filter: [
            {
              terms: {
                'derivation.identifier.keyword': simulationIds,
              },
            },
          ],
        },
      },
    }),
  })
    .then((response) => response.json())
    .then((data) =>
      data?.hits?.hits.map(async ({ _source: report }: { _source: SimulationResource }) => ({
        id: report['@id'],
        type: report['@type'],
        blob: await fetchFileByUrl(report.distribution[0].contentUrl, session).then((res) =>
          res.blob()
        ),
        name: report.name,
        description: report.description,
        simulation: report.derivation.find(
          ({ '@type': type }: { '@type': string }) => type === 'https://neuroshapes.org/Simulation'
        ).identifier,
      }))
    );
}
