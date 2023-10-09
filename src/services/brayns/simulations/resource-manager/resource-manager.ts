import { CameraTransformInteface as CameraTransformInterface } from '../../common/utils/camera-transform';
import { MAX_BRAYNS_INSTANCES } from '../settings';
import { TokenProvider } from '../types';
import { checkSlotId } from '../utils';
import BraynsSlot from './brayns-slot';

/**
 * This class is responsible of holding the 9 brayns slots
 * and just creating them when they are needed.
 *
 * This class must be used only by MultiBraynsManager.
 */
export default class ResourceManager {
  private readonly slots: Array<BraynsSlot | null> = [];

  constructor(
    private readonly tokenProvider: TokenProvider,
    private readonly camera: CameraTransformInterface,
    private readonly onNewImage: (slotId: number, image: HTMLImageElement) => void
  ) {
    for (let i = 0; i < MAX_BRAYNS_INSTANCES; i += 1) {
      this.slots.push(null);
    }
  }

  resetSlot(slotId: number) {
    if (this.slots[slotId]) this.slots[slotId] = null;
  }

  getSlot(slotId: number): BraynsSlot {
    checkSlotId(slotId);
    const slot = this.slots[slotId];
    if (slot) return slot;

    const newSlot = new BraynsSlot(
      this.tokenProvider,
      slotId,
      this.camera,
      (image: HTMLImageElement) => {
        this.onNewImage(slotId, image);
      }
    );
    this.slots[slotId] = newSlot;
    return newSlot;
  }
}
