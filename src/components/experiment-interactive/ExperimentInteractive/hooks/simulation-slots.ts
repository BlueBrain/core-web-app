/* eslint-disable no-restricted-syntax */
import { atom, useAtom } from 'jotai';

export interface SimulationSlot {
  slotId: number;
  circuitPath: string;
  populationName: string;
  report: { name: string; type: string };
}

const atomSimulationSlots = atom<SimulationSlot[]>([]);

/**
 * Holds the list of currently displayed slots and provide
 * functions to add/remove/update elements.
 *
 * A "slot" is a space in the mosaic (that can be a 3x3 grid at most)
 * that will display one simulation in Brayns.
 */
export function useSimulationSlots() {
  const [simulationSlots, setSimulationSlots] = useAtom(atomSimulationSlots);
  const add = (simSlot: Omit<SimulationSlot, 'slotId'>): SimulationSlot => {
    const slotId = findFreeSlotId(simulationSlots);
    const newSimSlot: SimulationSlot = {
      ...simSlot,
      slotId,
    };
    setSimulationSlots([...simulationSlots, newSimSlot]);
    return newSimSlot;
  };
  return {
    list: simulationSlots,
    add,
    remove(slotIndex: number) {
      const newList = simulationSlots.filter((item) => item.slotId !== slotIndex);
      if (newList.length === simulationSlots.length) {
        // This slotIndex does not exist.
        return false;
      }
      setSimulationSlots(newList);
      return true;
    },
    update(simulationSlotToUpdate: SimulationSlot): boolean {
      let hasBeenFoundAndReplaced = false;
      const newSimulationSlots = simulationSlots.map((item) => {
        if (item.slotId === simulationSlotToUpdate.slotId) {
          hasBeenFoundAndReplaced = true;
          return simulationSlotToUpdate;
        }
        return item;
      });
      if (hasBeenFoundAndReplaced) setSimulationSlots(newSimulationSlots);
      return hasBeenFoundAndReplaced;
    },
  };
}

function findFreeSlotId(simulationSlots: SimulationSlot[]) {
  const slotIds = simulationSlots.map((item) => item.slotId).sort();
  if (slotIds.length === 0) return 0;

  let freeSlotId = 0;
  for (const slotId of slotIds) {
    if (slotId !== freeSlotId) return freeSlotId;

    freeSlotId += 1;
  }
  if (freeSlotId > 8) throw Error('No remaining free slot Id!');

  return freeSlotId;
}
