'use client';

import { ArrowRightOutlined } from '@ant-design/icons';
import { Button, ConfigProvider, Form, Input } from 'antd';

export default function VirtualLabLoginPage() {
  const [form] = Form.useForm();

  return (
    <div className="h-full w-full">
      <div className="flex h-full items-center justify-center">
        <div className="flex h-[600px] w-[450px] flex-col gap-5">
          <h3 className="text-xl font-bold">Virtual labs</h3>
          <div className="text-md">I already have an account</div>
          <Form
            form={form}
            initialValues={{ email: undefined, password: undefined }}
            onFinish={() => {}}
          >
            <ConfigProvider
              theme={{
                components: {
                  Input: {
                    colorBgContainer: 'transparent',
                    activeBg: 'transparent',
                    colorText: '#1890FF',
                    colorTextPlaceholder: '#1890FF',
                    activeBorderColor: '#002766',
                    hoverBorderColor: 'transparent',
                    colorBorder: 'transparent',
                    controlHeight: 50,
                    borderRadius: 0,
                  },
                },
              }}
            >
              <Form.Item name="email">
                <Input placeholder="Email" style={{ borderBottom: 'solid white 1px' }} />
              </Form.Item>
              <Form.Item name="password">
                <Input placeholder="Password" style={{ borderBottom: 'solid white 1px' }} />
              </Form.Item>
            </ConfigProvider>
            <Form.Item>
              <div className="flex items-center justify-end gap-2">
                <Button className="border-none bg-transparent text-xl text-neutral-1 shadow-none hover:bg-transparent">
                  Cancel
                </Button>
                <Button
                  htmlType="submit"
                  className="flex w-[200px] items-center justify-between gap-2 rounded-none border border-[1px] border-primary-6 bg-transparent p-5 text-lg font-semibold text-neutral-1 shadow-none hover:bg-transparent"
                >
                  <div>Login</div>
                  <ArrowRightOutlined />
                </Button>
              </div>
            </Form.Item>
            <hr className="my-12 border-t border-primary-6" />
            <div className="flex items-center justify-between gap-2">
              <div className="text-2xl text-neutral-1">Don&apos;t have a lab yet?</div>
              <Button
                htmlType="submit"
                className="flex w-[200px] items-center justify-between gap-2 rounded-none border border-[1px] border-primary-6 bg-transparent p-5 text-lg font-semibold text-neutral-1 shadow-none hover:bg-transparent"
              >
                <div>Singup</div>
                <ArrowRightOutlined />
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
