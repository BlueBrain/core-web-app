import Async from '../utils/async';
import { BraynsServiceInterface } from '../types';
import BackendAllocatorService from '../allocation/backend-allocator-service';
import BraynsWrapper from '../wrapper/wrapper';
import CameraWatcher from './camera-watcher';
import { exportPythonScriptForBraynsRecordedQueries } from './exporter/python';
import MorphologiesManager from './morphologies-manager';
import { AtlasVisualizationManager, CellType } from '@/state/atlas';

export default class BraynsService implements BraynsServiceInterface {
  private canvasValue: HTMLCanvasElement | null = null;

  private readonly observer: ResizeObserver;

  private readonly morphologiesManager: MorphologiesManager;

  public readonly camera: CameraWatcher;

  constructor(
    private readonly wrapper: BraynsWrapper,
    private readonly token: string,
    atlas: AtlasVisualizationManager
  ) {
    this.observer = new ResizeObserver(this.handleResize);
    wrapper.eventNewImage.addListener(this.handleNewImage);
    this.morphologiesManager = new MorphologiesManager(wrapper, atlas);
    this.camera = new CameraWatcher(wrapper);
  }

  /**
   * Ask Brayns to display all the selected regions.
   * Everything that is not selected must be hidden.
   * This function only schedules for the described
   * task. It will not occur immediatly and may also
   * not occur at all if another call is made before
   * the previous one if over.
   */
  showCellsForRegions(circuitPath: string, regions: CellType[]): void {
    this.morphologiesManager.showRegions(circuitPath, regions);
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
    }
    this.canvasValue = canvas;
    if (canvas) {
      this.observer.observe(canvas);
      this.handleResize();
      this.initialize();
    }
  }

  async initialize() {
    await this.wrapper.initialize();
  }

  async reset() {
    this.initialize();
  }

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
