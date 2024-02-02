'use client';

import { useMemo, useState } from 'react';
import { Button } from 'antd';
import { PlusOutlined, MinusOutlined, RightOutlined, UserOutlined } from '@ant-design/icons';
import { useAtomValue } from 'jotai';
import { loadable } from 'jotai/utils';

import { configAtom } from '@/state/brain-model-config';
import { HomeIcon } from '@/components/icons';
import Link from '@/components/Link';
import { classNames } from '@/util/utils';
import FooterLink from '@/components/BrainConfigPanel/FooterLink';
import { campaignNameAtom, campaignDescriptionAtom } from '@/state/simulate';
import { simCampaignUserAtom } from '@/state/experiment-designer';

const configAtomLoadable = loadable(configAtom);
const campaignUserAtomLoadable = loadable(simCampaignUserAtom);

export default function ExperimentDesignerPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const simCampName = useAtomValue(campaignNameAtom);
  const simCampDescription = useAtomValue(campaignDescriptionAtom);
  const loadableConfig = useAtomValue(configAtomLoadable);
  const circuitInfo = loadableConfig.state === 'hasData' ? loadableConfig.data : null;
  const loadableCampaignUser = useAtomValue(campaignUserAtomLoadable);

  const campaignCreatorUsername = useMemo(() => {
    switch (loadableCampaignUser.state) {
      case 'hasData':
        return loadableCampaignUser.data;
      case 'loading':
        return 'Loading...';
      default:
        return 'Unknown - error fetching creator';
    }
  }, [loadableCampaignUser]);

  return (
    <div
      className={classNames('h-screen bg-primary-9 text-white', isOpen ? 'w-[300px]' : 'w-[40px]')}
    >
      {!isOpen && (
        <div className="flex flex-col items-center pt-2">
          <Button
            className="mb-2"
            type="text"
            size="small"
            icon={<PlusOutlined style={{ color: 'white' }} />}
            onClick={() => setIsOpen(true)}
          />

          <div style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>Simulate</div>

          <Link className="mt-4 text-lg text-primary-3" href="/">
            <HomeIcon />
          </Link>
        </div>
      )}

      {isOpen && (
        <div className="flex h-full flex-col overflow-y-auto p-6">
          <div className="flex items-start justify-between gap-x-2">
            <div className="overflow-hidden text-ellipsis text-3xl font-bold">{simCampName}</div>
            <Button
              type="text"
              size="small"
              icon={<MinusOutlined style={{ color: 'white' }} />}
              onClick={() => setIsOpen(false)}
            />
          </div>

          <div className="mt-3 text-primary-3">{simCampDescription}</div>

          <div className="mt-3 text-primary-3">
            <UserOutlined />
            <span className="ml-3">{campaignCreatorUsername || 'Loading...'}</span>
          </div>

          <div className="my-6">
            <div className="h-px bg-primary-5" />
          </div>

          <div className="text-primary-3">Circuit used</div>
          <div className="mt-2 font-bold">{circuitInfo?.name}</div>

          <footer className="mt-auto space-y-2">
            <FooterLink href="/">
              <span>Home</span>
              <HomeIcon />
            </FooterLink>

            <div className="my-6">
              <div className="mb-7 h-px bg-primary-5" />
            </div>

            <FooterLink className="bg-primary-8" href="/build">
              <span>Build</span>
              <RightOutlined />
            </FooterLink>

            <FooterLink className="bg-primary-8" href="/explore">
              <span>Explore</span>
              <RightOutlined />
            </FooterLink>
          </footer>
        </div>
      )}
    </div>
  );
}
