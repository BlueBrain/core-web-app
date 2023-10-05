/* eslint-disable no-await-in-loop */
import isEqual from 'lodash/isEqual';
import { BraynsSimulationOptions, TokenProvider } from '../types';
import GenericEvent from '../../common/utils/generic-event';
import { CameraTransformInteface } from '../../common/utils/camera-transform';
import Calc, { Vector3 } from '../../common/utils/calc';
import Allocator from './allocator';
import BraynsService from './brayns-service';
import { CampaignSimulation, SlotInterface, SlotState } from './types';
import { logError } from '@/util/logger';
import { SimulationSlot } from '@/components/experiment-interactive/ExperimentInteractive/hooks';

interface BraynsStatus {
  simulation: {
    campaignId: string;
    simulationId: string;
  };
  width: number;
  height: number;
  camera: {
    height: number;
    position: Vector3;
    target: Vector3;
    up: Vector3;
  };
}

/**
 * This class is responsible of sending requests to one instance of Brayns.
 * All the methods are synchronous, but the result is not.
 * So if you call loadSimulation, the real request will be processed
 * as soon as possible, but the method will return immediatly.
 */
export default class BraynsSlot implements SlotInterface {
  private _state: SlotState = SlotState.AllocatingResource;

  private _error: string | null = null;

  private current: Partial<BraynsStatus> = {};

  private next: Partial<BraynsStatus> = {};

  private brayns: BraynsService | null = null;

  private readonly allocator: Allocator;

  /** Is task processing in progress? */
  private processing = false;

  public readonly eventStateChange = new GenericEvent<SlotState>();

  public readonly eventErrorChange = new GenericEvent<string | null>();

  constructor(
    private readonly tokenProvider: TokenProvider,
    private readonly slotId: number,
    private readonly camera: CameraTransformInteface,
    private readonly onNewImage: (image: HTMLImageElement) => void
  ) {
    this.allocator = new Allocator(slotId);
    this.camera.addChangeListener(this.handleCameraChange);
  }

  get error() {
    return this._error;
  }

  set error(value: string | null) {
    if (this._error === value) return;

    this._error = value;
    if (value) this.state = SlotState.UnableToStart;
    this.eventErrorChange.dispatch(value);
  }

  get state() {
    return this._state;
  }

  private set state(value: SlotState) {
    if (value === this._state) return;

    this._state = value;
    this.eventStateChange.dispatch(value);
  }

  loadSimulation(options: SimulationSlot): void {
    this.next.simulation = structuredClone(options);
    this.process();
  }

  setViewport(width: number, height: number) {
    this.next.width = width;
    this.next.height = height;
    this.process();
  }

  private async process() {
    if (this.processing) return;
    try {
      this.processing = true;
      let loop = true;
      while (loop) {
        loop = await this.updateViewport();
        loop ||= await this.updateCircuit();
        loop ||= await this.updateCamera();
        if (loop) await this.askNextFrame();
      }
    } finally {
      this.processing = false;
    }
  }

  private async askNextFrame() {
    try {
      const brayns = await this.getBraynsService();
      brayns.askNextFrame();
    } catch (ex) {
      this.fatal(`Unable to ask a new frame for slot #${this.slotId}:`, ex);
    }
  }

  private async updateViewport(): Promise<boolean> {
    const { width, height } = this.next;
    if (width === this.current.width && height === this.current.height) {
      // Nothing to update.
      return false;
    }
    try {
      const brayns = await this.getBraynsService();
      await brayns.setViewport(width ?? 0, height ?? 0);
      this.current.width = width;
      this.current.height = height;
      return true;
    } catch (ex) {
      this.fatal(`Unable to set viewport for slot #${this.slotId}:`, ex);
      return false;
    }
  }

  private async updateCircuit(): Promise<boolean> {
    const { simulation } = this.next;
    if (!simulation) return false;
    if (!areDifferentSimulations(simulation, this.current.simulation)) {
      // Nothing to update.
      return false;
    }
    try {
      const brayns = await this.getBraynsService();
      this.state = SlotState.LoadingSimulation;
      await brayns.loadCircuit(simulation);
      this.current.simulation = simulation;
      return true;
    } catch (ex) {
      this.fatal(`Unable to load circuit for slot #${this.slotId}:`, simulation, ex);
      return false;
    } finally {
      this.state = SlotState.UpAndRunning;
    }
  }

  private async updateCamera(): Promise<boolean> {
    const { camera } = this.next;
    if (!camera) return false;
    if (isEqual(camera, this.current.camera)) return false;

    try {
      const brayns = await this.getBraynsService();
      this.current.camera = camera;
      await brayns.setCameraOrthographic(camera);
      await brayns.setCameraView(camera);
      return true;
    } catch (ex) {
      logError(`Unable to set camera for slot #${this.slotId}!`, ex);
      return false;
    }
  }

  private async getBraynsService(): Promise<BraynsService> {
    if (this.brayns) return this.brayns;

    try {
      this.state = SlotState.AllocatingResource;
      const allocation = await this.allocator.allocate(this.tokenProvider.token);
      const hostname = allocation.host;
      const brayns = new BraynsService(hostname, this.onNewImage);
      this.state = SlotState.StartingBrayns;
      const version = await brayns.getVersion();
      // eslint-disable-next-line no-console
      console.info(`👍 Brayns v${version} is started on slot #${this.slotId}.`);
      this.brayns = brayns;
      return brayns;
    } catch (ex) {
      this.fatal(`Unable to get Brayns service for slot #${this.slotId}:`, ex);
      throw ex;
    } finally {
      this.state = SlotState.UpAndRunning;
    }
  }

  private fatal(...args: unknown[]) {
    logError(...args);
    this.error = args
      .map((arg) => {
        if (arg instanceof Error) return arg.message;

        if (typeof arg === 'string') return arg;

        return JSON.stringify(
          arg,
          (_key: string, val: any) => {
            if (typeof val === 'function') return '<function()>';
            return val;
          },
          '  '
        );
      })
      .join('\n');
  }

  private readonly handleCameraChange = () => {
    const { camera } = this;
    const distance = camera.getDistance();
    const target = camera.getTarget();
    const orientation = camera.getOrientation();
    const { y: up, z: direction } = Calc.getAxisFromQuaternion(orientation);
    const height = distance;
    const position = Calc.addVectors(
      target,
      Calc.scaleVector(
        Calc.normalizeVector(Calc.subVectors(target, Calc.scaleVector(direction, distance))),
        1e6
      )
    );
    this.next.camera = {
      height,
      position,
      target,
      up,
    };
    this.process();
  };
}

function areDifferentSimulations(
  a: CampaignSimulation | undefined,
  b: CampaignSimulation | undefined
) {
  if (a === b) return false;

  if (!a || !b) return true;

  return isEqual(a, b);
}
