import React from 'react';
import { useSession } from 'next-auth/react';

import { Layout } from '../../sub-components/Layout';
import { Main } from '../../sub-components/Main';
import { MemberItem } from './MemberItem';
import { AddMember } from './AddMember';
import { VirtualLabMember } from '@/types/virtual-lab/members';
import styles from './virtual-lab-create-members.module.css';

export interface VirtualLabCreateMembersProps {
  className?: string;
  nextPage: string;
}

export function VirtualLabCreateMembers({ className, nextPage }: VirtualLabCreateMembersProps) {
  const members: VirtualLabMember[] = [];
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
              onDelete={() => {}}
              readonly={member.email === session?.user.email}
            />
          ))}
        </div>
        <AddMember onNew={() => {}} currentMembersEmails={members.map(({ email }) => email)} />
      </Main>
    </Layout>
  );
}
