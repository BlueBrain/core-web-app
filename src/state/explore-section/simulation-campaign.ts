import { atom } from 'jotai';
import simulations from './mocks/simulations.json';
import mockData from './mocks/simulation-campaign.json';
import { SimulationCampaignResource } from '@/types/explore-section';

export const simulationCampaignResourceAtom = atom<SimulationCampaignResource | undefined>(
  // @ts-ignore
  () => mockData as SimulationCampaignResource
);

// @ts-ignore
export const simulationsAtom = atom<Simulation[]>(() => simulations as Simulation[]);
