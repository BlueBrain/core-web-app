'use client';

import { Suspense, useCallback } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { Button } from 'antd';
import { CalendarOutlined, LinkOutlined, RightOutlined, UserOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

import ApplicationSidebar from '../ApplicationSidebar';
import CloneIcon from '../icons/Clone';
import BrainConfigEntry from './BrainConfigEntry';
import {
  recentConfigsAtom,
  publicConfigsAtom,
  personalConfigsAtom,
  triggerRefetchAllAtom,
} from './state';
import { configAtom } from '@/state/brain-model-config';
import detailedCircuitAtom from '@/state/circuit';
import { LinkIcon } from '@/components/icons';
import CopyTextBtn from '@/components/CopyTextBtn';
import Link from '@/components/Link';
import useCloneConfigModal from '@/hooks/config-clone-modal';
import { cloneBrainModelConfig } from '@/api/nexus';
import { getBrainModelConfigsByNameQuery } from '@/queries/es';
import { BrainModelConfigResource } from '@/types/nexus';
import { collapseId } from '@/util/nexus';

type ConfigListProps = {
  baseHref: string;
};

export const CURATED_MODELS = [
  {
    id: 'https://bbp.epfl.ch/neurosciencegraph/data/modelconfigurations/1921aaae-69c4-4366-ae9d-7aa1453f2158',
    name: 'Release 23.01',
    description: 'Fully supported by circuit building.',
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
    <div className="mb-4 w-full">
      <div className="flex w-full items-center justify-between">
        <div className="inline-flex items-center gap-1">
          <UserOutlined className="inline-block text-base text-white" />
          <span className="line-clamp-1 align-middle text-white">
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
          <div className="flex items-center justify-center gap-1">
            <CalendarOutlined className="text-base" />
            <span className="align-middle text-white">
              {new Date(brainModelConfig._updatedAt).toLocaleDateString().replaceAll('/', '.')}
            </span>
          </div>
        )}
      </div>
      <p className="my-2 text-xs text-primary-2">{brainModelConfig?.description}</p>
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
      className="flex h-12 items-center justify-center border border-primary-3 text-primary-3"
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
      <summary className="group block cursor-pointer">
        <div className="flex items-center justify-between">
          <span className="text-base font-bold group-hover:text-primary-3">{title}</span>
          <RightOutlined className="h-[14px] w-[14px] text-sm text-primary-3" />
        </div>
      </summary>
      <div className="px-2 py-4 transition-all duration-200">{children}</div>
    </details>
  );
}

function BuildSideBarControlPanel({ baseHref, expanded }: { baseHref: string; expanded: boolean }) {
  const router = useRouter();
  const brainModelConfig = useAtomValue(configAtom);
  const triggerRefetch = useSetAtom(triggerRefetchAllAtom);

  const { createModal: createCloneModal, contextHolder: cloneContextHolder } =
    useCloneConfigModal<BrainModelConfigResource>(
      cloneBrainModelConfig,
      getBrainModelConfigsByNameQuery
    );
  const openCloneModal = useCallback(
    (currentConfig: BrainModelConfigResource) => () => {
      createCloneModal(currentConfig, (clonedConfig: BrainModelConfigResource) => {
        triggerRefetch();
        router.push(
          `${baseHref}?brainModelConfigId=${encodeURIComponent(collapseId(clonedConfig['@id']))}`
        );
      });
    },
    [baseHref, createCloneModal, router, triggerRefetch]
  );

  if (!expanded) return null;
  return (
    <div className="w-full pr-2">
      <Suspense fallback={null}>
        <BrainModelConfigDetails />
      </Suspense>

      <div className="mb-3 flex w-full flex-col items-start border-y border-primary-7 py-2">
        {brainModelConfig && (
          <Button
            type="text"
            icon={<CloneIcon className="text-primary-4" />}
            className="px-0 text-base font-bold text-white hover:!bg-transparent hover:!text-primary-4"
            onClick={openCloneModal(brainModelConfig)}
          >
            Duplicate brain model
          </Button>
        )}
        <CopyTextBtn
          icon={<LinkOutlined className="text-primary-4" />}
          text={brainModelConfig?.['@id'] ?? ''}
          className="px-0 text-base font-bold text-white hover:!bg-transparent hover:!text-primary-4"
        >
          Copy brain model url
        </CopyTextBtn>
      </div>

      <Collapsible title="Reference configurations">
        <div className="space-y-4">
          {CURATED_MODELS.map((config) => (
            <CuratedModelLinkBtn key={config.name} config={config} baseHref={baseHref} />
          ))}
        </div>
      </Collapsible>

      <div className="!h-px w-full bg-primary-7" />

      <Collapsible title="Recently used configurations">
        <div className="space-y-2">
          <Suspense fallback={null}>
            <RecentConfigs baseHref={baseHref} />
          </Suspense>
        </div>
      </Collapsible>

      <div className="h-px w-full bg-primary-7" />

      <Collapsible title="Public configurations">
        <div className="space-y-2">
          <Suspense fallback={null}>
            <PublicConfigs baseHref={baseHref} />
          </Suspense>
        </div>
      </Collapsible>

      <div className="h-px w-full bg-primary-7" />

      <Collapsible title="My configurations">
        <div className="space-y-2">
          <Suspense fallback={null}>
            <PersonalConfigs baseHref={baseHref} />
          </Suspense>
        </div>
      </Collapsible>
      {cloneContextHolder}
    </div>
  );
}

export default function BuildSideBar({ baseHref }: { baseHref: string }) {
  return (
    <ApplicationSidebar title={BuildSideBarHeader}>
      {({ expanded }) => <BuildSideBarControlPanel {...{ expanded, baseHref }} />}
    </ApplicationSidebar>
  );
}
