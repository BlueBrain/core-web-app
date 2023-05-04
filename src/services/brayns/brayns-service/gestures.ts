import { Vector2 } from '@/services/brayns/utils/calc';
import GenericEvent from '@/services/brayns/utils/generic-event';

interface PointerStart {
  startX: number;
  startY: number;
  factor: number;
}

export default class Gestures {
  public eventDrag = new GenericEvent<Vector2>();

  public eventZoom = new GenericEvent<number>();

  private pointer: PointerStart | null = null;

  attach(canvas: HTMLCanvasElement) {
    canvas.addEventListener('pointerdown', this.handlePointerDown);
    canvas.addEventListener('pointerup', this.handlePointerUp);
    canvas.addEventListener('pointermove', this.handlePointerMove);
    canvas.addEventListener('wheel', this.handleWheel);
  }

  detach(canvas: HTMLElement) {
    canvas.removeEventListener('pointerdown', this.handlePointerDown);
    canvas.removeEventListener('pointerup', this.handlePointerUp);
    canvas.removeEventListener('pointermove', this.handlePointerMove);
    canvas.removeEventListener('wheel', this.handleWheel);
  }

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
    };
  };

  private readonly handlePointerMove = (evt: PointerEvent) => {
    const { pointer } = this;
    if (!pointer) return;

    const { factor, startX, startY } = pointer;
    this.eventDrag.dispatch([(evt.clientX - startX) * factor, (evt.clientY - startY) * factor]);
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
