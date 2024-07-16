import { atom } from 'jotai';
import { FormInstance } from 'antd';

export type InvitedMember = {
  email: string;
  role: 'admin' | 'member';
};

export type Form = FormInstance<{ name: string; description: string }>;
export const selectedMembersAtom = atom<InvitedMember[]>([]);
