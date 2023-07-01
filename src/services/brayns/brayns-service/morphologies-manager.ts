/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import Color from '../utils/color';
import State from '../state';
import { BraynsWrapperInterface } from '../wrapper/types';
import { Vector4 } from '../utils/calc';
import { compareSets } from '../utils/set';
import regionsInfo from './regions/regions';
import { logError } from '@/util/logger';
import { AtlasVisualizationManager, CellType } from '@/state/atlas';

interface Task {
  circuitPath: string;
  regions: CellType[];
}

export default class MorphologiesManager {
  /**
   * As an optimization, if we want to display another region for the
   * same circuit, we don't remove the previous one, but we just hide it.
   * But if the circuit path changes, we have to remove all models from
   * Brayns.
   */
  private currentCircuitPath = '';

  /**
   * We keep track of all the regions we already loaded.
   * A region id is mapped to a Brayns model id.
   * All models are hidden but the one whose region id
   * is `currentDisplayedRegionId`.
   */
  private readonly modelIdPerRegion = new Map<string, number>();

  /**
   * The ids of the regions currently displayed.
   */
  private displayedRegionIds = new Set<string>();

  /**
   * Next task to perform.
   * This is used when we are already loading a circuit.
   */
  private nextTask: null | Task = null;

  private busyLoadingCircuit = false;

  constructor(
    private readonly wrapper: BraynsWrapperInterface,
    private readonly atlas: AtlasVisualizationManager
  ) {}

  /**
   * This function schedules the display of the morphologies of a region
   * for a given circuit.
   */
  showRegions(circuitPath: string, regions: CellType[]): void {
    this.nextTask = { circuitPath, regions: [...regions] };
    if (!this.busyLoadingCircuit) {
      this.processNextTask();
    }
  }

  /**
   * We first compare the list of what is already displayed
   * with what we want to display. That gives us a list of
   * regions to hide and a list of regions to load.
   *
   * Loading can take around 5 seconds for each region.
   * That's why, everytime we have loaded one region,
   * we check if there is a new waiting task.
   * If so, we start the comparaison again from scratch.
   *
   * To optimize the process, regions are not unloaded
   * from Brayns, but just hidden. This way, we can
   * show them again very quickly.

   * But as soon as we use another circuit, every region
   * from the previous one are unloaded.
   */
  private async processNextTask() {
    this.busyLoadingCircuit = true;
    State.progress.loadingMorphologies.value = true;
    let task: Task | null = this.nextTask;
    try {
      while (task) {
        if (task.circuitPath !== this.currentCircuitPath) {
          // That's a new circuit: let's make a clear scene.
          this.currentCircuitPath = task.circuitPath;
          await this.clear();
        }
        const { onlyInA: regionIdsToAdd, onlyInB: regionIdsToHide } = compareSets(
          extractRegionIds(task.regions),
          this.displayedRegionIds
        );
        for (const regionId of regionIdsToHide) {
          await this.hideRegion(regionId);
        }
        const regionsToAdd = task.regions.filter(({ regionID }) =>
          regionIdsToAdd.includes(regionID)
        );
        let hasBeenInteruptedByAnotherTask = false;
        for (const region of regionsToAdd) {
          await this.showRegion(region);
          if (task !== this.nextTask) {
            // A new task is waiting for processing.
            // So we stop what we are doing to take
            // the new order.
            task = this.nextTask;
            hasBeenInteruptedByAnotherTask = true;
            break;
          }
        }
        if (!hasBeenInteruptedByAnotherTask) break;
      }
    } finally {
      this.busyLoadingCircuit = false;
      this.wrapper.repaint();
      State.progress.loadingMorphologies.value = false;
    }
  }

  /**
   * If the region already exists, we just unhide it.
   */
  private async showRegion(region: CellType) {
    this.atlas.updateVisibleCell({
      regionID: region.regionID,
      isLoading: true,
    });
    try {
      if (this.displayedRegionIds.has(region.regionID)) {
        // This region is already displayed.
        return;
      }

      this.displayedRegionIds.add(region.regionID);
      if (await this.unhideIfAlreadyLoaded(region.regionID)) return;

      const regionInfo = regionsInfo.get(region.regionID);
      if (!regionInfo) throw Error(`Cannot find this region!`);

      const modelId = await this.wrapper.circuit.load(this.currentCircuitPath, {
        nodeSets: [regionInfo.acronym],
        color: convertHexaColorsToVector4(regionInfo.color),
      });
      this.wrapper.repaint();
      this.modelIdPerRegion.set(region.regionID, modelId);
    } catch (ex) {
      logError(`Unable to load region #${region.regionID}:`, ex);
    } finally {
      this.atlas.updateVisibleCell({
        regionID: region.regionID,
        isLoading: false,
      });
    }
  }

  /**
   * When a region is unselected, we don't unload it, but just hide it.
   * This function is called when we want to show a region, and it
   * tries to unhide it if it has already been loaded.
   * @returns `true` if the region was already loaded and has then been unhidden.
   * `false` if the region has not yet been loaded.
   */
  private async unhideIfAlreadyLoaded(regionID: string): Promise<boolean> {
    const modelId = this.modelIdPerRegion.get(regionID);
    if (!modelId) return false;

    this.atlas.updateVisibleCell({
      type: 'cell',
      regionID,
      isLoading: true,
    });
    await this.wrapper.show([modelId]);
    return true;
  }

  private async hideRegion(regionId: string) {
    if (!this.displayedRegionIds.has(regionId)) {
      // The region is not currently displayed.
      return;
    }

    this.displayedRegionIds.delete(regionId);
    const modelId = this.modelIdPerRegion.get(regionId);
    if (typeof modelId !== 'number') {
      // the model has already been removed.
      return;
    }
    await this.wrapper.hide([modelId]);
  }

  /**
   * Unload all previously loaded regions.
   */
  private async clear() {
    this.modelIdPerRegion.clear();
    this.displayedRegionIds.clear();
    await this.wrapper.clearModels();
  }
}

function convertHexaColorsToVector4(color: string): Vector4 {
  return new Color(`#${color}`).toArrayRGBA();
}

function extractRegionIds(regions: CellType[]): string[] {
  return regions.map((region) => region.regionID);
}
