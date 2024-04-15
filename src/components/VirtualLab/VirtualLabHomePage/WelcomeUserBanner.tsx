'use client';

import { CloseOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { basePath } from '@/config';
import Styles from '../VirtualLabBanner/virtual-lab-banner.module.css';

export default function WelcomeUserBanner({ title }: { title: string }) {
  const { data } = useSession();
  const params = useSearchParams();
  const userName = data?.user.name ?? data?.user.username ?? data?.user.email ?? '';
  const [show, setShow] = useState<boolean>(!!params.get('invite_accepted'));
  return (
    show && (
      <div className="relative mt-10 flex bg-gradient-to-r from-[#345D36] to-[#6DC371] p-8">
        <div
          className={Styles.bannerImg}
          style={{
            backgroundImage: `url(${basePath}/images/virtual-lab/obp_hippocampus_original.png)`,
          }}
        />
        <div>
          <p>You are now part of the {title}!</p>
          <h4 className="text-xl font-bold">Welcome {userName}</h4>
        </div>
        <Button
          icon={<CloseOutlined className="text-primary-8" />}
          onClick={() => setShow(false)}
          ghost
          className="absolute right-4 top-4 border-none"
        />
      </div>
    )
  );
}
