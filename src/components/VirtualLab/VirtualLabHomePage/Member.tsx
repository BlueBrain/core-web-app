import VirtualLabMemberIcon from '../VirtualLabMemberIcon';
import { Role } from '@/types/virtual-lab/members';

type Props = {
  name: string;
  firstName: string;
  lastName: string;
  memberRole: Role;
};

export default function Member({ name, firstName, lastName, memberRole }: Props) {
  return (
    <div className="flex max-w-[72px] grow flex-col gap-2 text-center">
      <VirtualLabMemberIcon firstName={firstName} lastName={lastName} memberRole={memberRole} />
      <div className="font-bold">{name}</div>
      {/* Commenting out since feature is not present yet */}
      {/* <div className="text-primary-3">Active {lastActive}</div> */}
    </div>
  );
}
