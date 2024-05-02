import { useMemo } from 'react';

import colorDictionary from './availableColors';
import { Role } from '@/types/virtual-lab/members';

type Props = {
  role: Role;
  firstName: string;
  lastName: string;
};

export default function VirtualLabMemberIcon({ role, firstName, lastName }: Props) {
  const initials = useMemo(() => {
    return `${firstName[0]}${lastName[0]}`;
  }, [firstName, lastName]);

  const index = useMemo(() => {
    const codePoint = firstName.codePointAt(0);

    if (codePoint) {
      return codePoint % colorDictionary.length;
    }
    return 0;
  }, [firstName]);

  return (
    <div
      style={{ backgroundColor: colorDictionary[index].background }}
      className={`flex h-12 w-12 items-center justify-center ${role === 'member' ? 'rounded-full' : ''}`}
    >
      <span className="text-2xl font-bold" style={{ color: colorDictionary[index].color }}>
        {initials}
      </span>
    </div>
  );
}
