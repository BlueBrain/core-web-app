'use client';

import { Suspense, useState } from 'react';
import { Button } from 'antd';
import { PlusOutlined, MinusOutlined, RightOutlined } from '@ant-design/icons';
import { useAtomValue } from 'jotai/react';

import Collapse from './Collapse';
import BrainConfigEntry from './BrainConfigEntry';
import FooterLink from './FooterLink';
import { recentConfigsAtom, publicConfigsAtom, personalConfigsAtom } from './state';
import { configAtom } from '@/state/brain-factory/brain-model-config';
import HomeIcon from '@/components/icons/Home';
import Link from '@/components/Link';
import { classNames } from '@/util/utils';

export const CURATED_MODELS = [
  {
    id: '1921aaae-69c4-4366-ae9d-7aa1453f2158',
    name: 'Release 23.01',
    description: 'UIrna condimentum mattis pellentesque id nibh tortor id.',
  },
  {
    id: '1921aaae-69c4-4366-ae9d-7aa1453f2158',
    name: 'Disease model 1',
    description: 'UIrna condimentum mattis pellentesque id nibh tortor id.',
  },
  {
    id: '1921aaae-69c4-4366-ae9d-7aa1453f2158',
    name: 'Disease model 2',
    description: 'UIrna condimentum mattis pellentesque id nibh tortor id.',
  },
];

type BrainConfigPanelProps = {
  baseHref: string;
};

function BrainModelConfigName() {
  const brainModelConfig = useAtomValue(configAtom);

  return <span>{brainModelConfig?.name}</span>;
}

type ConfigListProps = {
  baseHref: string;
};

function RecentConfigs({ baseHref }: ConfigListProps) {
  const recentConfigs = useAtomValue(recentConfigsAtom);

  return (
    <>
      {recentConfigs.map((config) => (
        <BrainConfigEntry key={config['@id']} config={config} baseHref={baseHref} />
      ))}
    </>
  );
}

function PublicConfigs({ baseHref }: ConfigListProps) {
  const publicConfigs = useAtomValue(publicConfigsAtom);

  return (
    <>
      {publicConfigs.map((config) => (
        <BrainConfigEntry key={config['@id']} config={config} baseHref={baseHref} />
      ))}
    </>
  );
}

function PersonalConfigs({ baseHref }: ConfigListProps) {
  const personalConfigs = useAtomValue(personalConfigsAtom);

  return (
    <>
      {personalConfigs.map((config) => (
        <BrainConfigEntry key={config['@id']} config={config} baseHref={baseHref} />
      ))}
    </>
  );
}

function CuratedModelLinkBtn({
  config,
  baseHref,
}: {
  config: { id: string; name: string };
  baseHref: string;
}) {
  return (
    <Link
      className="flex items-center justify-center text-primary-3 border border-primary-3 h-12"
      key={config.id}
      href={`${baseHref}/?brainModelConfigId=${encodeURIComponent(config.id)}`}
    >
      {config.name}
    </Link>
  );
}

export default function BrainConfigPanel({ baseHref }: BrainConfigPanelProps) {
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
            icon={<PlusOutlined style={{ color: 'white' }} />}
            onClick={() => setIsOpen(true)}
          />

          <div style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
            <Suspense fallback={null}>
              <BrainModelConfigName />
            </Suspense>
          </div>

          <Link className="text-lg text-primary-3 mt-4" href="/">
            <HomeIcon />
          </Link>
        </div>
      )}

      {isOpen && (
        <div className="h-full overflow-y-scroll flex flex-col px-6 pt-4 pb-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl">
              <Suspense fallback={null}>
                <BrainModelConfigName />
              </Suspense>
            </h2>
            <Button
              className="p-2"
              type="text"
              icon={<MinusOutlined className="text-white" />}
              onClick={() => setIsOpen(false)}
            />
          </div>

          <div className="my-8">
            <div className="bg-primary-5 h-px" />
          </div>

          <Collapse className="mb-8" title="Reference configurations">
            <div className="space-y-4">
              {CURATED_MODELS.map((config) => (
                <CuratedModelLinkBtn key={config.name} config={config} baseHref={baseHref} />
              ))}
            </div>
          </Collapse>

          <Collapse className="mb-8" title="Recently used configurations">
            <div className="space-y-2">
              <Suspense fallback={null}>
                <RecentConfigs baseHref={baseHref} />
              </Suspense>
            </div>
          </Collapse>

          <Collapse className="mb-8" title="Public configurations" defaultCollapsed>
            <div className="space-y-2">
              <Suspense fallback={null}>
                <PublicConfigs baseHref={baseHref} />
              </Suspense>
            </div>
          </Collapse>

          <Collapse className="mb-8" title="My configurations" defaultCollapsed>
            <div className="space-y-2">
              <Suspense fallback={null}>
                <PersonalConfigs baseHref={baseHref} />
              </Suspense>
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
