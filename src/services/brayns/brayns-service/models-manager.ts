/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import GenericEvent from '../utils/generic-event';
import BraynsWrapper from '../wrapper/wrapper';
import { BraynsMeshOptions, BraynsObjects, BusyEventParams } from '../types';
import { loadNexusMetadata } from '../utils/nexus';
import { assertType } from '@/util/type-guards';
import { logError } from '@/util/logger';

const MODELS_PER_MESH_STORAGE_KEY = 'ModelsManager/modelsPerMesh';

/**
 * We need to display a set of models at the time.
 * And since loading a model can take time, we want
 * to add only models that are not already loaded,
 * and just hide the others for later use.
 */
export default class ModelsManager {
  public readonly eventBusy = new GenericEvent<BusyEventParams>();

  private busy = false;

  /**
   * Store the list of the model ids already generated
   * for a given mesh URL.
   */
  private modelsPerMesh: Record<string, number[]> = {};

  private modelsPerMeshNeedsInitialization = true;

  private readonly tasks: BraynsObjects[] = [];

  public constructor(private readonly wrapper: BraynsWrapper, private readonly token: string) {}

  showOnly(objects: BraynsObjects): void {
    this.tasks.push(objects);
    if (!this.busy) this.processTasks();
  }

  clear() {
    this.wrapper.clearModels();
    this.modelsPerMesh = {};
  }

  private async processTasks() {
    this.busy = true;
    await this.initializeModelsPerMesh();
    const { tasks } = this;
    while (tasks.length > 0) {
      const task = tasks.shift();
      if (!task) break;

      try {
        await this.wrapper.hide(this.getAllModelIds());
        for (const obj of task) {
          switch (obj.type) {
            case 'mesh':
              await this.addMesh(obj);
              break;
            default:
              throw Error(`Don't know how to add this object: ${JSON.stringify(obj)}`);
          }
        }
        this.wrapper.repaint();
      } catch (ex) {
        logError('Unable to process this task:', task);
        logError(ex);
      }
    }
    this.busy = false;
  }

  private async initializeModelsPerMesh(): Promise<void> {
    if (!this.modelsPerMeshNeedsInitialization) return;

    await this.loadModelsPerMesh();
  }

  private async loadModelsPerMesh(): Promise<void> {
    try {
      const data = await this.wrapper.storage.get(MODELS_PER_MESH_STORAGE_KEY);
      if (!data) return;

      assetStoredModelsPerMesh(data);
      this.modelsPerMesh = {};
      for (const key of Object.keys(data)) {
        const value = data[key];
        this.modelsPerMesh[key] = value;
      }
    } catch (ex) {
      logError('Unable to load models per mesh map!', ex);
    } finally {
      this.modelsPerMeshNeedsInitialization = false;
    }
  }

  private async saveModelsPerMesh(): Promise<void> {
    try {
      const map: Record<string, number[]> = {};
      const keys = Object.keys(this.modelsPerMesh);
      for (const key of keys) {
        const value = this.modelsPerMesh[key];
        if (value) map[key] = value;
      }
      await this.wrapper.storage.set(MODELS_PER_MESH_STORAGE_KEY, map);
    } catch (ex) {
      logError('Unable to save models per mesh map!', ex);
    }
  }

  private getAllModelIds(): number[] {
    const modelIds: number[] = [];
    for (const key of Object.keys(this.modelsPerMesh)) {
      const idsToAdd = this.modelsPerMesh[key];
      if (!idsToAdd) continue;

      for (const id of idsToAdd) modelIds.push(id);
    }
    return modelIds;
  }

  private async addMesh({ url, color }: BraynsMeshOptions): Promise<number[]> {
    this.eventBusy.dispatch({
      type: 'mesh',
      id: url,
      isLoading: true,
    });
    try {
      const modelIdsFromCache = this.modelsPerMesh[url];
      if (modelIdsFromCache) {
        await this.wrapper.show(modelIdsFromCache);
        return modelIdsFromCache;
      }

      const metadata = await loadNexusMetadata(url, this.token);
      if (!metadata) return [];

      const modelIds = await this.wrapper.mesh.add(metadata._location);
      await this.wrapper.mesh.setColor(color, ...modelIds);
      this.modelsPerMesh[url] = modelIds;
      this.saveModelsPerMesh(); // Don't need to wait this function.
      return modelIds;
    } finally {
      this.eventBusy.dispatch({
        type: 'mesh',
        id: url,
        isLoading: false,
      });
    }
  }
}

interface StoredModelsPerMesh {
  [url: string]: number[];
}

function assetStoredModelsPerMesh(data: unknown): asserts data is StoredModelsPerMesh {
  assertType(data, ['map', ['array', 'number']], 'StoredModelsPerMesh');
}
