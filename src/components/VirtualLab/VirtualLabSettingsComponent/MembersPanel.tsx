'use client';

import { formatDistance } from 'date-fns';
import { Button, ConfigProvider, Modal, Select, Spin } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { ReactNode, useState } from 'react';

import { Session } from 'next-auth';
import { Avatar } from '../create/sub-components/Avatar';
import AddVirtualLabMember from './AddVirtualLabMember';
import useNotification from '@/hooks/notifications';
import { NewMember, VirtualLabMember } from '@/types/virtual-lab/lab';

type Props = {
  members: VirtualLabMember[];
  userIsAdmin: boolean;
  currentUser: Session['user'];

  onAddMember: (user: NewMember) => Promise<void>;
  onChangeRole: (user: VirtualLabMember, newRole: VirtualLabMember['role']) => Promise<void>;
  onRemoveMember: (user: VirtualLabMember) => Promise<void>;
};

type RoleOptions = {
  label: ReactNode;
  value: 'admin' | 'user' | 'delete';
  className?: string;
};

export const LAST_ADMIN_LEAVING_ERROR_MESSAGE =
  'This operation is not possible at the moment because a virtual lab should have at least 1 administrator.';

export default function MembersPanel({
  members,
  userIsAdmin,
  currentUser,

  onAddMember,
  onRemoveMember,
  onChangeRole,
}: Props) {
  const [showAddMember, setShowAddMember] = useState(false);
  const [error, setError] = useState(false);
  const [savingChanges, setSavingChanges] = useState(false);
  const [modal, contextHolder] = Modal.useModal();
  const notify = useNotification();

  const onAddMemberClick = (newMember: NewMember) => {
    setSavingChanges(true);

    onAddMember(newMember)
      .then(() => {
        notify.success('Invitation sent to user');
      })
      .catch(() => {
        notify.error('There was an error when sending invite to user');
      })
      .finally(() => {
        setShowAddMember(false);
        setSavingChanges(false);
      });
  };

  const changeRoleForMember = (member: VirtualLabMember, role: VirtualLabMember['role']): void => {
    setSavingChanges(true);
    onChangeRole(member, role)
      .then(() => {
        setError(false);
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        setSavingChanges(false);
      });
  };

  const removeMember = (member: VirtualLabMember): void => {
    setSavingChanges(true);
    onRemoveMember(member)
      .then(() => {
        setError(false);
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        setSavingChanges(false);
      });
  };

  const adminOptions: RoleOptions[] = [
    {
      label: 'Administrator',
      value: 'admin',
    },
    {
      label: 'Member',
      value: 'user',
    },
    {
      label: <span className="text-error">Remove Member</span>,
      value: 'delete',
    },
  ];
  const memberOptions: RoleOptions[] = [
    {
      label: 'Member',
      value: 'user',
    },
    {
      label: <span className="text-error">Leave virtual lab</span>,
      value: 'delete',
    },
  ];

  const onRemoveMemberSelected = (member: VirtualLabMember) => {
    const isLastAdminLeaving =
      members.filter((m) => m.role === 'admin').length === 1 && member.role === 'admin';

    if (isLastAdminLeaving) {
      modal.error({
        content: (
          <div>
            {LAST_ADMIN_LEAVING_ERROR_MESSAGE}
            <p className="font-bold">Please add another administrator to the lab before leaving.</p>
          </div>
        ),
      });
      return;
    }

    const thisModal = modal.confirm({
      content: (
        <div className="mb-4 text-center">
          {member.email === currentUser.email
            ? 'Are you sure you want to leave this virtual lab?'
            : `Are you sure you want to remove user ${member.name} from the virtual lab?`}
        </div>
      ),
      icon: null,
      okButtonProps: { className: 'hidden' },
      cancelButtonProps: { className: 'hidden' },
      footer: (
        <div className="justify flex flex-col items-center">
          <Button onClick={() => removeMember(member)}>Confirm</Button>
          <Button onClick={() => thisModal.destroy()} className="border-none">
            Cancel
          </Button>
        </div>
      ),
    });
  };

  const onNewRoleSelected = (member: VirtualLabMember, newRole: 'user' | 'admin') => {
    const lastAdminChangingRole =
      members.filter((m) => m.role === 'admin').length === 1 &&
      member.role === 'admin' &&
      newRole !== 'admin';
    if (lastAdminChangingRole) {
      modal.error({
        content: (
          <div>
            {LAST_ADMIN_LEAVING_ERROR_MESSAGE}
            <p className="font-bold">
              Please add another administrator to the lab before switching your user role.
            </p>
          </div>
        ),
      });
      return;
    }
    changeRoleForMember(member, newRole);
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Select: {
            optionSelectedFontWeight: 700,
          },
          Modal: {
            borderRadius: 0,
            colorBorder: '#D9D9D9',
            paddingContentHorizontal: 16,
          },
          Button: {
            defaultShadow: '0',
          },
        },
        token: {
          borderRadius: 0,
          borderRadiusSM: 0,
          borderRadiusLG: 0,
        },
      }}
    >
      {userIsAdmin && !showAddMember && (
        <div className="flex justify-end">
          <Button
            icon={
              <div className="border border-primary-8">
                <PlusOutlined className="text-xs" />
              </div>
            }
            onClick={() => setShowAddMember(true)}
            className="font-bold"
          >
            Add new member
          </Button>
        </div>
      )}

      {showAddMember && <AddVirtualLabMember onSendInvite={onAddMemberClick} />}

      {error && <p className="text-error">There was an error when updating members.</p>}

      {savingChanges ? (
        <Spin data-testid="Saving changes" className="m-auto w-full" />
      ) : (
        <ul>
          {members.map((member) => (
            <li
              className="my-5 flex justify-between"
              data-testid="virtual-lab-member"
              key={member.email}
            >
              <div className="flex items-center">
                <Avatar email={member.email} />
                <div className="mx-3 font-bold" data-testid="virtual-lab-member">
                  {member.name}
                </div>
                <span className="text-xs font-light text-gray-400">
                  Active{' '}
                  {member.lastActive
                    ? formatDistance(new Date(member.lastActive), new Date(), { addSuffix: true })
                    : 'unknown'}
                </span>
              </div>
              <div className="font-bold">
                {contextHolder}
                {userIsAdmin || member.email === currentUser.email ? (
                  <Select
                    bordered={false}
                    placeholder={member.role}
                    value={member.role}
                    aria-label={`role-for-${member.name}`}
                    style={{ width: 'fit-content' }}
                    options={userIsAdmin ? adminOptions : memberOptions}
                    popupMatchSelectWidth={false}
                    onSelect={(value: RoleOptions['value']) => {
                      if (value === 'delete') {
                        onRemoveMemberSelected(member);
                      } else if (value !== member.role) {
                        onNewRoleSelected(member, value);
                      }
                    }}
                  />
                ) : (
                  <span className="font-normal">
                    {
                      adminOptions.find((labelAndValue) => labelAndValue.value === member.role)!
                        .label
                    }
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </ConfigProvider>
  );
}
