import { Dispatch, SetStateAction, useState } from 'react';
import { Button, ConfigProvider, Form, Input, Select } from 'antd';
import { MailOutlined, PlusOutlined } from '@ant-design/icons';
import { useSession } from 'next-auth/react';

import VirtualLabMemberIcon from '../VirtualLabMemberIcon';
import { VirtualLabWithOptionalId } from './types';

import { Role } from '@/types/virtual-lab/members';

type MembersFormProps = {
  loading: boolean;
  currentVirtualLab: VirtualLabWithOptionalId;
  setVirtualLabFn: Dispatch<SetStateAction<VirtualLabWithOptionalId>>;
  closeModalFn: () => void;
  createVirtualLabFn: () => void;
};

function NewMemberForm({
  setVirtualLabFn,
}: {
  setVirtualLabFn: Dispatch<SetStateAction<VirtualLabWithOptionalId>>;
}) {
  const [form] = Form.useForm();
  const [isFormValid, setIsFormValid] = useState(false);
  const onValuesChange = () => {
    form
      .validateFields()
      .then(() => {
        setIsFormValid(true);
      })
      .catch((error) => {
        if (error.errorFields.length > 0) {
          setIsFormValid(false);
        } else {
          setIsFormValid(true);
        }
      });
  };

  const onFinish = (values: { email: string; role: Role }) => {
    setVirtualLabFn((currentVl) => ({
      ...currentVl,
      include_members: [
        ...(currentVl.include_members || []),
        { email: values.email, role: values.role },
      ],
    }));
  };

  return (
    <Form
      form={form}
      className="my-5"
      name="member_form"
      onFinish={onFinish}
      onValuesChange={onValuesChange}
      initialValues={{
        email: '',
        role: 'member',
      }}
      requiredMark={false}
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-row justify-between">
          <div className="flex flex-row items-center gap-4">
            <div className="inline-flex h-12 w-12 items-center justify-center bg-neutral-2">
              <span className="text-2xl font-bold text-neutral-4">
                <MailOutlined />
              </span>
            </div>

            <Form.Item
              name="email"
              className="mb-0"
              label="Invitation to:"
              rules={[
                {
                  type: 'email',
                  required: true,
                  message: 'Please enter a valid email address',
                },
              ]}
            >
              <Input className="border-transparent" placeholder="Enter email address" />
            </Form.Item>
          </div>
          <Form.Item label="As:" name="role" className="mb-0 flex items-center">
            <Select placeholder="Choose role...">
              <Select.Option value="admin">Administrator</Select.Option>
              <Select.Option value="member">Member</Select.Option>
            </Select>
          </Form.Item>
        </div>
        <Button
          type="primary"
          htmlType="submit"
          disabled={!isFormValid}
          className="flex w-[200px] flex-row items-center justify-between rounded-none border-neutral-2 bg-transparent py-6 text-primary-8"
        >
          <span>Add member</span>
          <PlusOutlined />
        </Button>
      </div>
    </Form>
  );
}

function NonInvitedMember({ label }: { label: string }) {
  return (
    <div className="flex flex-row items-center justify-between gap-4">
      <div className="flex flex-row items-center gap-4">
        <VirtualLabMemberIcon
          firstName={label.split(' ')[0]}
          lastName={label.split(' ')[1]}
          memberRole="admin"
        />
        <span className="font-bold">{label}</span>
      </div>
      <div className="flex flex-row items-center gap-4">
        <span className="font-bold">Administrator</span>
      </div>
    </div>
  );
}

function InvitedMember({
  label,
  role,
  setVirtualLabFn,
}: {
  label: string;
  role: Role;
  setVirtualLabFn: Dispatch<SetStateAction<VirtualLabWithOptionalId>>;
}) {
  const removeMember = () => {
    setVirtualLabFn((currentVl) => ({
      ...currentVl,
      include_members: (currentVl.include_members || []).filter((member) => member.email !== label),
    }));
  };

  return (
    <div className="flex flex-row items-center justify-between gap-4">
      <div className="flex flex-row items-center gap-4">
        <div className="inline-flex h-12 w-12 items-center justify-center bg-primary-8">
          <span className="text-2xl font-bold text-white">
            <MailOutlined />
          </span>
        </div>
        <span className="font-bold">{label}</span>
      </div>
      <div className="flex flex-row items-center gap-4">
        <span className="font-bold">{role === 'admin' ? 'Administrator' : 'Member'}</span>
        <Button className="text-primary-8" ghost type="text" onClick={removeMember}>
          cancel invitation
        </Button>
      </div>
    </div>
  );
}

export default function MembersForm({
  loading,
  currentVirtualLab,
  setVirtualLabFn,
  closeModalFn,
  createVirtualLabFn,
}: MembersFormProps) {
  const { data } = useSession();

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
      <div className="my-10 flex w-full flex-col gap-4 text-primary-8">
        {data?.user.name && <NonInvitedMember label={data.user.name} />}
        {currentVirtualLab.include_members?.map((member) => (
          <InvitedMember
            key={member.email}
            label={member.email}
            role={member.role}
            setVirtualLabFn={setVirtualLabFn}
          />
        ))}
        <NewMemberForm setVirtualLabFn={setVirtualLabFn} />
      </div>
      <div className="flex flex-row justify-end gap-2">
        <Button type="text" className="min-w-36 text-primary-8" onClick={() => closeModalFn()}>
          Cancel
        </Button>
        <Button
          htmlType="submit"
          className="min-w-36 rounded-none border-primary-8 bg-primary-8 text-white"
          disabled={loading}
          onClick={createVirtualLabFn}
        >
          {loading ? 'Creating...' : 'Create'}
        </Button>
      </div>
    </ConfigProvider>
  );
}
