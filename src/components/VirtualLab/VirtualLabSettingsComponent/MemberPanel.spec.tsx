import { Provider } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';

import { Session } from 'next-auth';
import MembersPanel, { LAST_ADMIN_LEAVING_ERROR_MESSAGE } from './MembersPanel';
import sessionAtom from '@/state/session';
import { VirtualLab, VirtualLabMember } from '@/services/virtual-lab/types';
import { createMockVirtualLab } from '__tests__/__utils__/VirtualLab';
import { changeInputValue, getButton, queryButton } from '__tests__/__utils__/utils';

jest.mock('@/services/virtual-lab/virtual-lab-service');

jest.mock('next/navigation', () => ({
  __esModule: true,
  useParams: jest.fn(),
  useRouter: jest.fn(),
}));

const successNotification = jest.fn();

jest.mock('src/hooks/notifications.tsx', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    success: successNotification,
    error: jest.fn(),
  })),
}));

describe('VirtualLabSettingsComponent', () => {
  const onAddMember = jest.fn().mockResolvedValue('true');
  const onChangeRole = jest.fn().mockImplementation(
    () =>
      new Promise((resolve) => {
        resolve({});
      })
  );
  const onDeleteMember = jest.fn().mockResolvedValue(null);

  beforeEach(() => {
    onAddMember.mockClear();
    onChangeRole.mockClear();
    onDeleteMember.mockClear();
    successNotification.mockClear();
  });

  test('shows all members in the virtual lab in members panel', () => {
    const { virtualLab } = renderComponentWithLab('test-lab');
    virtualLab.members.forEach((member) => {
      screen.getByText(member.name, { selector: '[data-testid="virtual-lab-member"]' });
    });
  });

  test('shows add new member button when user is admin', () => {
    renderComponentWithLab('Mock Lab', true);
    getButton('Add new member');
  });

  test('does not show add member button when user is not admin', () => {
    renderComponentWithLab('Mock Lab', false);
    expect(queryButton('Add new member')).toBeFalsy();
  });

  test('Sends invitation to member added by admin', async () => {
    renderComponentWithLab('Mock Lab', true);
    fireEvent.click(getButton('Add new member'));

    changeInputValue('Email', 'newuser@bbp.ch');
    chooseFromMenu({ menuLabel: 'Role', optionText: 'Member' });

    fireEvent.click(getButton('Send invitation'));
    waitFor(() => expect(successNotification).toHaveBeenCalled());
  });

  test('Does not send invite if invalid values for new user are entered', async () => {
    renderComponentWithLab('Mock Lab', true);
    fireEvent.click(getButton('Add new member'));

    changeInputValue('Email', 'not an @email.com');
    chooseFromMenu({ menuLabel: 'Role', optionText: 'Member' });

    fireEvent.click(getButton('Send invitation'));
    expect(successNotification).not.toHaveBeenCalled();
  });

  test('Admin can change role of other users', async () => {
    const { virtualLab } = renderComponentWithLab('Mock Lab', true);
    const nonAdminUser = virtualLab.members.find((member) => member.role !== 'admin')!;

    expect(currentlySelectedValue(`role-for-${nonAdminUser.name}`)?.textContent).toEqual('Member');

    chooseFromMenu({
      menuLabel: `role-for-${nonAdminUser.name}`,
      optionText: 'Administrator',
      menuType: 'standalone',
    });
    expect(onChangeRole).toHaveBeenCalled();

    screen.getByTestId('Saving changes');
    waitFor(() =>
      expect(currentlySelectedValue(`role-for-${nonAdminUser.name}`)?.textContent).toEqual(
        'Administrator'
      )
    );
  });

  test('Admin can delete other members', () => {
    const { virtualLab } = renderComponentWithLab('Mock Lab', true);
    const nonAdminUser = virtualLab.members.find((member) => member.role !== 'admin')!;

    chooseFromMenu({
      menuLabel: `role-for-${nonAdminUser.name}`,
      optionText: 'Remove Member',
      menuType: 'standalone',
      optionSelector: `${DEFAULT_OPTION_SELECTOR} .text-error`,
    });

    screen.getByText('Are you sure you want to remove user Sterling Archer from the virtual lab?');
    click(getButton('Confirm'));

    screen.getByTestId('Saving changes');
    expect(onDeleteMember).toHaveBeenCalled();
  });

  test('Change role controls are not shown to non admin users', () => {
    const { currentUser, virtualLab } = renderComponentWithLab('Mock Lab', false);
    const roleMenus = screen.getAllByRole('combobox');
    expect(roleMenus.length).toBeLessThan(virtualLab.members.length);
    expect(roleMenus.length).toEqual(1);

    const anotherMember = virtualLab.members.find((m) => m.email !== currentUser.email)!;
    const anotherMemberElement = screen.getByText(anotherMember.name).closest('li');
    const anotherMemberRole = within(anotherMemberElement!).getByText(
      anotherMember.role === 'admin' ? 'Administrator' : 'Member'
    );
    click(anotherMemberRole);
    expect(screen.queryByRole('option')).not.toBeInTheDocument();
  });

  test('Users can leave the lab if they want to 😒', () => {
    const { virtualLab } = renderComponentWithLab('Mock Lab', true);
    const anyMember =
      virtualLab.members[Math.floor(Math.random() * (virtualLab.members.length - 1))];

    chooseFromMenu({
      menuLabel: `role-for-${anyMember.name}`,
      optionText: 'Remove Member',
      menuType: 'standalone',
      optionSelector: `${DEFAULT_OPTION_SELECTOR} .text-error`,
    });

    click(getButton('Confirm'));

    screen.getByTestId('Saving changes');
    expect(onDeleteMember).toHaveBeenCalled();
  });

  test('Admins cannot leave virtual lab if they are the only admin', () => {
    const teamWithOneAdmin: VirtualLabMember[] = [
      { name: 'User1', email: 'a1@b.c', role: 'user' },
      { name: 'User2', email: 'a2@b.c', role: 'user' },
      { name: 'Admin1', email: 'a3@b.c', role: 'admin' },
    ];
    renderComponentWithLab('Mock Lab', true, { members: teamWithOneAdmin });

    chooseFromMenu({
      menuLabel: `role-for-Admin1`,
      optionText: 'Remove Member',
      menuType: 'standalone',
      optionSelector: `${DEFAULT_OPTION_SELECTOR} .text-error`,
    });

    screen.getByText(LAST_ADMIN_LEAVING_ERROR_MESSAGE);
    click(getButton('Ok'));

    expect(screen.queryByTestId('Saving changes')).not.toBeInTheDocument();
    expect(onDeleteMember).not.toHaveBeenCalled();
  });

  test('Admins cannot switch role if they are the only admin', () => {
    const teamWithOneAdmin: VirtualLabMember[] = [
      { name: 'User1', email: 'a1@b.c', role: 'user' },
      { name: 'User2', email: 'a2@b.c', role: 'user' },
      { name: 'Admin1', email: 'a3@b.c', role: 'admin' },
    ];
    renderComponentWithLab('Mock Lab', true, { members: teamWithOneAdmin });

    chooseFromMenu({
      menuLabel: `role-for-Admin1`,
      optionText: 'Member',
      menuType: 'standalone',
    });

    screen.getByText(LAST_ADMIN_LEAVING_ERROR_MESSAGE);
    click(getButton('Ok'));

    expect(screen.queryByTestId('Saving changes')).not.toBeInTheDocument();
    expect(onDeleteMember).not.toHaveBeenCalled();
  });

  test('Admins can switch role if they are not the only admin', () => {
    const teamWithOneAdmin: VirtualLabMember[] = [
      { name: 'User1', email: 'a1@b.c', role: 'user' },
      { name: 'Admin1', email: 'a3@b.c', role: 'admin' },
      { name: 'User2', email: 'a2@b.c', role: 'user' },
      { name: 'Admin2', email: 'a4@b.c', role: 'admin' },
    ];
    renderComponentWithLab('Mock Lab', true, { members: teamWithOneAdmin });

    chooseFromMenu({
      menuLabel: `role-for-Admin1`,
      optionText: 'Member',
      menuType: 'standalone',
    });

    screen.getByTestId('Saving changes');
    expect(onChangeRole).toHaveBeenCalledTimes(1);
  });

  const currentlySelectedValue = (menuLabel: string) => {
    const menuContainer = screen.getAllByLabelText(menuLabel)[0];
    const selectedValue = menuContainer.querySelector('.ant-select-selection-item');
    return selectedValue;
  };

  const chooseFromMenu = ({
    menuLabel,
    optionText,
    menuType,
    optionSelector,
  }: {
    menuLabel: string;
    optionText: string;
    menuType?: 'form-menu' | 'standalone';
    optionSelector?: string;
  }) => {
    if (menuType === 'standalone') {
      click(screen.getAllByLabelText(menuLabel)[1]);
    } else {
      click(screen.getByLabelText(menuLabel));
    }
    click(screen.getByText(optionText, { selector: optionSelector ?? DEFAULT_OPTION_SELECTOR }));
  };

  const DEFAULT_OPTION_SELECTOR = 'div.ant-select-item-option-content';

  const click = (element: HTMLElement) => {
    act(() => {
      fireEvent.click(element);
      fireEvent.focus(element);
      fireEvent.mouseDown(element);
    });
  };

  const renderComponentWithLab = (
    name: string,
    adminMode?: boolean,
    extra?: Partial<VirtualLab>
  ) => {
    const virtualLab = createMockVirtualLab(name, extra);

    const currentUser = adminMode
      ? virtualLab.members.find((m) => m.role === 'admin')!
      : virtualLab.members.find((m) => m.role === 'user')!;
    expect(currentUser).toBeTruthy();

    const sessionUser: Session['user'] = {
      username: currentUser.email,
      email: currentUser.email,
      name: currentUser.name,
    };
    render(MembersPanelProvider(virtualLab, sessionUser, adminMode));

    return { virtualLab, currentUser };
  };

  const HydrateAtoms = ({ initialValues, children }: any) => {
    useHydrateAtoms(initialValues);
    return children;
  };

  function TestProvider({ initialValues, children }: any) {
    return (
      <Provider>
        <HydrateAtoms initialValues={initialValues}>{children}</HydrateAtoms>
      </Provider>
    );
  }

  function MembersPanelProvider(
    { members }: VirtualLab,
    currentUser: Session['user'],
    adminMode?: boolean
  ) {
    return (
      <TestProvider initialValues={[[sessionAtom, { accessToken: 'abc' }]]}>
        <MembersPanel
          currentUser={currentUser}
          members={members}
          userIsAdmin={!!adminMode}
          onAddMember={onAddMember}
          onChangeRole={onChangeRole}
          onRemoveMember={onDeleteMember}
        />
      </TestProvider>
    );
  }
});
