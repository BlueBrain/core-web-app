import React from 'react';

import { useCurrentVirtualLabMembers } from '../../hooks/current-virtual-lab';
import { Layout } from '../../sub-components/Layout';
import { Main } from '../../sub-components/Main';
import { MemberItem } from './MemberItem';
import { AddMember } from './AddMember';

import styles from './virtual-lab-create-members.module.css';

export interface VirtualLabCreateMembersProps {
  className?: string;
  nextPage: string;
}

export function VirtualLabCreateMembers({ className, nextPage }: VirtualLabCreateMembersProps) {
  const { members, addMember, removeMember } = useCurrentVirtualLabMembers();
  return (
    <Layout className={className}>
      <Main nextPage={nextPage} canGoNext={members.length > 0} step="members">
        <h2>Members</h2>
        <div className={styles.list}>
          {members.map((member) => (
            <MemberItem key={member.email} value={member} onDelete={removeMember} />
          ))}
        </div>
        <AddMember onNew={addMember} />
      </Main>
    </Layout>
  );
}
