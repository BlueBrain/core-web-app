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
      <h1 className="font-bold text-5xl leading-12 uppercase mb-5">
        Open <br />
        Brain <br />
        Platform
      </h1>

      <div className="border border-primary-7 p-5 pb-3 min-w-[220px]">
        <div>
          <UserOutlined className="text-primary-4 mr-2" />
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
            <Link href="/account" className="text-primary-5 p-0">
              Account
            </Link>
            <Button type="text" className="text-primary-5 py-0 px-2" onClick={logout}>
              Log out
            </Button>
          </ConfigProvider>
        </div>
      </div>
    </div>
  );
}
