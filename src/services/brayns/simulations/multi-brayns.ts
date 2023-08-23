import CameraTransform from '../common/utils/camera-transform';

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

export default class MultiBraynsManager {
  // ===============
  //  Class Members
  // ---------------
  public static readonly MAX_SLOTS = 9;

  private static instance: MultiBraynsManager | null = null;

  /**
   * @returns The unique instance of MultiBraynsManager.
   */
  static getSingleton(): MultiBraynsManager {
    if (!MultiBraynsManager.instance) {
      MultiBraynsManager.instance = new MultiBraynsManager();
    }
    return MultiBraynsManager.instance;
  }

  // ==================
  //  Instance Members
  // ------------------

  public readonly camera = CameraTransform;

  /**
   * Map canvases to slots.
   */
  private readonly canvases: Array<Set<HTMLCanvasElement>>;

  private readonly nextSimulationToLoad: (BraynsSimulationOptions | null)[];

  private readonly currentlyLoadedSimulation: (BraynsSimulationOptions | null)[];

  private constructor() {
    const canvases: Array<Set<HTMLCanvasElement>> = [];
    const nextSimulationToLoad: (BraynsSimulationOptions | null)[] = [];
    const currentlyLoadedSimulation: (BraynsSimulationOptions | null)[] = [];
    for (let slotId = 0; slotId < MultiBraynsManager.MAX_SLOTS; slotId += 1) {
      canvases.push(new Set<HTMLCanvasElement>());
      nextSimulationToLoad.push(null);
      currentlyLoadedSimulation.push(null);
    }
    this.canvases = canvases;
    this.nextSimulationToLoad = nextSimulationToLoad;
    this.currentlyLoadedSimulation = currentlyLoadedSimulation;
  }

  attachCanvas(slotId: number, canvas: HTMLCanvasElement) {
    checkSlotId(slotId);
    this.canvases[slotId].add(canvas);
  }

  detachCanvas(slotId: number, canvas: HTMLCanvasElement) {
    checkSlotId(slotId);
    this.canvases[slotId].delete(canvas);
  }

  loadSimulation(slotId: number, options: BraynsSimulationOptions) {
    checkSlotId(slotId);
    if (JSON.stringify(options) === JSON.stringify(this.currentlyLoadedSimulation[slotId])) {
      // The exact same simulation is already loaded.
      return;
    }
    this.nextSimulationToLoad[slotId] = options;
  }

  // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-unused-vars
  setSimulationFrame(frameIndex: number) {
    // Implementation will follow in another MR.
  }
}

function checkSlotId(slotId: number) {
  try {
    if (slotId !== Math.floor(slotId)) throw Error('Must be an integer!');
    if (slotId < 0) throw Error('Must be greater than 0!');
    if (slotId < MultiBraynsManager.MAX_SLOTS)
      throw Error(`Must be lower than ${MultiBraynsManager.MAX_SLOTS}!`);
  } catch (ex) {
    const message = ex instanceof Error ? ex.message : `${ex}`;
    throw Error(
      `Error! ${message}. Possible slotIds are 0, 1, ..., ${MultiBraynsManager.MAX_SLOTS}.`
    );
  }
}
