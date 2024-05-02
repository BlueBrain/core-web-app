import { useMemo } from 'react';
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

  const generateHexColor = () => {
    const codePoint = firstName.codePointAt(0);
    const availableColors = ['#FA8C16', '#6EC2FF', '#44C798', '#FFE666', '#AB8F6E', '#C95DD2'];
    if (codePoint) {
      const index = codePoint % availableColors.length;
      return availableColors[index];
    }
    return availableColors[0];
  };

  return (
    <div
      style={{ backgroundColor: generateHexColor() }}
      className={`flex h-12 w-12 items-center justify-center ${role === 'member' ? 'rounded-full' : ''}`}
    >
      <span className="text-2xl font-bold text-primary-9">{initials}</span>
    </div>
  );
}
