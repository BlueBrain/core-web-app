import Member from './Member';
import { getVirtualLabUsers } from '@/services/virtual-lab/labs';

export default async function VirtualLabUsers({ id }: { id?: string }) {
  const virtualLabUsers = id ? (await getVirtualLabUsers(id)).data.users : undefined;
  return (
    <div className="w-full">
      <div className="my-5 text-lg font-bold uppercase">Members</div>

      <div className="flex-no-wrap flex overflow-x-auto overflow-y-hidden">
        {virtualLabUsers?.map((user) => (
          <div key={user.id} className="mr-20">
            <Member
              name={user.name}
              memberRole={user.role}
              firstName={user.first_name}
              lastName={user.last_name}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
