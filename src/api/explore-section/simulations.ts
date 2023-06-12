import every from 'lodash/every';
import { Dimension } from '@/components/explore-section/Simulations/types';
import { SimulationResource } from '@/types/explore-section';
import calculateDimensionValues from '@/api/explore-section/dimensions';

/**
 * Checks if a given simulation falls within a given dimension
 * @param simulation
 * @param dimension
 */
const simulationIncludesDimension = (simulation: SimulationResource, dimension: Dimension) => {
  const dimensionValues = calculateDimensionValues(dimension.value);
  return dimensionValues.includes(simulation.coords[dimension.id]);
};

/**
 * Checks if the given simulation falls within all dimensions
 * @param simulation
 * @param otherDimensions
 */
const simulationIncludesAllDimensions = (
  simulation: SimulationResource,
  otherDimensions: Dimension[]
) =>
  every(otherDimensions, (otherDimension) =>
    simulationIncludesDimension(simulation, otherDimension)
  );

export default function findSimulation(
  x: number,
  y: number,
  xDimension: Dimension,
  yDimension: Dimension,
  simulations: SimulationResource[],
  otherDimensions?: Dimension[]
) {
  if (xDimension && yDimension && otherDimensions) {
    const simulation = simulations.find(
      (sim: SimulationResource) =>
        sim.coords[xDimension.id] === x && sim.coords[yDimension.id] === y
    );
    if (simulation) {
      if (simulationIncludesAllDimensions(simulation, otherDimensions)) {
        return simulation;
      }
    }
  }
  return undefined;
}
