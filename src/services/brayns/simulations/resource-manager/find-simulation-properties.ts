/* eslint-disable @typescript-eslint/no-unused-vars */
import { BraynsSimulationOptions } from '../types';

export function findSimulationProperties(
  campaignId: string,
  simulationId: string
): BraynsSimulationOptions {
  // @TODO: We need to figure out an elastic search
  // to get the SONATA file from the `log-url` property.
  return {
    circuitPath:
      '/gpfs/bbp.cscs.ch/data/scratch/proj134/home/king/BBPP134-479_custom/full_shm800.b/simulation_config.json',
    populationName: 'root__neurons',
    report: { name: 'soma', type: 'compartment' },
  };
}
