'use client';

import { Button, ConfigProvider, Form, Input, Select } from 'antd';
import { NewMember, VirtualLabMember } from '@/services/virtual-lab/types';
import { VALID_EMAIL_REGEXP } from '@/util/utils';

export default function AddVirtualLabMember({
  onSendInvite,
}: {
  onSendInvite: (newMember: NewMember) => void;
}) {
  const [form] = Form.useForm<{ email: string; userRole: VirtualLabMember['role'] }>();

  const onSendInviteClick = () => {
    form
      .validateFields()
      .then(() => {
        const email = form.getFieldValue('email');
        const role = form.getFieldValue('role');
        onSendInvite({ email, role });
      })
      .catch(() => {});
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorBgContainer: 'transparent',
          colorBgContainerDisabled: 'transparent',
          colorBorder: 'transparent',
          colorText: '#003A8C',
          colorTextPlaceholder: '#003A8C',
          colorTextDisabled: '#003A8C',
          controlPaddingHorizontal: 0,
          lineWidth: 0,
        },
        components: {
          Form: {
            verticalLabelPadding: 0,
            labelColor: '#BFBFBF',
          },
          Input: {
            paddingInline: 0,
            paddingBlock: 1,
            hoverBorderColor: 'transparent',
            addonBg: 'transparent',
          },
          Button: {
            defaultShadow: 'none',
            borderRadius: 0,
          },
        },
      }}
    >
      <Form
        form={form}
        requiredMark={false}
        name="invite-user-form"
        className="flex justify-between"
      >
        <div className="flex">
          <div className="rounded-full w-8 h-8 text-center text-white flex items-center justify-center bg-gray-200 mr-3">
            -
          </div>
          <Form.Item
            label="Email"
            rules={[
              {
                required: true,
                pattern: VALID_EMAIL_REGEXP,
                message: 'Entered value is not the correct email format',
              },
            ]}
            name="email"
            validateTrigger="onBlur"
          >
            <Input
              placeholder="Enter email address..."
              type="email"
              className="placeholder:text-primary-8 border-b border-b-primary-8"
            />
          </Form.Item>
        </div>

        <div className="flex">
          <Form.Item label="Role" name="role" rules={[{ required: true }]} validateFirst>
            <Select
              options={[
                {
                  label: 'Administrator',
                  value: 'admin',
                },
                {
                  label: 'Member',
                  value: 'user',
                },
              ]}
              aria-label="role"
              placeholder="-"
              className="placeholder:text-primary-8"
              style={{ width: 'fit-content' }}
              popupMatchSelectWidth={false}
              aria-required
            />
          </Form.Item>
          <Button onClick={() => onSendInviteClick()} className="border border-primary-8">
            Send Invitation
          </Button>
        </div>
      </Form>
    </ConfigProvider>
  );
}
