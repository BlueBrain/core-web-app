import { BraynsSceneController } from './types';
import RemoteControl from './remote-control/client';
import Persistence from './allocation-persistence';
import loadMeshFromURL from './load-mesh-from-url';
import { isObject, isString } from '@/util/type-guards';

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
    const controller = new Controller(rc, onController);
    Controller.controllersPerIFrame.set(iframe, controller);
    controller.initializeBraynsSceneController();
    return true;
  }

  /**
   * Stop listening to IFrame messages.
   * This is a cleanup function that need to be called
   * if the IFrame is unmounted.
   */
  static stopListening(iframe: HTMLIFrameElement | null): boolean {
    if (!iframe) return false;

    const controller = Controller.controllersPerIFrame.get(iframe);
    if (!controller) return false;

    controller.rc.removeEventListener(controller.handleEnventsFromIFrame);
    Controller.controllersPerIFrame.delete(iframe);
    return true;
  }

  private constructor(
    private readonly rc: RemoteControl,
    private readonly onController: (controller: BraynsSceneController) => void
  ) {}

  private initializeBraynsSceneController() {
    this.rc.addEventListener(this.handleEnventsFromIFrame);
  }

  private readonly handleEnventsFromIFrame = (evt: { name: string; params?: unknown }) => {
    if (evt.name === 'ready') {
      if (!isObject(evt.params) || !isString(evt.params.host)) {
        console.error(`We received a "ready" event without any params.host!`);
        return;
      }

      Persistence.setAllocatedHost(evt.params.host);
      this.onController(this);
    } else if (evt.name === 'fatal') {
      /*
       * The current host is not working anymore, so we will need to
       * allocate again
       */
      Persistence.clearAllocatedHost();
    }
  };

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
    path: string;
    token: string;
    color: [red: number, green: number, blue: number, alpha: number];
  }): Promise<string | null> {
    const { url, path, token, color } = options;
    const content = await loadMeshFromURL(url, token);
    if (!content) return null;

    const id = await this.rc.exec('load-mesh', {
      data: content,
      path,
      color,
    });
    return typeof id === 'string' ? id : null;
  }
}
