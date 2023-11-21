import { atom, useAtom } from 'jotai';

import { VirtualLabWithOptionalId } from '../types';
import { EMPTY_VIRTUAL_LAB } from '../constants';
import { VirtualLabMember } from '@/services/virtual-lab/types';

const atomCurrentVirtualLab = atom<VirtualLabWithOptionalId>(EMPTY_VIRTUAL_LAB);

export function useCurrentVirtualLab(): [
  lab: VirtualLabWithOptionalId,
  update: (lab: Partial<VirtualLabWithOptionalId>) => void
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

export function useCurrentVirtualLabMembers(): {
  members: VirtualLabMember[];
  addMember: (member: VirtualLabMember) => void;
  removeMember: (member: VirtualLabMember) => void;
} {
  const [lab, update] = useCurrentVirtualLab();
  return {
    members: lab.members,
    addMember(member: VirtualLabMember) {
      update({ members: [...lab.members.filter((m) => m.email !== member.email), member] });
    },
    removeMember(member: VirtualLabMember) {
      update({ members: lab.members.filter((m) => m.email !== member.email) });
    },
  };
}
