import { useState } from 'react';

import { Layout } from '@/components/VirtualLab/create/sub-components/Layout';
import { Main } from '@/components/VirtualLab/create/sub-components/Main';
import { Button } from '@/components/VirtualLab/create/sub-components/Button';

export interface VirtualLabCreateMembersProps {
  className?: string;
}

export function VirtualLabCreateMembers({ className }: VirtualLabCreateMembersProps) {
  const [members, setMembers] = useState([{ email: 'admin@example.com', name: 'Test user' }]);
  const [newMember, setNewMember] = useState({ email: '', name: '' });

  const handleAddMember = () => {
    if (newMember.email && newMember.name) {
      setMembers([...members, newMember]);
      setNewMember({ email: '', name: '' });
    }
  };

  return (
    <Layout className={className}>
      <Main canGoNext step="members">
        <h2>Members</h2>
        <ul>
          {members.map((member) => (
            <li key={member.email}>{member.name}</li>
          ))}
        </ul>
        <input
          value={newMember.email}
          onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
          placeholder="Enter new member email..."
        />
        <input
          value={newMember.name}
          onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
          placeholder="Enter new member name..."
        />
        <Button onClick={handleAddMember}>Add member +</Button>
      </Main>
    </Layout>
  );
}
