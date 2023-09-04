import { to64 } from '@/util/common';

/**
 * Builds the simulation detail view URL
 *
 * @param org
 * @param proj
 * @param simulationID
 * @param existingPath
 */
export function buildSimulationDetailURL(
  org?: string,
  proj?: string,
  simulationID?: string,
  existingPath?: string | null
) {
  if (!existingPath || !simulationID || !org || !proj) {
    throw new Error('Simulation detail URL cannot be build');
  }
  return `${existingPath}/simulations/${to64(`${org}/${proj}!/!${simulationID}`)}`;
}
