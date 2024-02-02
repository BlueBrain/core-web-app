import { useEffect } from 'react';
import { atom, useAtom } from 'jotai';

import { useSimulationSlots } from './simulation-slots';

const atomSlotSelectorVisible = atom(true);

export function useSlotSelectorVisible(): [
  visible: boolean,
  setVisible: (visible: boolean) => void,
] {
  const [visible, setVisible] = useAtom(atomSlotSelectorVisible);
  const slots = useSimulationSlots();
  useEffect(() => {
    if (slots.list.length === 0) setVisible(true);
  }, [setVisible, slots.list.length]);
  return [visible, setVisible];
}
