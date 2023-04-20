import { JsonRpcServiceInterface } from '../json-rpc/types';
import GenericEvent from '../utils/generic-event';
import { loadImage } from './image-tools';
import { logError } from '@/util/logger';
import { assertNumber, assertObject, assertOptionalArrayBuffer } from '@/util/type-guards';

const MINIMAL_VIEWPORT_SIZE = 64;

interface Frame {
  timestamp: number;
  sizeInBytes: number;
}

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

  private readonly eventWaitingForImage: GenericEvent<boolean>;

  /**
   * We don't want to start a **transaction** while there is a pending
   * request for a frame.
   */
  private _waitingForImage = false;

  private lastReceivedImage = new Image();

  private transactionDepth = 0;

  private _accumulationProgress = 0;

  private needAnotherImage = false;

  private viewportWidth = 1;

  private viewportHeight = 1;

  private readonly framesForStats: Frame[] = [];

  /**
   * For performance reasons, we don't dispatch a stats event every time we get
   * a new image. We do this only if the current time is beyond `nextTimeWeCanDispatchStats`.
   */
  private nextTimeWeCanDispatchStats = 0;

  /**
   * Timestamp of the last stats event dispatch.
   */
  private lastStatsDispatchTime = 0;

  constructor(private readonly renderer: JsonRpcServiceInterface) {
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

  readonly askForNextFrame = async (renderEvenIfNothingHasChanged = false): Promise<void> => {
    if (this.waitingForImage || this.transactionDepth > 0) {
      this.needAnotherImage = true;
      return;
    }
    this.needAnotherImage = false;
    this.waitingForImage = true;
    try {
      const result = await this.trigger({
        renderEvenIfNothingHasChanged,
        prepareImageWithoutSendingIt: false,
      });
      this._accumulationProgress = result.progress;
      if (result.frame) {
        this.image = result.frame;
      }
      if (this.shouldAskForNextAccumulationFrame(result.progress)) {
        // There are other accumulations available,
        // we ask for them after the throttling delay.
        window.setTimeout(() => this.askForNextFrame(), 1);
      }
    } finally {
      this.waitingForImage = false;
    }
  };

  /**
   * Prevent Brayns from rendering new images during the execution time of `action()`.
   */
  async transaction<T>(action: () => Promise<T>): Promise<T> {
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
        this.askForNextFrame();
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
    return this.transactionDepth <= 0;
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
    const data = await this.renderer.exec('render-image', { send, force, format: 'jpg' });
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
