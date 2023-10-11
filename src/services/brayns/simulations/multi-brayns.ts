/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

import CameraTransform from '../common/utils/camera-transform';
import Gestures from '../common/utils/gestures';
import ResourceManager from './resource-manager/resource-manager';
import { MAX_BRAYNS_INSTANCES } from './settings';
import { BraynsSimulationOptions, TokenProvider } from './types';
import { checkSlotId } from './utils';
import { SlotState } from './resource-manager/types';
import { SimulationSlot } from '@/components/experiment-interactive/ExperimentInteractive/hooks';

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

export function useSlotError(
  slotId: number
): [error: string | null, setError: (error: string | null) => void] {
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
  return [error, setError];
}

export interface MultiBraynsManagerInterface {
  addSlotStateChangeHandler(slotId: number, handler: (state: SlotState) => void): void;

  removeSlotStateChangeHandler(slotId: number, handler: (state: SlotState) => void): void;

  addSlotErrorChangeHandler(slotId: number, handler: (error: string | null) => void): void;

  removeSlotErrorChangeHandler(slotId: number, handler: (error: string | null) => void): void;

  attachCanvas(slotId: number, canvas: HTMLCanvasElement): void;

  detachCanvas(slotId: number, canvas: HTMLCanvasElement): void;

  loadSimulation(options: SimulationSlot, resetAllocation?: boolean): void;

  setSimulationFrame(frameIndex: number): void;

  readonly camera: typeof CameraTransform;
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

  /** Listen to mouse gestures to control camera. */
  private readonly gestures = new Gestures();

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
    this.resourceManager = new ResourceManager(this, this.camera, this.handleNewImage);
    this.gestures.eventDrag.addListener(handleDrag);
    this.gestures.eventZoom.addListener(handleZoom);
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
    this.gestures.attach(canvas);
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
    this.gestures.detach(canvas);
    const observer = this.canvases[slotId].get(canvas);
    if (observer) {
      this.canvases[slotId].delete(canvas);
      observer.disconnect();
    }
  }

  loadSimulation(options: SimulationSlot, resetAllocation = false) {
    const { slotId } = options;
    checkSlotId(slotId);
    if (resetAllocation) this.resourceManager.resetSlot(slotId);
    const slot = this.resourceManager.getSlot(slotId);
    slot.loadSimulation(options);
  }

  setSimulationFrame(frameIndex: number) {
    for (let slotId = 0; slotId < MAX_BRAYNS_INSTANCES; slotId += 1) {
      if (this.resourceManager.isSlotLoaded(slotId)) {
        const slot = this.resourceManager.getSlot(slotId);
        slot.setSimulationFrame(frameIndex);
      }
    }
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

function handleDrag({
  deltaX,
  deltaY,
  button,
  isKeyPressed,
}: {
  deltaX: number;
  deltaY: number;
  button: number;
  isKeyPressed: (key: string) => boolean;
}) {
  /* Scaling is used to mitigate the mouse speed */
  const shift = isKeyPressed('Shift');
  const scaleX = shift ? 0.5 : 5;
  const scaleY = shift ? 0.5 : 5;
  if (button === 0) {
    // Left mouse button: Orbiting.
    if (isKeyPressed('z')) {
      CameraTransform.rotateAroundZ(-deltaX * scaleX);
    } else {
      if (!isKeyPressed('y')) CameraTransform.rotateAroundX(deltaY * scaleY);
      if (!isKeyPressed('x')) CameraTransform.rotateAroundY(-deltaX * scaleX);
    }
    return;
  }
  // Translating.
  CameraTransform.translate(deltaX * scaleX, deltaY * scaleY);
}

function handleZoom(direction: number) {
  if (direction < 0) CameraTransform.zoomIn();
  else CameraTransform.zoomOut();
}
