export interface BraynsSceneController {
  /**
   * Full scene reset.
   * Remove all visible elements and reset the camera and the lights.
   */
  clear(): Promise<void>;
  /**
   * Load a sonata circuit into the scene.
   * @returns Id of the circuit.
   */
  loadCircuit(options: {
    /** Full GPFS path of the `*.json` file. */
    path: string;
  }): Promise<string | null>;
  /**
   * Load a mesh into the scene.
   * @returns Id of the mesh.
   */
  loadMesh(options: {
    /** Full path in GPFS of a mesh file. */
    path: string;
    /**
     * Color of the mesh in RGBA format.
     * Each number is between 0.0 and 1.0.
     */
    color: [red: number, green: number, blue: number, alpha: number];
  }): Promise<string | null>;
  /**
   * Load a mesh into the scene.
   * @returns Id of the mesh.
   */
  loadMeshFromURL(options: {
    /** Nexus URL. */
    url: string;
    /** Filename with extension, used to recognised the Mesh format. */
    path: string;
    /** Token to use to access Nexus. */
    token: string;
    /**
     * Color of the mesh in RGBA format.
     * Each number is between 0.0 and 1.0.
     */
    color: [red: number, green: number, blue: number, alpha: number];
  }): Promise<string | null>;
  setBackgroundColor(options: { color: [red: number, green: number, blue: number] }): Promise<void>;
}

export interface BraynsSceneProps {
  className?: string;
  token: string;
  account: string;
  onReady(controller: BraynsSceneController): void;
}
