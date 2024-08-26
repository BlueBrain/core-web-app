import { useState } from 'react';
import { Button, ConfigProvider } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { VirtualLabUsersHorizontalList } from '../VirtualLabProjectHomePage';
import { Detail } from './Detail';
import { Footer } from './Footer';
import { addMember, removeMember } from './utils';
import { useCurrentProject, useInviteHandler } from './hooks';
import { Member } from './types';
import { NewMember } from './NewMember';
import { IconMail } from './IconMail';
import { RoleCombo } from './RoleCombo';
import { useParamProjectId, useParamVirtualLabId } from '@/util/params';

interface InviteProjectMemberProps {
  members: Member[];
  onChange(members: Member[]): void;
  onClose(this: void): void;
}

export function InviteProjectMember({ onClose, members, onChange }: InviteProjectMemberProps) {
  const virtualLabId = useParamVirtualLabId();
  const projectId = useParamProjectId();
  const project = useCurrentProject();
  const description = project?.description;
  const [editMode, setEditMode] = useState(false);
  const { loading, handleInvite } = useInviteHandler(members, onClose);
  return (
    <ConfigProvider
      theme={{
        components: {
          Select: {
            colorBorder: 'rgba(255, 255, 255, 0)',
            colorText: '#002766',
          },
          Form: {
            labelColor: '#003A8C',
          },
          Input: {
            colorText: '#003A8C',
          },
        },
      }}
    >
      <div>
        <Detail title="PROJECT NAME" bold>
          {project?.name}
        </Detail>
        {description && description.trim().length > 0 && (
          <Detail title="DESCRIPTION">{description}</Detail>
        )}
        <div className="mb-8">
          <VirtualLabUsersHorizontalList
            virtualLabId={virtualLabId ?? ''}
            projectId={projectId ?? ''}
          />
        </div>
        <PendingInvitations members={members} onChange={onChange} />
        {editMode ? (
          <NewMember
            onCancel={() => setEditMode(false)}
            onOK={(member: Member) => {
              setEditMode(false);
              onChange(addMember(members, member));
            }}
          />
        ) : (
          <AddMemberButton onClick={() => setEditMode(true)} />
        )}
        <Footer loading={loading} members={members} onClose={onClose} onInvite={handleInvite} />
      </div>
    </ConfigProvider>
  );
}

function AddMemberButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      type="primary"
      htmlType="submit"
      onClick={onClick}
      className="flex w-[200px] flex-row items-center justify-between rounded-none border-neutral-2 bg-transparent py-6 text-primary-8"
    >
      <span>Add member</span>
      <PlusOutlined />
    </Button>
  );
}

function PendingInvitations({
  members,
  onChange,
}: {
  members: Member[];
  onChange: (members: Member[]) => void;
}) {
  return (
    <div className="mb-8">
      {members.map((member) => (
        <div
          key={member.email}
          className="mb-4 flex w-full flex-wrap items-center gap-4 whitespace-nowrap font-normal text-dark"
        >
          <IconMail />
          <b className="flex-1">{member.email}</b>
          <RoleCombo
            role={member.role}
            onChange={(role) =>
              onChange(
                addMember(members, {
                  email: member.email,
                  role,
                })
              )
            }
          />
          <button
            type="button"
            onClick={() => onChange(removeMember(members, member))}
            aria-label="Cancel Invitation"
          >
            Cancel Invitation
          </button>
        </div>
      ))}
    </div>
  );
}
