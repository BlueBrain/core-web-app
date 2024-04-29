import { useState } from 'react';

import { Layout } from '../../sub-components/Layout';
import { Main } from '../../sub-components/Main';
import { Button } from '../../sub-components/Button';

export interface VirtualLabCreateMembersProps {
  className?: string;
  onNext: () => void;
}

export function VirtualLabCreateMembers({ className, onNext }: VirtualLabCreateMembersProps) {
  const [members, setMembers] = useState(['admin@example.com']); // Initial members
  const [newMember, setNewMember] = useState(''); // New member to be added

  const handleAddMember = () => {
    if (newMember) {
      setMembers([...members, newMember]);
      setNewMember('');
    }
  };

  return (
    <Layout className={className}>
      <Main onNext={onNext} canGoNext={false} step="members">
        <h2>Members</h2>
        <ul>
          {members.map((member, index) => (
            <li key={index}>{member}</li>
          ))}
        </ul>
        <input
          value={newMember}
          onChange={(e) => setNewMember(e.target.value)}
          placeholder="Enter new member email..."
        />
        <Button onClick={handleAddMember}>Add member +</Button>
      </Main>
    </Layout>
  );
}
