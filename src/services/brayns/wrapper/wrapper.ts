/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { Vector3 } from '../utils/calc';
import GenericEvent from '../utils/generic-event';
import ImageStream from '../image-stream/image-stream';
import JsonRpcService from '../json-rpc/json-rpc';
import Mesh from './mesh';
import Storage from './storage';
import Light from './light';
import { logError } from '@/util/logger';

const MINIMAL_VIEWPORT_SIZE = 16;

export default class BraynsWrapper {
  private readonly stream: ImageStream;

  public readonly eventNewImage = new GenericEvent<HTMLImageElement>();

  public readonly mesh: Mesh;

  public readonly light: Light;

  public readonly storage: Storage;

  constructor(private readonly service: JsonRpcService, private readonly renderer: JsonRpcService) {
    this.stream = new ImageStream(renderer);
    this.stream.eventNewImage.addListener(this.handleNewImage);
    this.mesh = new Mesh(renderer);
    this.light = new Light(renderer);
    this.storage = new Storage(service);
  }

  async initialize() {
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
      enable_shadows: false,
      max_ray_bounces: 3,
      samples_per_pixel: 8,
      background_color: [0.004, 0.016, 0.102, 0],
    });
    await this.light.clear();
    await this.light.addAmbient({ color: [1, 1, 1], intensity: 1 });
  }

  repaint() {
    this.stream.askForNextFrame();
  }

  async setCameraView(lookAt: { position: Vector3; target: Vector3; up: Vector3 }) {
    return this.renderer.exec('set-camera-view', lookAt);
  }

  async clearModels() {
    await this.renderer.exec('clear-models');
    this.repaint();
  }

  async viewportSet(width: number, height: number) {
    await this.renderer.exec('set-application-parameters', {
      viewport: [
        Math.max(MINIMAL_VIEWPORT_SIZE, Math.ceil(width)),
        Math.max(MINIMAL_VIEWPORT_SIZE, Math.ceil(height)),
      ],
    });
    this.stream.askForNextFrame();
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
