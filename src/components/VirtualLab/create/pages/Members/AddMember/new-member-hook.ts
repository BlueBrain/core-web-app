import { useState } from 'react';

import { VirtualLabMember } from '@/services/virtual-lab/types';

export interface NewMember {
  firstname: string;
  lastname: string;
  email: string;
  role: VirtualLabMember['role'];
}

export const EMPTY_MEMBER: NewMember = {
  firstname: '',
  lastname: '',
  email: '',
  role: 'user',
};

export function useNewMember(): [
  member: NewMember,
  update: (member: Partial<NewMember>) => void,
  reset: () => void
] {
  const [member, setMember] = useState(EMPTY_MEMBER);
  return [
    member,
    (update: Partial<NewMember>) => {
      setMember({ ...member, ...update });
    },
    () => setMember(EMPTY_MEMBER),
  ];
}
