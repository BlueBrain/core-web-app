import VirtualLabMemberIcon from '../VirtualLabMemberIcon';
import { Role } from '@/types/virtual-lab/members';

type Props = {
  name: string;
  firstName: string;
  lastName: string;
  lastActive: string;
  memberRole: Role;
};

export default function Member({ name, firstName, lastName, lastActive, memberRole }: Props) {
  return (
    <div className="flex max-w-[128px] grow flex-col items-center gap-2 text-center">
      <VirtualLabMemberIcon firstName={firstName} lastName={lastName} memberRole={memberRole} />
      <div className="font-bold">{name}</div>
      <div className="text-primary-3">Active {lastActive}</div>
    </div>
  );
}
