import every from 'lodash/every';
import { Session } from 'next-auth';
import esb from 'elastic-builder';

import { createHeaders } from '@/util/utils';
import { Dimension } from '@/components/explore-section/Simulations/types';
import { ExploreSectionResponse, Simulation } from '@/types/explore-section/resources';
import { AnalysisReport } from '@/types/explore-section/es-analysis-report';
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
      simulation.status &&
      (simulation.status.toLowerCase() === status.toLowerCase() || status === 'all') &&
      simulationIncludesAllDimensions(simulation, otherDimensions)
    ) {
      return simulation;
    }
  }

  return undefined;
}

export async function fetchSimulationsFromEs(accessToken: string, campaignId: string) {
  if (!accessToken) throw new Error('Access token should be defined');

  const query = esb
    .boolQuery()
    .must(esb.termQuery('@type.keyword', 'https://neuroshapes.org/Simulation'))
    .must(esb.termQuery('campaign.@id.keyword', campaignId));

  return fetch(API_SEARCH, {
    method: 'POST',
    headers: createHeaders(accessToken),
    body: JSON.stringify({
      query: query.toJSON(),
    }),
  })
    .then((response) => response.json())
    .then<ExploreSectionResponse>((data) => ({
      hits: data?.hits?.hits,
      total: data?.hits?.total,
      aggs: data.aggregations,
    }));
}

function buildESReportsQuery(simId: string, name?: string, ids?: string[]) {
  if (ids)
    return {
      terms: {
        '@id.keyword': ids,
      },
    }; // Fetch all reports by provided id's

  const query: {
    bool?: {
      must?: { match: { [key: string]: string | string[] } }[];
    };
    terms?: { [key: string]: string | string[] };
  } = {
    bool: {
      must: [
        {
          match: {
            'derivation.identifier.keyword': simId,
          },
        },
      ],
    },
  }; // Fetch all reports beloging to simulation Id

  if (name && query.bool?.must) {
    query.bool.must.push({ match: { name } });
    return query;
  } // If name specified only fetch the report matching that name

  return query;
}

export async function fetchAnalysisReports(
  session: Session,
  simulationId: string,
  name?: string,
  ids?: string[]
): Promise<AnalysisReport[] | undefined> {
  const { accessToken } = session;

  if (!accessToken) throw new Error('Access token should be defined');

  return fetch(API_SEARCH, {
    method: 'POST',
    headers: createHeaders(accessToken),
    body: JSON.stringify({
      query: buildESReportsQuery(simulationId, name, ids),
    }),
  })
    .then((response) => response.json())
    .then((data) =>
      data?.hits?.hits.map(({ _source: report }: { _source: AnalysisReport }) => report)
    );
}
