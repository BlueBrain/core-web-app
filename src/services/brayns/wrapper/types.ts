import { Vector3, Vector4 } from '../utils/calc';
import { logError } from '@/util/logger';
import { assertType } from '@/util/type-guards';

export interface CircuitLoaderOptions {
  /**
   * A list of node sets to load.
   * Usually, we use only one node set: the region acronym.
   */
  nodeSets: string[];
  color: Vector4;
}

export interface BraynsBounds {
  min: [Number, Number, number];
  max: [Number, Number, number];
}

export interface BraynsModel {
  bounds: BraynsBounds;
  is_visible: boolean;
  model_id: number;
  model_type: string;
}

export function assertBraynsModel(data: unknown, prefix = 'data'): asserts data is BraynsModel {
  try {
    assertType(
      data,
      {
        bounds: {
          min: ['array', 'number'],
          max: ['array', 'number'],
        },
        is_visible: 'boolean',
        model_id: 'number',
        model_type: 'string',
      },
      prefix
    );
  } catch (ex) {
    logError(`${prefix} was expected to be a model, but we got:`, data);
    logError(ex);
    throw ex;
  }
}

export function assertBraynsModelArray(
  data: unknown,
  prefix = 'data'
): asserts data is BraynsModel[] {
  if (!Array.isArray(data)) {
    throw Error(`${prefix} was expected to be an array!`);
  }
  for (let i = 0; i < data.length; i += 1) {
    assertBraynsModel(data[i], `${prefix}[${i}]`);
  }
}

export interface BraynsWrapperInterface {
  readonly circuit: {
    load(path: string, options: CircuitLoaderOptions): Promise<number>;
  };

  repaint(): void;

  purgeRecordedQueries(): void;

  setCameraView(lookAt: { position: Vector3; target: Vector3; up: Vector3 }): Promise<void>;

  /**
   * Remove all models from the scene.
   * Can be circuits, meshes, etc...
   */
  clearModels(): Promise<void>;

  /**
   * Remove some models from the scene.
   */
  removeModels(modelIds: number[]): Promise<void>;

  viewportSet(width: number, height: number): Promise<void>;

  /**
   * Show models whose Ids are given.
   */
  show(modelIds: number[]): Promise<void>;

  /**
   * Hide models whose Ids are given.
   */
  hide(modelIds: number[]): Promise<void>;

  /**
   * List all the models of the current scene.
   * This function is used for debugging today.
   * That's why we just return an `unknown` type.
   */
  listModels(): Promise<unknown>;
}
