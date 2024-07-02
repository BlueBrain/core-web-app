'use client';

import { CloseOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Realistic from 'react-canvas-confetti/dist/presets/realistic';
import { basePath } from '@/config';
import styles from '../VirtualLabBanner/virtual-lab-banner.module.css';
import { useAtomValue } from 'jotai';
import { getAtom } from '@/state/state';

import { VirtualLab } from '@/types/virtual-lab/lab';

export default function WelcomeUserBanner() {
  const { data } = useSession();
  const params = useSearchParams();
  const userName = data?.user.name ?? data?.user.username ?? data?.user.email ?? '';
  const [show, setShow] = useState<boolean>(!!params.get('invite_accepted'));
  const [explodeConfetti, setExplodeConfetti] = useState(false);
  const title = useAtomValue(getAtom<VirtualLab>('vlab'))?.name;

  useEffect(() => {
    setExplodeConfetti(true);
  }, []);

  return (
    show && (
      <>
        <div className="absolute left-0 top-0 z-10 h-full w-full">
          {explodeConfetti && (
            <Realistic
              autorun={{ speed: 0.3, duration: 3 }}
              decorateOptions={(options) => ({ ...options, origin: { y: 0.2 }, spread: 270 })}
            />
          )}
        </div>
        <div className="relative mt-10 flex bg-gradient-to-r from-[#345D36] to-[#6DC371] p-8">
          <div
            className={styles.bannerImg}
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
      </>
    )
  );
}
