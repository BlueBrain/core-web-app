import { atom } from 'jotai';
import { selectAtom } from 'jotai/utils';
import simulations from './mocks/simulations.json';
import simulationCampaignMock from './mocks/simulation-campaign.json';
import simulation from './mocks/simulation.json';
import { SimulationCampaignResource, SimulationResource } from '@/types/explore-section';

export const simulationCampaignResourceAtom = atom<SimulationCampaignResource | undefined>(
  // @ts-ignore
  () => simulationCampaignMock as SimulationCampaignResource
);

export const simulationCampaignDimensionsAtom = selectAtom(
  simulationCampaignResourceAtom,
  (simCamp) => simCamp?.coords
);

// @ts-ignore
export const simulationsAtom = atom<SimulationResource[]>(() => simulations as Simulation[]);

// @ts-ignore
export const simulationAtom = atom<SimulationResource>(() => simulation as Simulation);

export const simulationCampaignTitleAtom = atom<string | undefined>((get) => {
  // TODO: this is a hardcoded implementation. As soon as we have actual data, this implementation should be replaced by a request to get the simulation campaign details
  const simulationCampaign = get(simulationCampaignResourceAtom);
  return simulationCampaign?.name;
});
