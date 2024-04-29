import { useState } from 'react';

import { Layout } from '../../sub-components/Layout';
import { Main } from '../../sub-components/Main';
import { Button } from '../../sub-components/Button';

export interface VirtualLabCreateMembersProps {
  className?: string;
  onNext: () => void;
}

export function VirtualLabCreateMembers({ className, onNext }: VirtualLabCreateMembersProps) {
  const [members, setMembers] = useState([{email: 'admin@example.com', name: 'Test user'}]);
  const [newMember, setNewMember] = useState({email: '', name: ''});

  const handleAddMember = () => {
    if (newMember.email && newMember.name) {
      setMembers([...members, newMember]);
      setNewMember({email: '', name: ''});
    }
  };

  return (
    <Layout className={className}>
      <Main onNext={onNext} canGoNext step="members">
        <h2>Members</h2>
        <ul>
          {members.map((member) => (
            <li key={member.email}>{member.name}</li>
          ))}
        </ul>
        <input
          value={newMember.email}
          onChange={(e) => setNewMember({...newMember, email: e.target.value})}
          placeholder="Enter new member email..."
        />
        <input
          value={newMember.name}
          onChange={(e) => setNewMember({...newMember, name: e.target.value})}
          placeholder="Enter new member name..."
        />
        <Button onClick={handleAddMember}>Add member +</Button>
      </Main>
    </Layout>
  );
}