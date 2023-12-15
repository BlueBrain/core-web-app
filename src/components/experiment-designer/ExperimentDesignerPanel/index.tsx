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

          <Link className="text-lg text-primary-3 mt-4" href="/">
            <HomeIcon />
          </Link>
        </div>
      )}

      {isOpen && (
        <div className="h-full overflow-y-auto flex flex-col p-6">
          <div className="flex gap-x-2 justify-between items-start">
            <div className="text-3xl overflow-hidden text-ellipsis font-bold">{simCampName}</div>
            <Button
              type="text"
              size="small"
              icon={<MinusOutlined style={{ color: 'white' }} />}
              onClick={() => setIsOpen(false)}
            />
          </div>

          <div className="text-primary-3 mt-3">{simCampDescription}</div>

          <div className="text-primary-3 mt-3">
            <UserOutlined />
            <span className="ml-3">{campaignCreatorUsername || 'Loading...'}</span>
          </div>

          <div className="my-6">
            <div className="bg-primary-5 h-px" />
          </div>

          <div className="text-primary-3">Circuit used</div>
          <div className="font-bold mt-2">{circuitInfo?.name}</div>

          <footer className="space-y-2 mt-auto">
            <FooterLink href="/">
              <span>Home</span>
              <HomeIcon />
            </FooterLink>

            <div className="my-6">
              <div className="bg-primary-5 h-px mb-7" />
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
