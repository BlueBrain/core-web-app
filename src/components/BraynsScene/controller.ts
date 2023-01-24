import { BraynsSceneController } from './types';
import RemoteControl from './remote-control/client';
import Persistence from './allocation-persistence';
import loadMeshFromURL from './load-mesh-from-url';

export default class Controller implements BraynsSceneController {
  private static controllersPerIFrame = new Map<HTMLIFrameElement, Controller>();

  /**
   * Initialize a communication with BraynsCircuitStudio IFrame
   * and trigger `onController` event once its etablished.
   * @returns `false` if `iframe` is null.
   */
  static startListening(
    iframe: HTMLIFrameElement | null,
    onController: (controller: BraynsSceneController) => void
  ): boolean {
    if (!iframe) return false;

    const controllerFromCache = Controller.controllersPerIFrame.get(iframe);
    if (controllerFromCache) return true;

    const rc = new RemoteControl(iframe);
    const controller = new Controller(rc);
    Controller.controllersPerIFrame.set(iframe, controller);
    controller.initializeBraynsSceneController(onController);
    return true;
  }

  /**
   * This cache is using for meshes that are fetched from Nexus.
   * The URL is the key, the mesh text content is the value.
   */
  private readonly cacheForMeshes = new Map<string, string>();

  private constructor(private readonly rc: RemoteControl) {}

  private initializeBraynsSceneController(
    onController: (controller: BraynsSceneController) => void
  ) {
    this.rc.addEventListener((evt) => {
      if (evt.name === 'ready') {
        Persistence.setAllocatedHost(evt.params.host);
        onController(this);
      } else if (evt.name === 'fatal') {
        Persistence.clearAllocatedHost();
      }
    });
  }

  async setBackgroundColor(options: {
    color: [red: number, green: number, blue: number];
  }): Promise<void> {
    await this.rc.exec('set-background-color', options);
  }

  async clear(): Promise<void> {
    await this.rc.exec('clear');
  }

  async loadCircuit(options: { path: string }): Promise<string | null> {
    const id = await this.rc.exec('load-circuit', { path: options.path });
    return typeof id === 'string' ? id : null;
  }

  async loadMesh(options: {
    path: string;
    color: [red: number, green: number, blue: number, alpha: number];
  }): Promise<string | null> {
    const id = await this.rc.exec('load-mesh', options);
    return typeof id === 'string' ? id : null;
  }

  async loadMeshFromURL(options: {
    url: string;
    token: string;
    color: [red: number, green: number, blue: number, alpha: number];
  }): Promise<string | null> {
    const { url, token, color } = options;
    let content = this.cacheForMeshes.get(url);
    if (!content) {
      content = await loadMeshFromURL(url, token);
      if (!content) return null;

      this.cacheForMeshes.set(url, content);
    }
    const id = await this.rc.exec('load-mesh', {
      data: content,
      color,
    });
    return typeof id === 'string' ? id : null;
  }
}
