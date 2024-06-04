'use client';

import { signIn } from 'next-auth/react';
import { Button, ConfigProvider } from 'antd';
import { GitlabFilled, GithubOutlined, GoogleOutlined } from '@ant-design/icons';
import { useSearchParams } from 'next/navigation';
import { OBPLogo } from '@/components/Entrypoint/segments/Splash';
import { basePath } from '@/config';

export default function Page() {
  const searchParams = useSearchParams();
  const redirectURL = searchParams.get('callbackUrl');

  return (
    <>
      <OBPLogo className="absolute left-10 top-10" color="text-white" />
      <div className="flex flex-col gap-8">
        <div className="text-2xl font-bold text-white">Log in to with:</div>
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
              onClick={() => signIn('keycloak', { callbackUrl: redirectURL || basePath })}
              icon={<GithubOutlined style={{ fontSize: 54 }} />}
              style={{ width: 124, height: 124 }}
            />
            <div className="flex h-[124px] w-[124px] items-center justify-center rounded-full bg-white">
              <GitlabFilled className="text-6xl" />
            </div>
          </div>
        </ConfigProvider>
      </div>
    </>
  );
}
