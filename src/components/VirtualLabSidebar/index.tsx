'use client';

import { UserOutlined } from '@ant-design/icons';
import { useSession } from 'next-auth/react';
import { Button, ConfigProvider } from 'antd';

// TODO: Move this to VirtualLab components folder
export default function VirtualLabSidebar() {
  const { data: session } = useSession();

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
          {/* TODO: Add click handlers to the following button once Bilal's work is done. */}
          <ConfigProvider
            theme={{
              components: {
                Button: {
                  textHoverBg: '#91D5FF',
                },
              },
            }}
          >
            <Button type="text" className="text-primary-5 p-0">
              Account
            </Button>
            <Button type="text" className="text-primary-5 p-0">
              Signout
            </Button>
          </ConfigProvider>
        </div>
      </div>
    </div>
  );
}
