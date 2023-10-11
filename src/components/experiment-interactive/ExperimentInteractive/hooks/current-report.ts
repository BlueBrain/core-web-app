import { useSimulations } from './simulations';
import { useCurrentCampaignDescriptor } from './current-campaign-descriptor';
import { SimulationReport } from '@/services/brayns/simulations/resource-manager/backend-service';

export function useCurrentSimulationReport(): undefined | null | SimulationReport {
  const campaignDescriptor = useCurrentCampaignDescriptor();
  const simulations = useSimulations(campaignDescriptor);
  if (!simulations) return simulations;
  const [simulation] = simulations;
  return {
    cells: '?',
    delta: simulation.stepDuration,
    end: simulation.endTime,
    name: '?',
    start: simulation.startTime,
    type: '?',
    unit: '?',
  };
}
