/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

import CameraTransform from '../common/utils/camera-transform';
import ResourceManager from './resource-manager/resource-manager';
import { MAX_BRAYNS_INSTANCES } from './settings';
import { BraynsSimulationOptions, TokenProvider } from './types';
import { checkSlotId } from './utils';
import { SlotState } from './resource-manager/types';

export function useMultiBraynsManager(): MultiBraynsManagerInterface | null {
  const { data } = useSession();
  const token = data?.accessToken;
  return token ? MultiBraynsManager.getSingleton(token) : null;
}

export function useSlotState(slotId: number): SlotState {
  const manager = useMultiBraynsManager();
  const [state, setState] = useState<SlotState>(SlotState.Initializing);
  useEffect(() => {
    if (!manager) return;

    manager.addSlotStateChangeHandler(slotId, setState);
    // eslint-disable-next-line consistent-return
    return () => {
      manager.removeSlotStateChangeHandler(slotId, setState);
    };
  }, [slotId, manager]);
  return state;
}

export function useSlotError(slotId: number): string | null {
  const manager = useMultiBraynsManager();
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (!manager) return;

    manager.addSlotErrorChangeHandler(slotId, setError);
    // eslint-disable-next-line consistent-return
    return () => {
      manager.removeSlotErrorChangeHandler(slotId, setError);
    };
  }, [slotId, manager]);
  return error;
}

export interface MultiBraynsManagerInterface {
  addSlotStateChangeHandler(slotId: number, handler: (state: SlotState) => void): void;

  removeSlotStateChangeHandler(slotId: number, handler: (state: SlotState) => void): void;

  addSlotErrorChangeHandler(slotId: number, handler: (error: string | null) => void): void;

  removeSlotErrorChangeHandler(slotId: number, handler: (error: string | null) => void): void;

  attachCanvas(slotId: number, canvas: HTMLCanvasElement): void;

  detachCanvas(slotId: number, canvas: HTMLCanvasElement): void;

  loadSimulation(slotId: number, options: BraynsSimulationOptions): void;

  setSimulationFrame(frameIndex: number): void;
}

class MultiBraynsManager implements MultiBraynsManagerInterface, TokenProvider {
  // ===============
  //  Class Members
  // ---------------
  private static instance: MultiBraynsManager | null = null;

  /**
   * @returns The unique instance of MultiBraynsManager.
   */
  static getSingleton(token: string): MultiBraynsManager {
    if (!MultiBraynsManager.instance) {
      MultiBraynsManager.instance = new MultiBraynsManager();
    }
    MultiBraynsManager.instance.token = token;
    return MultiBraynsManager.instance;
  }

  // ==================
  //  Instance Members
  // ------------------
  public token = '';

  public readonly camera = CameraTransform;

  private readonly resourceManager: ResourceManager;

  /**
   * Map canvases (with ResizeObservers) to slots.
   */
  private readonly canvases: Array<Map<HTMLCanvasElement, ResizeObserver>>;

  private constructor() {
    const canvases: Array<Map<HTMLCanvasElement, ResizeObserver>> = [];
    const nextSimulationToLoad: (BraynsSimulationOptions | null)[] = [];
    const currentlyLoadedSimulation: (BraynsSimulationOptions | null)[] = [];
    for (let slotId = 0; slotId < MAX_BRAYNS_INSTANCES; slotId += 1) {
      canvases.push(new Map<HTMLCanvasElement, ResizeObserver>());
      nextSimulationToLoad.push(null);
      currentlyLoadedSimulation.push(null);
    }
    this.canvases = canvases;
    this.resourceManager = new ResourceManager(this, this.handleNewImage);
  }

  addSlotStateChangeHandler(slotId: number, handler: (state: SlotState) => void): void {
    checkSlotId(slotId);
    const slot = this.resourceManager.getSlot(slotId);
    slot.eventStateChange.addListener(handler);
  }

  removeSlotStateChangeHandler(slotId: number, handler: (state: SlotState) => void): void {
    checkSlotId(slotId);
    const slot = this.resourceManager.getSlot(slotId);
    slot.eventStateChange.removeListener(handler);
  }

  addSlotErrorChangeHandler(slotId: number, handler: (error: string | null) => void): void {
    checkSlotId(slotId);
    const slot = this.resourceManager.getSlot(slotId);
    slot.eventErrorChange.addListener(handler);
  }

  removeSlotErrorChangeHandler(slotId: number, handler: (error: string | null) => void): void {
    checkSlotId(slotId);
    const slot = this.resourceManager.getSlot(slotId);
    slot.eventErrorChange.removeListener(handler);
  }

  attachCanvas(slotId: number, canvas: HTMLCanvasElement) {
    checkSlotId(slotId);
    const observer = new ResizeObserver(() => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.setAttribute('width', `${w}`);
      canvas.setAttribute('height', `${h}`);
      const slot = this.resourceManager.getSlot(slotId);
      slot.setViewport(w, h);
    });
    observer.observe(canvas);
    this.canvases[slotId].set(canvas, observer);
  }

  detachCanvas(slotId: number, canvas: HTMLCanvasElement) {
    checkSlotId(slotId);
    const observer = this.canvases[slotId].get(canvas);
    if (observer) {
      this.canvases[slotId].delete(canvas);
      observer.disconnect();
    }
  }

  loadSimulation(slotId: number, options: BraynsSimulationOptions) {
    checkSlotId(slotId);
    const slot = this.resourceManager.getSlot(slotId);
    slot.loadSimulation(options);
  }

  // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-unused-vars
  setSimulationFrame(frameIndex: number) {
    // Implementation will follow in another MR.
  }

  /**
   * Update canvases mapped to a slot.
   */
  private readonly handleNewImage = (slotId: number, image: HTMLImageElement) => {
    const canvases = Array.from(this.canvases[slotId].keys());
    for (const canvas of canvases) {
      const ctx = canvas.getContext('2d');
      if (!ctx) continue;

      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(image, 0, 0, w, h);
    }
  };
}
