import VirtualLabMemberIcon from '../VirtualLabMemberIcon';
import { Role } from '@/types/virtual-lab/members';

type Props = {
  name: string;
  first_name: string;
  last_name: string;
  lastActive: string;
  memberRole: Role;
};

export default function Member({ name, first_name, last_name, lastActive, memberRole }: Props) {
  return (
    <div className="flex max-w-[128px] grow flex-col items-center gap-2">
      <VirtualLabMemberIcon first_name={first_name} last_name={last_name} role={memberRole} />
      <div className="font-bold">{name}</div>
      <div className="text-primary-3">Active {lastActive}</div>
    </div>
  );
}
