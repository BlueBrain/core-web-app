import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useSession } from 'next-auth/react';

import VirtualLabTopMenu from '@/components/VirtualLab/VirtualLabTopMenu';

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}));

describe('VirtualLabTopMenu', () => {
  beforeEach(() => {
    // Mock useSession to return a session with a user
    (useSession as jest.Mock).mockReturnValue({
      data: {
        user: {
          name: 'John Doe',
          email: 'johndoe@example.com',
        },
      },
      status: 'authenticated',
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<VirtualLabTopMenu />);
    expect(screen.getByRole('menu')).toBeVisible();
  });

  it('expands the menu on mouse enter and collapses on mouse leave', () => {
    render(<VirtualLabTopMenu />);

    const userButton = screen.getByText('John Doe');
    fireEvent.mouseEnter(userButton);
    expect(screen.getByText('Log out')).toBeVisible();

    fireEvent.mouseLeave(userButton);
    expect(screen.getByText('Log out')).not.toBeVisible();
  });

  it('renders extra items if provided', () => {
    render(<VirtualLabTopMenu extraItems={[<div key={1}>Extra Item</div>]} />);
    expect(screen.getByText('Extra Item')).toBeVisible();
  });
});
