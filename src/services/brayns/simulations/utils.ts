import { MAX_BRAYNS_INSTANCES } from './settings';

/**
 * Throw an error if the slotId is out of bounds.
 * @param slotId Index of a Brayns instance.
 */
export function checkSlotId(slotId: number) {
  try {
    if (slotId !== Math.floor(slotId)) throw Error('SlotId must be an integer!');
    if (slotId < 0) throw Error('Must be greater than 0!');
    if (slotId > MAX_BRAYNS_INSTANCES - 1)
      throw Error(`SlotId must be lower than ${MAX_BRAYNS_INSTANCES}!`);
  } catch (ex) {
    const message = ex instanceof Error ? ex.message : `${ex}`;
    throw Error(
      `Error! ${message}. You provided ${slotId}. Possible slotIds are 0, 1, ..., ${MAX_BRAYNS_INSTANCES}.`
    );
  }
}
