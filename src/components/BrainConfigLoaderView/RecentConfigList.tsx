'use client';

import { useState, useEffect } from 'react';
import { Table, Button } from 'antd';
import { useRouter } from 'next/navigation';
import { useAtomValue, useSetAtom } from 'jotai';
import { loadable } from 'jotai/utils';
import { useSession } from 'next-auth/react';

import { recentlyUsedConfigsAtom, triggerRefetchAtom } from './state';
import useCloneConfigModal from '@/hooks/brain-config-clone-modal';
import useRenameModal from '@/hooks/brain-config-rename-modal';
import Link from '@/components/Link';
import EditIcon from '@/components/icons/Edit';
import CloneIcon from '@/components/icons/Clone';
import { BrainModelConfigResource } from '@/types/nexus';
import { collapseId } from '@/util/nexus';
import ConfigList from '@/components/ConfigList';

const { Column } = Table;

type RecentConfigListProps = {
  baseHref: string;
};

export default function RecentConfigList({ baseHref }: RecentConfigListProps) {
  const router = useRouter();
  const { data: session } = useSession();

  const configsLoadable = useAtomValue(loadable(recentlyUsedConfigsAtom));
  const triggerRefetch = useSetAtom(triggerRefetchAtom);

  const [configs, setConfigs] = useState<BrainModelConfigResource[]>(
    configsLoadable.state === 'hasData' ? configsLoadable.data : []
  );

  const { createModal: createCloneModal, contextHolder: cloneContextHolder } =
    useCloneConfigModal();
  const { createModal: createRenameModal, contextHolder: renameContextHolder } = useRenameModal();

  useEffect(() => {
    if (configsLoadable.state !== 'hasData') return;

    setConfigs(configsLoadable.data);
  }, [configsLoadable]);

  const openCloneModal = (currentConfig: BrainModelConfigResource) => {
    createCloneModal(currentConfig, (clonedConfig: BrainModelConfigResource) => {
      triggerRefetch();
      router.push(
        `${baseHref}?brainModelConfigId=${encodeURIComponent(collapseId(clonedConfig['@id']))}`
      );
    });
  };

  const openRenameModal = (config: BrainModelConfigResource) => {
    createRenameModal(config, triggerRefetch);
  };

  const nameRenderFn = (name: string, config: BrainModelConfigResource) => (
    <Link href={`${baseHref}?brainModelConfigId=${encodeURIComponent(collapseId(config['@id']))}`}>
      {name}
    </Link>
  );

  return (
    <>
      <h3 className="text-xl">Recently used configurations</h3>

      <ConfigList<BrainModelConfigResource>
        isLoading={configsLoadable.state === 'loading'}
        configs={configs}
        nameRenderFn={nameRenderFn}
      >
        <Column
          title=""
          key="actions"
          width={86}
          render={(config) => (
            <>
              <Button
                size="small"
                type="text"
                className="inline-block mr-2"
                disabled={config._createdBy.split('/').reverse()[0] !== session?.user.username}
                onClick={() => openRenameModal(config)}
              >
                <EditIcon />
              </Button>

              <Button
                size="small"
                type="text"
                className="inline-block"
                onClick={() => openCloneModal(config)}
              >
                <CloneIcon />
              </Button>
            </>
          )}
        />
      </ConfigList>

      {cloneContextHolder}
      {renameContextHolder}
    </>
  );
}
