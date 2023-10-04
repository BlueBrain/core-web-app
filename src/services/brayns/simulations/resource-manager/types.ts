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

  loadSimulation(options: SimulationSlot): void;
}
