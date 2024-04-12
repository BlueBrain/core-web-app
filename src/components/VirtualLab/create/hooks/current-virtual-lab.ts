import { atom, useAtom } from 'jotai';
import { VirtualLabWithOptionalId } from '../types';
import { EMPTY_VIRTUAL_LAB } from '../constants';

const atomCurrentVirtualLab = atom<VirtualLabWithOptionalId>(EMPTY_VIRTUAL_LAB);

export function useCurrentVirtualLab(): [
  lab: VirtualLabWithOptionalId,
  update: (lab: Partial<VirtualLabWithOptionalId>) => void,
] {
  const [lab, setLab] = useAtom(atomCurrentVirtualLab);
  return [
    lab,
    (part: Partial<VirtualLabWithOptionalId>) => {
      setLab({
        ...lab,
        ...part,
      });
    },
  ];
}

export function useCurrentVirtualLabMembers() {}
