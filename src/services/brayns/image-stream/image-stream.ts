import { loadImage } from './image-tools';
import GenericEvent from '@/services/brayns/utils/generic-event';
import JsonRpcService from '@/services/brayns/json-rpc/json-rpc';
import {
  assertNumber,
  assertObject,
  assertOptionalArrayBuffer,
  isBoolean,
} from '@/util/type-guards';
import { logError } from '@/util/logger';

const MINIMAL_VIEWPORT_SIZE = 64;

export interface RendererResult {
  frame?: HTMLImageElement;
  progress: number;
}

export interface RendererResultOption {
  renderEvenIfNothingHasChanged: boolean;
  prepareImageWithoutSendingIt: boolean;
}

export default class ImageStream {
  public readonly eventNewImage: GenericEvent<ImageStream>;

  /**
   * We don't want to start a **transaction** while there is a pending
   * request for a frame.
   */
  private readonly eventWaitingForImage: GenericEvent<boolean>;

  private _waitingForImage = false;

  private lastReceivedImage = new Image();

  private transactionDepth = 0;

  private _accumulationProgress = 0;

  private needAnotherImage = false;

  // Reduced quality is faster and suited for interactive camera manipulation.
  private needReducedQuality = false;

  private previousFrameWasInReducedQuality = true;

  private firstImage = true;

  private viewportWidth = 1;

  private viewportHeight = 1;

  constructor(private readonly renderer: JsonRpcService) {
    this.eventNewImage = new GenericEvent();
    this.eventWaitingForImage = new GenericEvent();
    this.askForNextFrame();
  }

  get accumulationProgress() {
    return this._accumulationProgress;
  }

  async setViewport(width: number, height: number) {
    this.viewportWidth = width;
    this.viewportHeight = height;
    await this.internalSetViewport(width, height);
  }

  private async internalSetViewport(width: number, height: number) {
    await this.renderer.exec('set-application-parameters', {
      viewport: [
        Math.max(MINIMAL_VIEWPORT_SIZE, Math.ceil(width)),
        Math.max(MINIMAL_VIEWPORT_SIZE, Math.ceil(height)),
      ],
    });
  }

  private async controlRendererQuality() {
    if (this.needReducedQuality === this.previousFrameWasInReducedQuality) {
      // Nothing has changed regarding the image quality.
      return;
    }
    const width = this.viewportWidth;
    const height = this.viewportHeight;
    if (this.needReducedQuality) {
      // eslint-disable-next-line no-bitwise
      await this.internalSetViewport(width >> 2, height >> 2);
    } else {
      await this.internalSetViewport(width, height);
    }
  }

  readonly askForNextFrame = async (reduceQuality?: boolean): Promise<void> => {
    if (isBoolean(reduceQuality)) this.needReducedQuality = reduceQuality;
    if (this.waitingForImage || this.transactionDepth > 0) {
      this.needAnotherImage = true;
      return;
    }
    this.needAnotherImage = false;
    this.waitingForImage = true;
    try {
      await this.controlRendererQuality();
      const result = await this.trigger({
        renderEvenIfNothingHasChanged: this.firstImage,
        prepareImageWithoutSendingIt: false,
      });
      this.previousFrameWasInReducedQuality = this.needReducedQuality;
      this.firstImage = false;
      this._accumulationProgress = result.progress;
      if (result.frame) {
        this.image = result.frame;
      }
      if (this.shouldAskForNextAccumulationFrame(result.progress)) {
        // There are other accumulations available,
        // we ask for them after the throttling delay.
        window.setTimeout(() => this.askForNextFrame(), 10);
      }
    } finally {
      this.waitingForImage = false;
    }
  };

  /**
   * Prevent Brayns from rendering new images during the execution time of `action()`.
   */
  async transaction<T>(action: () => Promise<T>, reduceQuality = false): Promise<T> {
    this.transactionDepth += 1;
    try {
      await this.waitUntilCurrentRequestIsDone();
      const result = await action();
      return result;
    } catch (ex) {
      logError('Uncaught error during transaction:', ex);
      throw ex;
    } finally {
      this.transactionDepth -= 1;
      if (this.transactionDepth <= 0) {
        this.askForNextFrame(reduceQuality);
      }
    }
  }

  public get image() {
    return this.lastReceivedImage;
  }

  public set image(image: HTMLImageElement) {
    this.lastReceivedImage = image;
    this.eventNewImage.dispatch(this);
  }

  /**
   * If there are still images from the accumulation,
   * we can still skip them if we are in a transaction.
   */
  private shouldAskForNextAccumulationFrame(progress: number): boolean {
    if (progress >= 1) return false;
    return this.needAnotherImage && this.transactionDepth <= 0;
  }

  private get waitingForImage() {
    return this._waitingForImage;
  }

  private set waitingForImage(value: boolean) {
    this._waitingForImage = value;
    this.eventWaitingForImage.dispatch(value);
  }

  /**
   * This promise will resolve only when there is no ongoing request
   * to Brayns for the next image.
   */
  private waitUntilCurrentRequestIsDone(): Promise<void> {
    return new Promise((resolve) => {
      if (!this.waitingForImage) {
        resolve();
        return;
      }

      const handler = (value: boolean) => {
        this.eventWaitingForImage.removeListener(handler);
        if (!value) resolve();
      };
      this.eventWaitingForImage.addListener(handler);
    });
  }

  private async trigger(options: RendererResultOption): Promise<RendererResult> {
    const send = !options.prepareImageWithoutSendingIt;
    const force = options.renderEvenIfNothingHasChanged;
    const data = await this.renderer.exec('render-image', { send, force });
    assertObject(data);
    assertNumber(data.accumulation, 'data.accumulation');
    assertNumber(data.max_accumulation, 'data.max_accumulation');
    assertOptionalArrayBuffer(data.$data);
    let frame: HTMLImageElement | undefined;
    if (data.$data) {
      const blob = new Blob([data.$data], { type: 'image/jpeg' });
      const url = window.URL.createObjectURL(blob);
      frame = await loadImage(url);
      window.URL.revokeObjectURL(url);
    }
    const result: RendererResult = {
      frame,
      progress: data.accumulation / data.max_accumulation,
    };
    return result;
  }
}
