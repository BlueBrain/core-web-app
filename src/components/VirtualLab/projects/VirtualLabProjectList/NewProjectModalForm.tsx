import { useSession } from 'next-auth/react';
import { Button, ConfigProvider, Form, Input, Select } from 'antd';
import { useState, useEffect, useReducer } from 'react';
import { useAtom } from 'jotai';
import { MailOutlined } from '@ant-design/icons';
import VirtualLabMemberIcon from '../../VirtualLabMemberIcon';
import { InvitedMember, selectedMembersAtom, Form as FormT } from './shared';
import NewProjectModalInputs from './NewProjectModalInputs';
import { VirtualLabMember } from '@/types/virtual-lab/members';

const { Option } = Select;

export default function NewProjectModalForm({
  form,
  members,
}: {
  form: FormT;
  members?: VirtualLabMember[];
}) {
  const session = useSession();
  const [showInvitation, setShowInvitation] = useState(false);
  const [newInvite, setNewInvite] = useState<InvitedMember>({ email: '', role: 'admin' });

  const [invitedMembers, dispatch] = useReducer(
    (
      prevMembers: InvitedMember[],
      { type, payload }: { type: 'add' | 'remove'; payload: InvitedMember }
    ): InvitedMember[] => {
      if (type === 'add') return [...prevMembers, payload];
      if (type === 'remove') return prevMembers.filter((m) => m.email !== payload.email);
      return prevMembers;
    },
    []
  );
  const [selectedMembers, setSelectedMembers] = useAtom(selectedMembersAtom);

  useEffect(() => {
    setSelectedMembers(invitedMembers);
  }, [invitedMembers, setSelectedMembers]);

  return (
    <Form form={form} layout="vertical" style={{ paddingBlockStart: 40 }}>
      <ConfigProvider
        theme={{
          components: {
            Input: {
              activeBg: 'transparent',
              addonBg: 'transparent',
              borderRadius: 0,
              colorBgContainer: 'transparent',
              colorBorder: 'transparent',
              colorText: '#003A8C',
              colorTextDisabled: '#fff',
              colorTextPlaceholder: '#8C8C8C',
              fontSizeLG: 16,
              hoverBorderColor: 'transparent',
              paddingInline: 0,
              paddingBlock: 0,
            },
            Form: {
              itemMarginBottom: 40,
              verticalLabelMargin: 0,
              verticalLabelPadding: 0,
            },
            Select: {
              colorText: 'text-primary-8',
              colorBorder: 'transparent',
            },
          },
        }}
      >
        <NewProjectModalInputs />
        {members?.map((member) => (
          <div key={member.id} className="text-primary-8">
            <VirtualLabMemberIcon
              memberRole={member.role}
              firstName={member.first_name}
              lastName={member.last_name}
            />
            <div key={member.id} className="ml-5 inline-block font-bold">
              {member.name}
            </div>
            <Select
              style={{ width: 200, top: 7 }}
              defaultValue={member.role}
              onChange={(v) => {
                const m = members.find((m_) => m_.id === v);
                if (m) setSelectedMembers([...selectedMembers, { ...member, role: v }]);
              }}
              disabled={member.email === session.data?.user?.email}
              className="float-right inline-block"
            >
              <Option value="admin">Admin</Option>
              <Option value="member">Member</Option>
            </Select>
          </div>
        ))}

        {invitedMembers.map((member) => (
          <div key={member.email} className="mt-1 flex items-center text-primary-8">
            <div className="inline-flex h-12 w-12 items-center justify-center bg-primary-8">
              <MailOutlined className="text-white" />
            </div>
            <div key={member.email} className="ml-5 inline-block font-bold">
              {member.email}
            </div>
            <div className="flex-grow" />
            <button
              type="button"
              className="float-right mr-3 inline-block"
              onClick={() => {
                dispatch({ type: 'remove', payload: member });
              }}
            >
              Cancel invitation
            </button>
          </div>
        ))}

        {showInvitation && (
          <div className="mt-3 flex w-full items-center">
            <div className="inline-flex h-12 w-12 items-center justify-center bg-gray-100">
              <MailOutlined />
            </div>
            <div className="ml-5 inline-block">
              <span className="mr-2 inline-block font-bold text-primary-8">Invitation to:</span>
              <div className="inline-block">
                <Input
                  placeholder="Enter email address"
                  value={newInvite?.email}
                  onChange={(v) => setNewInvite({ ...newInvite, email: v.currentTarget.value })}
                />
              </div>
            </div>
            <div className="grow" />
            <div className="flex items-center">
              <div>As</div>
              <Select
                defaultValue="admin"
                onChange={(v: 'admin' | 'member') => setNewInvite({ ...newInvite, role: v })}
              >
                <Option value="admin">Admin</Option>
                <Option value="member">Member</Option>
              </Select>
            </div>
            <div className="flex">
              {!!newInvite.email && (
                <button
                  type="button"
                  className="text-sm text-primary-7"
                  onClick={() => {
                    dispatch({ type: 'add', payload: newInvite });
                    setNewInvite({ email: '', role: 'admin' });
                    setShowInvitation(false);
                  }}
                >
                  Confirm
                </button>
              )}
              <button
                type="button"
                className="ml-3 text-sm text-primary-7"
                onClick={() => {
                  setNewInvite({ email: '', role: 'admin' });
                  setShowInvitation(false);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <Button
          className="mt-5 flex h-12 items-center rounded-none bg-white font-bold text-primary-8"
          onClick={() => setShowInvitation(true)}
          // disabling it for SfN
          disabled
        >
          <div className="relative -top-1">
            Add Member
            <span className="relative top-0.5 ml-3 inline-block text-3xl font-normal text-gray-400 ">
              +
            </span>
          </div>
        </Button>
      </ConfigProvider>
    </Form>
  );
}
