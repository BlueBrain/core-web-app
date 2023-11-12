'use client';

import { Suspense } from 'react';
import { useAtomValue } from 'jotai';
import { Button } from 'antd';
import { CalendarOutlined, LinkOutlined, RightOutlined, UserOutlined } from '@ant-design/icons';

import ApplicationSidebar from '../ApplicationSidebar';
import CloneIcon from '../icons/Clone';
import BrainConfigEntry from './BrainConfigEntry';
import { recentConfigsAtom, publicConfigsAtom, personalConfigsAtom } from './state';
import { configAtom } from '@/state/brain-model-config';
import detailedCircuitAtom from '@/state/circuit';
import { LinkIcon } from '@/components/icons';
import CopyTextBtn from '@/components/CopyTextBtn';
import Link from '@/components/Link';

type ConfigListProps = {
  baseHref: string;
};

export const CURATED_MODELS = [
  {
    id: 'https://bbp.epfl.ch/neurosciencegraph/data/modelconfigurations/1921aaae-69c4-4366-ae9d-7aa1453f2158',
    name: 'Release 23.01',
    description: 'Fully supported by circuit building.',
  },
  {
    id: 'https://bbp.epfl.ch/data/bbp/mmb-point-neuron-framework-model/fa12833f-5f40-4f20-bdec-2cab995c23d4',
    name: 'Release 23.02',
    description: 'With Synapse config.',
  },
  {
    id: 'https://bbp.epfl.ch/neurosciencegraph/data/modelconfigurations/f2bf4c1a-cd20-43e9-bbc1-5fee116266c5',
    name: 'Release 23.03',
    description: 'With MicroConnectome config.',
  },
];

function BrainModelConfigName() {
  const brainModelConfig = useAtomValue(configAtom);

  return <span className="relative">{brainModelConfig?.name}</span>;
}

function BrainModelConfigDetails() {
  const brainModelConfig = useAtomValue(configAtom);
  const detailedCircuit = useAtomValue(detailedCircuitAtom);

  return (
    <div className="w-full mb-4">
      <div className="flex items-center justify-between w-full">
        <div className="inline-flex items-center gap-1">
          <UserOutlined className="text-base text-white inline-block" />
          <span className="align-middle text-white line-clamp-1">
            {brainModelConfig?._createdBy?.split('/').at(-1)}
          </span>
          {!!detailedCircuit && (
            <CopyTextBtn
              text={detailedCircuit['@id']}
              icon={<LinkIcon className="inline-block" />}
              style={{ width: '110px' }}
            >
              Copy circuit ID
            </CopyTextBtn>
          )}
        </div>
        {brainModelConfig?._updatedAt && (
          <div className="inline-flex items-center gap-1">
            <CalendarOutlined className="text-base inline-block" />
            <span className="align-middle text-white">
              {new Date(brainModelConfig._updatedAt).toLocaleDateString().replaceAll('/', '.')}
            </span>
          </div>
        )}
      </div>
      <p className="my-2 text-primary-2 text-xs">{brainModelConfig?.description}</p>
    </div>
  );
}

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

function BuildSideBarHeader() {
  return (
    <Suspense fallback={null}>
      <BrainModelConfigName />
    </Suspense>
  );
}

function Collapsible({
  title,
  open,
  children,
}: {
  title: string | JSX.Element;
  children: React.ReactNode;
  open?: boolean;
}) {
  return (
    <details className="w-full py-2" open={open}>
      <summary className="block cursor-pointer group">
        <div className="flex justify-between items-center">
          <span className="text-base font-bold group-hover:text-primary-3">{title}</span>
          <RightOutlined className="text-primary-3 text-sm w-[14px] h-[14px]" />
        </div>
      </summary>
      <div className="px-2 py-4 transition-all duration-200">{children}</div>
    </details>
  );
}

function BuildSideBarControlPanel({ baseHref, expanded }: { baseHref: string; expanded: boolean }) {
  if (!expanded) return null;
  return (
    <div className="pr-2 w-full">
      <Suspense fallback={null}>
        <BrainModelConfigDetails />
      </Suspense>

      <div className="w-full flex flex-col items-start py-2 mb-3 border-y border-primary-7">
        <Button
          type="text"
          icon={<CloneIcon className="text-primary-4" />}
          className="text-white font-bold text-base px-0 hover:!bg-transparent hover:!text-primary-4"
        >
          Duplicate brain model
        </Button>
        <Button
          type="text"
          icon={<LinkOutlined className="text-primary-4" />}
          className="text-white font-bold text-base px-0 hover:!bg-transparent hover:!text-primary-4"
        >
          Copy brain model url
        </Button>
      </div>

      <Collapsible title="Reference configurations">
        <div className="space-y-4">
          {CURATED_MODELS.map((config) => (
            <CuratedModelLinkBtn key={config.name} config={config} baseHref={baseHref} />
          ))}
        </div>
      </Collapsible>

      <div className="!h-px bg-primary-7 w-full" />

      <Collapsible title="Recently used configurations">
        <div className="space-y-2">
          <Suspense fallback={null}>
            <RecentConfigs baseHref={baseHref} />
          </Suspense>
        </div>
      </Collapsible>

      <div className="h-px bg-primary-7 w-full" />

      <Collapsible title="Public configurations">
        <div className="space-y-2">
          <Suspense fallback={null}>
            <PublicConfigs baseHref={baseHref} />
          </Suspense>
        </div>
      </Collapsible>

      <div className="h-px bg-primary-7 w-full" />

      <Collapsible title="My configurations">
        <div className="space-y-2">
          <Suspense fallback={null}>
            <PersonalConfigs baseHref={baseHref} />
          </Suspense>
        </div>
      </Collapsible>
    </div>
  );
}

export default function BuildSideBar({ baseHref }: { baseHref: string }) {
  return (
    <ApplicationSidebar
      title={BuildSideBarHeader}
      control={({ expanded }) => BuildSideBarControlPanel({ baseHref, expanded })}
    />
  );
}
