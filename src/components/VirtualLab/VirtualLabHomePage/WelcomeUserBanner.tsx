'use client';

import { CloseOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Confetti, { ConfettiConfig } from 'react-dom-confetti';

import { basePath } from '@/config';
import Styles from './home-page.module.css';

const config: ConfettiConfig = {
  angle: 90,
  spread: 360,
  startVelocity: 60,
  elementCount: 200,
  dragFriction: 0.12,
  duration: 10000,
  stagger: 0,
  colors: ['#a864fd', '#29cdff', '#78ff44', '#ff718d', '#fdff6a'],
};

export default function WelcomeUserBanner({ title }: { title: string }) {
  const { data } = useSession();
  const params = useSearchParams();
  const userName = data?.user.name ?? data?.user.username ?? data?.user.email ?? '';

  const [show, setShow] = useState<boolean>(!!params.get('invite_accepted'));
  const [explode, setExplode] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (bannerRef.current) {
      setExplode(true);
    }
  }, [bannerRef]);

  return (
    show && (
      <div>
        <div className="flex max-h-screen w-full justify-center">
          <Confetti active={explode} config={config} />
        </div>
        <div
          className="relative mt-10 flex bg-gradient-to-r from-[#345D36] to-[#6DC371] p-8"
          ref={bannerRef}
        >
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
      </div>
    )
  );
}
