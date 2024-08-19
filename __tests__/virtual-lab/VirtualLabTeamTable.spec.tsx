import React from 'react';
import { render, screen } from '@testing-library/react';
import { VirtualLabMember } from '@/types/virtual-lab/members';
import VirtualLabTeamTable from '@/components/VirtualLab/VirtualLabTeamTable';

type VirtualLabMemberWithKey = VirtualLabMember & {
  key: string;
};

describe('VirtualLabTeamTable', () => {
  const users: VirtualLabMemberWithKey[] = [
    {
      key: '1',
      id: '1',
      username: 'johndoe',
      created_at: '15-10-2023',
      first_name: 'John',
      last_name: 'Doe',
      invite_accepted: true,
      name: 'John Doe',
      email: 'john_doe@mail.com',
      role: 'admin',
    },
    {
      key: '2',
      id: '2',
      username: 'janesmith',
      created_at: '15-10-2023',
      first_name: 'Jane',
      last_name: 'Smith',
      invite_accepted: true,
      name: 'Jane Smith',
      email: 'jane_smith@mail.com',
      role: 'member',
    },
  ];

  it('renders the total number of members', () => {
    render(<VirtualLabTeamTable users={users} />);

    const totalMembersElement = screen.getByText(/total members/i);
    const countElement = screen.getByText('2');

    expect(totalMembersElement).toBeVisible();
    expect(countElement).toBeVisible();
  });

  it('renders the invite member button', () => {
    render(<VirtualLabTeamTable users={users} />);
    const inviteButton = screen.getByText('Invite member');

    expect(inviteButton).toBeVisible();
  });

  it('renders the table with user names and roles', () => {
    render(<VirtualLabTeamTable users={users} />);

    const firstUserName = screen.getByText('John Doe');
    const secondUserName = screen.getByText('Jane Smith');

    expect(firstUserName).toBeVisible();
    expect(secondUserName).toBeVisible();
  });

  it('renders the virtual lab member icon ', () => {
    render(<VirtualLabTeamTable users={users} />);

    const memberIcons = screen.getAllByTestId('virtual-lab-member-icon');
    expect(memberIcons).toHaveLength(2);
  });
});
