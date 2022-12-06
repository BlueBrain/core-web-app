import { useState } from 'react';
import { Button } from 'antd';
import { PlusOutlined, MinusOutlined, RightOutlined } from '@ant-design/icons';
import { useAtomValue } from 'jotai';

import {
  CURATED_MODELS,
  RECENTLY_USED_CONFIGS,
  PUBLIC_CONFIGS,
} from '../BrainConfigLoaderView/placeholder-data';
import Collapse from './Collapse';
import BrainConfigEntry from './BrainConfigEntry';
import FooterLink from './FooterLink';
import { BrainConfig } from './types';
import brainModelConfigAtom from '@/state/brain-model-config';
import HomeIcon from '@/components/icons/Home';
import Link from '@/components/Link';
import { classNames } from '@/util/utils';

type BrainConfigPanelProps = {
  baseHref: string;
};

export default function BrainConfigPanel({ baseHref }: BrainConfigPanelProps) {
  const brainModelConfig = useAtomValue(brainModelConfigAtom);

  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div
      className={classNames(
        'h-screen bg-primary-9 w-[40px] text-white',
        isOpen ? 'w-[300px]' : null
      )}
    >
      {!isOpen && (
        <div className="flex flex-col items-center pt-2">
          <Button
            className="mb-4"
            type="text"
            size="small"
            icon={<PlusOutlined className="text-white" />}
            onClick={() => setIsOpen(true)}
          />

          {brainModelConfig && (
            <>
              <div style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                {brainModelConfig.name}
              </div>

              <Link className="text-lg text-primary-3 mt-4" href="/">
                <HomeIcon />
              </Link>
            </>
          )}
        </div>
      )}

      {isOpen && (
        <div className="h-full overflow-y-scroll flex flex-col px-6 pt-4 pb-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl">{brainModelConfig?.name}</h2>
            <Button
              className="p-2"
              type="text"
              icon={<MinusOutlined className="text-white" />}
              onClick={() => setIsOpen(false)}
            />
          </div>

          <div className="my-8 bg-primary-5 h-px" />

          <Collapse className="mb-8" title="Reference configurations">
            <div className="space-y-4">
              {CURATED_MODELS.map((brainConfig: BrainConfig) => (
                <Link
                  className="flex items-center justify-center text-primary-3 border border-primary-3 h-12"
                  key={brainConfig.id}
                  href={`${baseHref}?brainConfigId=${encodeURIComponent(brainConfig.id)}`}
                >
                  {brainConfig.name}
                </Link>
              ))}
            </div>
          </Collapse>

          <Collapse className="mb-8" title="Recently used configurations">
            <div className="space-y-2">
              {RECENTLY_USED_CONFIGS.map((brainConfig: BrainConfig) => (
                <BrainConfigEntry
                  key={brainConfig.id}
                  brainConfig={brainConfig}
                  baseHref={baseHref}
                />
              ))}
            </div>
          </Collapse>

          <Collapse className="mb-8" title="Public configurations" defaultCollapsed>
            <div className="space-y-2">
              {PUBLIC_CONFIGS.map((brainConfig: BrainConfig) => (
                <BrainConfigEntry
                  key={brainConfig.id}
                  brainConfig={brainConfig}
                  baseHref={baseHref}
                />
              ))}
            </div>
          </Collapse>

          <Collapse className="mb-8" title="My configurations" defaultCollapsed>
            <div className="space-y-2">
              {PUBLIC_CONFIGS.map((brainConfig: BrainConfig) => (
                <BrainConfigEntry
                  key={brainConfig.id}
                  brainConfig={brainConfig}
                  baseHref={baseHref}
                />
              ))}
            </div>
          </Collapse>

          <footer className="space-y-2 mt-auto">
            <FooterLink href="/">
              <span>Home</span>
              <HomeIcon />
            </FooterLink>

            <FooterLink className="bg-primary-8" href="/virtual-lab">
              <span>Virtual lab</span>
              <RightOutlined />
            </FooterLink>

            <FooterLink className="bg-primary-8" href="/observatory">
              <span>Observatory</span>
              <RightOutlined />
            </FooterLink>
          </footer>
        </div>
      )}
    </div>
  );
}
