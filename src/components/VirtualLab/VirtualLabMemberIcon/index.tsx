import { useMemo } from 'react';

import colorDictionary from './availableColors';
import { Role } from '@/types/virtual-lab/members';

type Props = {
  memberRole: Role;
  firstName: string;
  lastName: string;
};

export default function VirtualLabMemberIcon({ memberRole, firstName, lastName }: Props) {
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
      className={`inline-flex h-[72px] w-[72px] items-center justify-center ${memberRole === 'member' ? 'rounded-full' : ''}`}
      data-testid="virtual-lab-member-icon"
    >
      <span className="text-2xl font-bold" style={{ color: colorDictionary[index].color }}>
        {initials}
      </span>
    </div>
  );
}
