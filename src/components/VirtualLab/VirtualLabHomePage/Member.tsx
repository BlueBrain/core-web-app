import VirtualLabMemberIcon from '../VirtualLabMemberIcon';
import { MockRole } from '@/types/virtual-lab/members';

type Props = {
  name: string;
  lastActive: string;
  memberRole: MockRole;
};

export default function Member({ name, lastActive, memberRole }: Props) {
  return (
    <div className="flex max-w-[128px] grow flex-col items-center gap-2">
      <VirtualLabMemberIcon name={name} role={memberRole} />
      <div className="font-bold">{name}</div>
      <div className="text-primary-3">Active {lastActive}</div>
    </div>
  );
}
