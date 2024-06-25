import { atom } from 'jotai';

export type InvitedMember = {
  email: string;
  role: 'admin' | 'member';
};

export const selectedMembersAtom = atom<InvitedMember[]>([]);
