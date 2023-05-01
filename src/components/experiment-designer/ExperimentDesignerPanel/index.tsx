'use client';

import { useState } from 'react';
import { Button } from 'antd';
import { PlusOutlined, MinusOutlined, RightOutlined } from '@ant-design/icons';
import { useAtomValue } from 'jotai';
import { loadable } from 'jotai/utils';

import { configAtom } from '@/state/brain-model-config';
import { HomeIcon } from '@/components/icons';
import Link from '@/components/Link';
import { classNames } from '@/util/utils';
import FooterLink from '@/components/BrainConfigPanel/FooterLink';
import { campaignNameAtom, campaignDescriptionAtom } from '@/state/experiment-designer';

const configAtomLoadable = loadable(configAtom);

export default function ExperimentDesignerPanel() {
  const [isOpen, setIsOpen] = useState(true);
  const simCampName = useAtomValue(campaignNameAtom);
  const simCampDescription = useAtomValue(campaignDescriptionAtom);
  const loadableConfig = useAtomValue(configAtomLoadable);
  const circuitInfo = loadableConfig.state === 'hasData' ? loadableConfig.data : null;

  return (
    <div
      className={classNames('h-screen bg-primary-9 text-white', isOpen ? 'w-[300px]' : 'w-[40px]')}
    >
      {!isOpen && (
        <div className="flex flex-col items-center pt-2">
          <Button
            className="mb-4"
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
        <div className="h-full overflow-y-scroll flex flex-col p-6">
          <div className="flex gap-x-2 justify-between items-start">
            <div className="text-3xl overflow-hidden text-ellipsis font-bold">{simCampName}</div>
            <Button
              type="text"
              size="small"
              icon={<MinusOutlined className="text-white" />}
              onClick={() => setIsOpen(false)}
            />
          </div>

          <div>{simCampDescription}</div>

          <div className="my-6">
            <div className="bg-primary-5 h-px" />
          </div>

          <div>Circuit used</div>
          <div>{circuitInfo?.name}</div>

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
