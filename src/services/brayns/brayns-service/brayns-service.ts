import Async from '../utils/async';
import GenericEvent from '../utils/generic-event';
import { BraynsObjects, BraynsServiceInterface, BusyEventParams } from '../types';
import Calc, { Vector2 } from '../utils/calc';
import BackendAllocatorService from '../allocation/backend-allocator-service';
import BraynsWrapper from '../wrapper/wrapper';
import MeshesManager from './meshes-manager';
import CameraManager from './camera-manager';
import Gestures from './gestures';
import { exportPythonScriptForBraynsRecordedQueries } from './exporter/python';
import MorphologiesManager from './morphologies-manager';

// const BRAIN_MESH_URL =
//   'https://bbp.epfl.ch/nexus/v1/files/bbp/atlas/00d2c212-fa1d-4f85-bd40-0bc217807f5b';

export default class BraynsService implements BraynsServiceInterface {
  public readonly eventBusy: GenericEvent<BusyEventParams>;

  private canvasValue: HTMLCanvasElement | null = null;

  private readonly observer: ResizeObserver;

  private readonly meshesManager: MeshesManager;

  private readonly morphologiesManager: MorphologiesManager;

  private readonly gestures = new Gestures();

  public readonly camera: CameraManager;

  constructor(private readonly wrapper: BraynsWrapper, private readonly token: string) {
    this.observer = new ResizeObserver(this.handleResize);
    wrapper.eventNewImage.addListener(this.handleNewImage);
    this.meshesManager = new MeshesManager(wrapper, token);
    this.morphologiesManager = new MorphologiesManager(wrapper);
    this.eventBusy = this.meshesManager.eventBusy;
    this.camera = new CameraManager(wrapper);
    this.gestures.eventDrag.addListener(this.handlePointerDrag);
    this.gestures.eventZoom.addListener(this.handleZoom);
  }

  showRegion(circuitPath: string, region: { id: string }): void {
    this.morphologiesManager.showRegion(circuitPath, region);
  }

  exportQueries(): void {
    const queries = this.wrapper.purgeRecordedQueries();
    exportPythonScriptForBraynsRecordedQueries(queries);
  }

  downloadLogs(): void {
    const allocator = new BackendAllocatorService(this.token);
    allocator.logStandardOutputAndError(false);
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
      this.camera.updateEulerSettings({});
    }
  }

  /**
   * Show the given objects and only those.
   */
  showMeshes(objects: BraynsObjects): void {
    this.meshesManager.showMeshes(objects);
  }

  async initialize() {
    await this.wrapper.initialize();
  }

  async reset() {
    this.meshesManager.clear();
    this.initialize();
  }

  private readonly handleZoom = (direction: number) => {
    const { camera } = this;
    const factor = direction > 0 ? 1.1 : 0.9;
    const distance = Calc.clamp(camera.getEulerSettings().distance * factor, 1000, 15000);
    console.log('🚀 [brayns-service] factor, distance = ', factor, distance); // @FIXME: Remove this line written on 2023-04-14 at 14:30
    camera.updateEulerSettings({ distance });
  };

  private readonly handlePointerDrag = ([deltaX, deltaY]: Vector2) => {
    /* Scaling is used to mitigate the mouse speed */
    const scaleX = 5;
    const scaleY = 5;
    const { camera } = this;
    const { latitude, longitude } = camera.getEulerSettings();
    camera.updateEulerSettings({
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
