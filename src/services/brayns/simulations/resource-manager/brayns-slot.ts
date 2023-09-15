/* eslint-disable no-await-in-loop */
import isEqual from 'lodash/isEqual';
import { BraynsSimulationOptions, TokenProvider } from '../types';
import GenericEvent from '../../common/utils/generic-event';
import Allocator from './allocator';
import BraynsService from './brayns-service';
import { SlotInterface, SlotState } from './types';
import { logError } from '@/util/logger';

interface BraynsStatus {
  simulation: BraynsSimulationOptions;
  width: number;
  height: number;
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
    private readonly onNewImage: (image: HTMLImageElement) => void
  ) {
    this.allocator = new Allocator(slotId);
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

  loadSimulation(options: BraynsSimulationOptions): void {
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
      }
    } finally {
      this.processing = false;
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

  fatal(...args: unknown[]) {
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
}

function areDifferentSimulations(
  a: BraynsSimulationOptions | undefined,
  b: BraynsSimulationOptions | undefined
) {
  if (a === b) return false;

  if (!a || !b) return true;

  return isEqual(a, b);
}
