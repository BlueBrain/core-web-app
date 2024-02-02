'use client';

import { UserOutlined } from '@ant-design/icons';
import { signOut, useSession } from 'next-auth/react';
import { Button, ConfigProvider } from 'antd';

import Link from '@/components/Link';

export default function VirtualLabSidebar() {
  const { data: session } = useSession();
  const logout = () => signOut({ callbackUrl: '/' });

  return (
    <div className="w-[16vw]">
      <h1 className="leading-12 mb-5 text-5xl font-bold uppercase">
        Open <br />
        Brain <br />
        Platform
      </h1>

      <div className="min-w-[220px] border border-primary-7 p-5 pb-3">
        <div>
          <UserOutlined className="mr-2 text-primary-4" />
          <span className="font-bold">{session?.user.name}</span>
        </div>
        <div className="flex justify-between">
          <ConfigProvider
            theme={{
              components: {
                Button: {
                  textHoverBg: '#91D5FF',
                  borderRadius: 0,
                },
              },
            }}
          >
            <Link href="/account" className="p-0 text-primary-5">
              Account
            </Link>
            <Button type="text" className="px-2 py-0 text-primary-5" onClick={logout}>
              Log out
            </Button>
          </ConfigProvider>
        </div>
      </div>
    </div>
  );
}
