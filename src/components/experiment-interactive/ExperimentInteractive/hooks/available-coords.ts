import { useMemo, useState } from 'react';
import { SimulationDefinition } from './simulations/simulations';

export interface SimulationCoord {
  name: string;
  values: number[];
  color: string;
}

/**
 * @returns The list of all the coords found in the simulations,
 * with all possible values for each.
 */
export function useAvailableCoords(
  simulations: SimulationDefinition[] | null | undefined
): SimulationCoord[] {
  const [coords, setCoords] = useState<SimulationCoord[]>([]);
  useMemo(() => {
    if (!simulations) {
      setCoords([]);
      return;
    }
    const valuesPerCoord = new Map<string, Set<number>>();
    simulations.forEach((sim) => {
      const coordNames = Object.keys(sim.coords);
      coordNames.forEach((name) => {
        const values = valuesPerCoord.get(name);
        const value = sim.coords[name];
        if (values) values.add(value);
        else valuesPerCoord.set(name, new Set([value]));
      });
      const keys = Array.from(valuesPerCoord.keys());
      setCoords(
        keys.map((name, index) => ({
          name,
          values: Array.from(valuesPerCoord.get(name) ?? []).sort(),
          color: `hsl(${Math.floor((360 * index) / valuesPerCoord.size)}deg 100% 50%)`,
        }))
      );
    });
  }, [simulations]);
  return coords;
}
