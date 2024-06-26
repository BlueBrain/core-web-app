import { SimulationSlot } from '@/components/experiment-interactive/ExperimentInteractive/hooks';

export enum SlotState {
  Initializing,
  AllocatingResource,
  StartingBrayns,
  LoadingSimulation,
  UpAndRunning,
  UnableToStart,
}

export interface SlotInterface {
  /**
   * Holds the current state of the slot.
   */
  get state(): SlotState;

  /**
   * Remove all cache and do not use previous allocation.
   */
  reset(): void;

  loadSimulation(options: SimulationSlot): void;
}

export interface CampaignSimulation {
  campaignId: string;
  simulationId: string;
  sonataFile: string;
}
