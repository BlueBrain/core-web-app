import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { atom, useAtom } from 'jotai';

import { VirtualLabWithOptionalId } from '../types';
import { EMPTY_VIRTUAL_LAB } from '../constants';
import { VirtualLabMember } from '@/services/virtual-lab/types';

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

export function useCurrentVirtualLabMembers(): {
  members: VirtualLabMember[];
  addMember: (member: VirtualLabMember) => void;
  removeMember: (member: VirtualLabMember) => void;
} {
  const [lab, update] = useCurrentVirtualLab();
  const session = useSession().data;
  useEffect(() => {
    if (!session) return;

    if (lab.members.find(({ email }) => email === session.user.email)) return;

    update({
      members: [
        {
          name: session.user.name ?? session.user.username,
          // We should always have the email, but since this is an optional
          // attibute, we put a fallback.
          email: session.user.email ?? `${session.user.username}@epfl.ch`,
          role: 'admin',
        },
        ...lab.members,
      ],
    });
  }, [session, lab.members, update]);
  return {
    members: lab.members,
    addMember(newMember: VirtualLabMember) {
      update({ members: [...lab.members.filter((m) => m.email !== newMember.email), newMember] });
    },
    removeMember(memberToDelete: VirtualLabMember) {
      update({ members: lab.members.filter((m) => m.email !== memberToDelete.email) });
    },
  };
}
