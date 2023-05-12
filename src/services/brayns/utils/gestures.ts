/* eslint-disable @typescript-eslint/no-use-before-define */
import GenericEvent from './generic-event';

interface PointerStart {
  startX: number;
  startY: number;
  factor: number;
  button: number;
}

export default class Gestures {
  public eventDrag = new GenericEvent<{
    deltaX: number;
    deltaY: number;
    button: number;
    isKeyPressed: (key: string) => boolean;
  }>();

  public eventZoom = new GenericEvent<number>();

  private pointer: PointerStart | null = null;

  private keysPressed = new Set<string>();

  attach(canvas: HTMLCanvasElement) {
    canvas.addEventListener('pointerdown', this.handlePointerDown);
    canvas.addEventListener('pointerup', this.handlePointerUp);
    canvas.addEventListener('pointermove', this.handlePointerMove);
    canvas.addEventListener('wheel', this.handleWheel);
    canvas.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('keyup', this.handleKeyUp);
  }

  detach(canvas: HTMLElement) {
    canvas.removeEventListener('pointerdown', this.handlePointerDown);
    canvas.removeEventListener('pointerup', this.handlePointerUp);
    canvas.removeEventListener('pointermove', this.handlePointerMove);
    canvas.removeEventListener('wheel', this.handleWheel);
    canvas.removeEventListener('contextmenu', handleContextMenu);
    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('keyup', this.handleKeyUp);
  }

  private readonly handleKeyDown = (evt: KeyboardEvent) => {
    this.keysPressed.add(evt.key);
  };

  private readonly handleKeyUp = (evt: KeyboardEvent) => {
    this.keysPressed.delete(evt.key);
  };

  private readonly isKeyPressed = (key: string) => this.keysPressed.has(key);

  private readonly handleWheel = (evt: WheelEvent) => {
    const zoom = evt.deltaY > 0 ? +1 : -1;
    this.eventZoom.dispatch(zoom);
  };

  private readonly handlePointerDown = (evt: PointerEvent) => {
    const canvas = evt.target as null | HTMLElement;
    if (!canvas) return;

    canvas.setPointerCapture(evt.pointerId);
    const rect = canvas.getBoundingClientRect();
    this.pointer = {
      startX: evt.clientX,
      startY: evt.clientY,
      factor: 1 / Math.min(rect.width, rect.height),
      button: evt.button,
    };
  };

  private readonly handlePointerMove = (evt: PointerEvent) => {
    const { pointer } = this;
    if (!pointer) return;

    const { factor, startX, startY, button } = pointer;
    this.eventDrag.dispatch({
      deltaX: (evt.clientX - startX) * factor,
      deltaY: (evt.clientY - startY) * factor,
      button,
      isKeyPressed: this.isKeyPressed,
    });
    pointer.startX = evt.clientX;
    pointer.startY = evt.clientY;
  };

  private readonly handlePointerUp = (evt: PointerEvent) => {
    this.handlePointerMove(evt);
    this.pointer = null;
    const canvas = evt.target as null | HTMLElement;
    if (!canvas) return;

    canvas.releasePointerCapture(evt.pointerId);
  };
}

/**
 * We don't wnat the context menu to popup when we are dragging the meshes.
 */
function handleContextMenu(evt: MouseEvent) {
  evt.preventDefault();
  evt.stopPropagation();
  evt.stopImmediatePropagation();
}
