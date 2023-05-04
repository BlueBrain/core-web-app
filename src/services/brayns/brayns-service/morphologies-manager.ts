/* eslint-disable no-await-in-loop */
import { BraynsWrapperInterface } from '../wrapper/types';
import regionsInfo from './regions/regions';
import { logError } from '@/util/logger';

interface Task {
  circuitPath: string;
  region: { id: string };
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
   * The id of the region currently displayed. Or null if no region is displayed.
   */
  private currentDisplayedRegionId: string | null = null;

  /**
   * Next task to perform.
   * This is used when we are already loading a circuit.
   */
  private nextTask: null | Task = null;

  private busyLoadingCircuit = false;

  constructor(private readonly wrapper: BraynsWrapperInterface) {}

  /**
   * This function schedules the display of the morphologies of a region
   * for a given circuit.
   *
   */
  showRegion(circuitPath: string, region: { id: string }): void {
    if (this.busyLoadingCircuit) {
      this.nextTask = { circuitPath, region };
    } else {
      this.processTask({ circuitPath, region });
    }
  }

  private async processTask(initialTask: Task) {
    this.busyLoadingCircuit = true;
    let task: Task | null = initialTask;
    try {
      while (task) {
        if (task.region.id !== this.currentDisplayedRegionId) {
          if (task.circuitPath !== this.currentCircuitPath) {
            // That's a new circuit: let's make a clear scene.
            this.currentCircuitPath = task.circuitPath;
            await this.clear();
          } else {
            // We need to hide the currently shown region.
            this.hideCurrentDisplayedRegion();
          }
          if (this.modelIdPerRegion.has(task.region.id)) {
            await this.showCurrentDisplayedRegion(task.region.id);
          } else {
            await this.addCurrentDisplayedRegion(task.region.id);
          }
        }
        task = this.nextTask;
      }
    } finally {
      this.busyLoadingCircuit = false;
      this.wrapper.repaint();
    }
  }

  private async addCurrentDisplayedRegion(regionId: string) {
    try {
      const region = regionsInfo.get(regionId);
      if (!region) throw Error(`Cannot find this region!`);

      const modelId = await this.wrapper.circuit.load(this.currentCircuitPath, {
        nodeSets: [region.acronym],
      });
      this.modelIdPerRegion.set(regionId, modelId);
      this.currentDisplayedRegionId = regionId;
    } catch (ex) {
      logError(`Unable to load region #${regionId}:`, ex);
    }
  }

  private async showCurrentDisplayedRegion(regionId: string) {
    const modelId = this.modelIdPerRegion.get(regionId);
    if (typeof modelId !== 'number') return;

    await this.wrapper.show([modelId]);
  }

  private async hideCurrentDisplayedRegion() {
    if (this.currentDisplayedRegionId === null) return;

    const modelId = this.modelIdPerRegion.get(this.currentDisplayedRegionId);
    if (typeof modelId !== 'number') {
      // the model has already been removed.
      return;
    }
    await this.wrapper.hide([modelId]);
    this.currentDisplayedRegionId = null;
  }

  private async clear() {
    const modelIds = Array.from(this.modelIdPerRegion.values());
    this.modelIdPerRegion.clear();
    this.currentDisplayedRegionId = null;
    await this.wrapper.removeModels(modelIds);
  }
}
