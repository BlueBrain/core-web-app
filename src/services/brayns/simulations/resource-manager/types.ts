import { BraynsSimulationOptions } from '../types';

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

  loadSimulation(options: BraynsSimulationOptions): void;
}
