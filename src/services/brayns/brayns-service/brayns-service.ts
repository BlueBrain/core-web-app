import Async from '../utils/async';
import GenericEvent from '../utils/generic-event';
import { BraynsObjects, BraynsServiceInterface, BusyEventParams } from '../types';
import { Vector2 } from '../utils/calc';
import BraynsWrapper from '../wrapper/wrapper';
import ModelsManager from './models-manager';
import CameraManager from './camera-manager';
import Gestures from './gestures';

// const BRAIN_MESH_URL =
//   'https://bbp.epfl.ch/nexus/v1/files/bbp/atlas/00d2c212-fa1d-4f85-bd40-0bc217807f5b';

export default class BraynsService implements BraynsServiceInterface {
  public readonly eventBusy: GenericEvent<BusyEventParams>;

  private canvasValue: HTMLCanvasElement | null = null;

  private readonly observer: ResizeObserver;

  private readonly modelsManager: ModelsManager;

  private readonly gestures = new Gestures();

  public readonly camera: CameraManager;

  constructor(private readonly wrapper: BraynsWrapper, private readonly token: string) {
    this.observer = new ResizeObserver(this.handleResize);
    wrapper.eventNewImage.addListener(this.handleNewImage);
    this.modelsManager = new ModelsManager(wrapper, token);
    this.eventBusy = this.modelsManager.eventBusy;
    this.camera = new CameraManager(wrapper);
    this.gestures.eventDrag.addListener(this.handlePointerDrag);
  }

  get canvas() {
    return this.canvasValue;
  }

  set canvas(canvas: HTMLCanvasElement | null) {
    if (this.canvasValue) {
      this.observer.unobserve(this.canvasValue);
      this.gestures.detach(this.canvasValue);
    }
    this.canvasValue = canvas;
    if (canvas) {
      this.observer.observe(canvas);
      this.handleResize();
      this.initialize();
      this.gestures.attach(canvas);
      this.camera.update({});
    }
  }

  /**
   * Show the given objects and only those.
   */
  showOnly(objects: BraynsObjects): void {
    this.modelsManager.showOnly(objects);
  }

  async initialize() {
    await this.wrapper.initialize();
  }

  async reset() {
    this.modelsManager.clear();
    this.initialize();
  }

  private readonly handlePointerDrag = ([deltaX, deltaY]: Vector2) => {
    /* Scaling is used to mitigate the mouse speed */
    const scaleX = 5;
    const scaleY = 5;
    const { camera } = this;
    const { latitude, longitude } = camera.get();
    camera.update({
      longitude: deltaX * scaleX + longitude,
      latitude: deltaY * scaleY + latitude,
    });
  };

  private readonly handleResize = Async.debounce(async () => {
    const { canvas } = this;
    if (!canvas) return;

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    await this.wrapper.viewportSet(canvas.width, canvas.height);
  }, 300);

  private readonly handleNewImage = (img: HTMLImageElement) => {
    const { canvas } = this;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const scaleWidth = canvas.width / img.width;
    const scaleHeight = canvas.height / img.height;
    const scale = Math.min(scaleWidth, scaleHeight);
    const scaledWidth = Math.floor(img.width * scale);
    const scaledHeight = Math.floor(img.height * scale);
    const x = Math.floor(0.5 * (canvas.width - scaledWidth));
    const y = Math.floor(0.5 * (canvas.height - scaledHeight));
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
  };
}
