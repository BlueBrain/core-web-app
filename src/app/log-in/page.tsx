'use client';

import { signIn } from 'next-auth/react';
import { Button, ConfigProvider } from 'antd';
import { GitlabFilled, GithubOutlined, GoogleOutlined } from '@ant-design/icons';

import { basePath } from '@/config';

export default function Page() {
  return (
    <div className="flex flex-col gap-8">
      <div className="text-2xl font-bold text-white">Login to your virtual lab</div>
      <ConfigProvider
        theme={{
          components: {
            Button: {
              colorPrimaryHover: '#1890FF',
              contentFontSize: 16,
            },
          },
        }}
      >
        <div className="flex items-center gap-8">
          <div className="flex h-[124px] w-[124px] items-center justify-center rounded-full bg-white">
            <GoogleOutlined className="text-6xl" />
          </div>
          <Button
            className="rounded-full"
            onClick={() => signIn('keycloak', { callbackUrl: `${basePath}/virtual-lab` })}
            icon={<GithubOutlined style={{ fontSize: 54 }} />}
            style={{ width: 124, height: 124 }}
          />
          <div className="flex h-[124px] w-[124px] items-center justify-center rounded-full bg-white">
            <GitlabFilled className="text-6xl" />
          </div>
        </div>
        <hr className="border-primary-7" />
        <div className="flex items-center justify-between">
          <div className="text-2xl font-normal text-white">Don&apos;t have a lab yet?</div>
          <Button className="rounded-none" ghost>
            Sign-up
          </Button>
        </div>
      </ConfigProvider>
    </div>
  );
}
