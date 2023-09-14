export interface BraynsSimulationOptions {
  circuitPath: string;
  populationName: string;
  report: {
    name: string;
    /**
     * - "none"
     * - "spikes"
     * - "compartment"
     * - "summation"
     * - "synapse"
     * - "bloodflow_pressure"
     * - "bloodflow_speed"
     * - "bloodflow_radii"
     */
    type: string;
  };
}

export interface TokenProvider {
  /**
   * An attribute that returns the current authentication token.
   */
  token: string;
}
