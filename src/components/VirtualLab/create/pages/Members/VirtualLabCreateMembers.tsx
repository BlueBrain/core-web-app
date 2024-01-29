import { useSession } from 'next-auth/react';

import { MemberItem } from './MemberItem';
import { AddMember } from './AddMember';
import { useCurrentVirtualLabMembers } from '@virtual-lab-create/hooks/current-virtual-lab';
import { Layout } from '@virtual-lab-create/sub-components/Layout';
import { Main } from '@virtual-lab-create/sub-components/Main';

import styles from './virtual-lab-create-members.module.css';

export interface VirtualLabCreateMembersProps {
  className?: string;
  nextPage: string;
}

export function VirtualLabCreateMembers({ className, nextPage }: VirtualLabCreateMembersProps) {
  const { members, addMember, removeMember } = useCurrentVirtualLabMembers();
  const session = useSession().data;
  return (
    <Layout className={className}>
      <Main nextPage={nextPage} canGoNext={members.length > 0} step="members">
        <h2>Members</h2>
        <div className={styles.list}>
          {members.map((member) => (
            <MemberItem
              key={member.email}
              value={member}
              onDelete={removeMember}
              readonly={member.email === session?.user.email}
            />
          ))}
        </div>
        <AddMember onNew={addMember} currentMembersEmails={members.map(({ email }) => email)} />
      </Main>
    </Layout>
  );
}
