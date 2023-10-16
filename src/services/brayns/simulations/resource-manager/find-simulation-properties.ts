/* eslint-disable @typescript-eslint/no-unused-vars */
import { BraynsSimulationOptions } from '../types';
import { CampaignSimulation } from './types';

export function findSimulationProperties(simulation: CampaignSimulation): BraynsSimulationOptions {
  // @TODO: We need to figure out an elastic search
  // to get the SONATA file from the `log-url` property.
  return {
    circuitPath: simulation.sonataFile,
    //   '/gpfs/bbp.cscs.ch/data/scratch/proj134/home/king/BBPP134-479_custom/full_shm800.b/simulation_config.json',
    populationName: 'root__neurons',
    report: { name: 'soma', type: 'compartment' },
  };
}
