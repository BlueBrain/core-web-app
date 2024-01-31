import { Vector3 } from '../../common/utils/calc';
import GenericEvent from '../../common/utils/generic-event';
import ImageStream from '../../common/image-stream/image-stream';
import BackendAllocatorService from '../allocation/backend-allocator-service';
import { JsonRpcServiceInterface } from '../../common/json-rpc/types';
import Mesh from './mesh';
import Storage from './storage';
import Light from './light';
import Circuit from './circuit';
import Camera from './camera';
import { BraynsWrapperInterface } from './types';
import { assertType } from '@/util/type-guards';
import { logError } from '@/util/logger';

const MINIMAL_VIEWPORT_SIZE = 64;

// A light with neutral color.
const LIGHT_COLOR: Vector3 = [0.8, 0.8, 0.8];

export default class BraynsWrapper implements BraynsWrapperInterface {
  private readonly stream: ImageStream;

  public readonly eventNewImage = new GenericEvent<HTMLImageElement>();

  public readonly mesh: Mesh;

  public readonly light: Light;

  public readonly storage: Storage;

  public readonly circuit: Circuit;

  private readonly camera: Camera;

  constructor(
    backend: JsonRpcServiceInterface,
    private readonly renderer: JsonRpcServiceInterface
  ) {
    this.stream = new ImageStream(renderer);
    this.stream.eventNewImage.addListener(this.handleNewImage);
    this.circuit = new Circuit(renderer, this);
    this.mesh = new Mesh(renderer);
    this.light = new Light(renderer);
    this.storage = new Storage(backend);
    this.camera = new Camera(renderer);
  }

  async listModels(): Promise<unknown> {
    const data = await this.renderer.exec('get-scene');
    return data;
  }

  async initialize() {
    try {
      const { renderer } = this;
      /**
       * Set the camera as to be able to see the whole mouse brain.
       */
      await renderer.exec('set-camera-orthographic', { height: 15000 });
      await renderer.exec('set-camera-view', {
        position: [6587, 3849, 18837],
        target: [6587, 3849, 5687],
        up: [0, 1, 0],
      });
      await renderer.exec('set-renderer-interactive', {
        ao_samples: 0,
        enable_shadows: true,
        max_ray_bounces: 1,
        samples_per_pixel: 4,
        background_color: [0.002, 0.008, 0.051, 0],
      });
      try {
        await renderer.exec('set-framebuffer-progressive', { scale: 8 });
      } catch (ex) {
        logError('Progressive FrameBuffer setting failed!', ex);
      }
      await this.light.clear();
      await this.light.addDirectional({
        direction: [1, 0, 0],
        color: LIGHT_COLOR,
        intensity: 2.5,
      });
      await this.light.addDirectional({
        direction: [0, 1, 0],
        color: LIGHT_COLOR,
        intensity: 2.5,
      });
      await this.light.addDirectional({
        direction: [0, 0, 1],
        color: LIGHT_COLOR,
        intensity: 2.5,
      });
      await this.light.addDirectional({
        direction: [-1, 0, 0],
        color: LIGHT_COLOR,
        intensity: 1,
      });
      await this.light.addDirectional({
        direction: [0, -1, 0],
        color: LIGHT_COLOR,
        intensity: 1,
      });
      await this.light.addDirectional({
        direction: [0, 0, -1],
        color: LIGHT_COLOR,
        intensity: 1,
      });
      const version = await renderer.exec('get-version');
      /*
       * To reach Brayns, we have to throught two servers.
       * That's why it is important to be able to quickly
       * check the version we have. So we can know if
       * everything is up to date on the line.
       */
      // eslint-disable-next-line no-console
      console.log('Brayns has been started:', version);
    } catch (ex) {
      logError('Unable to initialize BraynsWrapper:', ex);
      const bas = new BackendAllocatorService('');
      bas.logStandardOutputAndError();
      throw ex;
    }
  }

  /**
   * Ask Brayns renderer to refresh the scene because we made changes.
   */
  repaint() {
    this.stream.askForNextFrame();
  }

  purgeRecordedQueries() {
    return this.renderer.purgeRecordedQueries();
  }

  setCameraView(lookAt: { position: Vector3; target: Vector3; up: Vector3 }) {
    return this.camera.setCameraView(lookAt);
  }

  async clearModels() {
    const scene = await this.renderer.exec('get-scene');
    assertType<{ models: Array<{ model_id: number; model_type: string }> }>(scene, {
      models: [
        'array',
        {
          model_id: 'number',
          model_type: 'string',
        },
      ],
    });
    const modelIds = scene.models
      .filter((model) => model.model_type !== 'light')
      .map((model) => model.model_id);
    await this.removeModels(modelIds);
  }

  async removeModels(modelIds: number[]) {
    try {
      await this.renderer.exec('remove-model', { ids: modelIds });
    } catch (ex) {
      // An error can be raised if only one of the models failed to
      // be removed. In this case, we will report the error, but we
      // will try o remove the other models one by one.
      await this.removeModelsOneByOne(modelIds);
    } finally {
      this.repaint();
    }
  }

  /**
   * This method should only be called by `removeModels()` because
   * it's faster to remove all the models at once instead of looping
   * on them.
   * But if you want to delete a whole list in which one of them has
   * already been removed, then the whole process will fail.
   */
  private async removeModelsOneByOne(modelIds: number[]) {
    for (const id of modelIds) {
      try {
        await this.renderer.exec('remove-model', { ids: [id] });
      } catch (ex) {
        logError(`Unable to remove model #${id}:`, ex);
      }
    }
  }

  async viewportSet(width: number, height: number) {
    const w = Math.max(MINIMAL_VIEWPORT_SIZE, Math.ceil(width));
    const h = Math.max(MINIMAL_VIEWPORT_SIZE, Math.ceil(height));
    await this.renderer.exec('set-application-parameters', {
      viewport: [w, h],
    });
    await this.stream.askForNextFrame(true);
  }

  /**
   * Show models whose Ids are given.
   */
  async show(modelIds: number[]) {
    for (const modelId of modelIds) {
      try {
        await this.renderer.exec('update-model', {
          model_id: modelId,
          model: {
            is_visible: true,
          },
        });
      } catch (ex) {
        logError(`Unable to show model #${modelId}:`, ex);
      }
    }
  }

  /**
   * Hide models whose Ids are given.
   */
  async hide(modelIds: number[]) {
    for (const modelId of modelIds) {
      try {
        await this.renderer.exec('update-model', {
          model_id: modelId,
          model: {
            is_visible: false,
          },
        });
      } catch (ex) {
        logError(`Unable to show model #${modelId}:`, ex);
      }
    }
  }

  private readonly handleNewImage = () => {
    this.eventNewImage.dispatch(this.stream.image);
  };
}
