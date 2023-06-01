'use client';

import { useState, useEffect } from 'react';
import { Table, Button } from 'antd';
import { useRouter } from 'next/navigation';
import { useAtomValue, useSetAtom } from 'jotai';
import { loadable } from 'jotai/utils';
import { useSession } from 'next-auth/react';

import { triggerRefetchAtom } from './state';
import { configListAtom } from '@/state/brain-model-config-list';
import useCloneModal from '@/hooks/brain-config-clone-modal';
import useRenameModal from '@/hooks/brain-config-rename-modal';
import { collapseId } from '@/util/nexus';
import { BrainModelConfigResource } from '@/types/nexus';
import Link from '@/components/Link';
import CloneIcon from '@/components/icons/Clone';
import EditIcon from '@/components/icons/Edit';
import ConfigList from '@/components/ConfigList';

const { Column } = Table;

type ConfigSearchListProps = {
  baseHref: string;
};

const loadableConfigAtom = loadable(configListAtom);

export default function ConfigSearchList({ baseHref }: ConfigSearchListProps) {
  const { data: session } = useSession();
  const router = useRouter();

  const configsLoadable = useAtomValue(loadableConfigAtom);
  const triggerRefetch = useSetAtom(triggerRefetchAtom);

  const [configs, setConfigs] = useState<BrainModelConfigResource[]>(
    configsLoadable.state === 'hasData' ? configsLoadable.data : []
  );

  const { createModal: createCloneModal, contextHolder: cloneContextHolder } = useCloneModal();
  const { createModal: createRenameModal, contextHolder: renameContextHolder } = useRenameModal();

  useEffect(() => {
    if (configsLoadable.state !== 'hasData') return;

    setConfigs(configsLoadable.data);
  }, [configsLoadable]);

  const openCloneModal = (config: BrainModelConfigResource) => {
    createCloneModal(config, (clonedConfig: BrainModelConfigResource) =>
      router.push(
        `${baseHref}?brainModelConfigId=${encodeURIComponent(collapseId(clonedConfig['@id']))}`
      )
    );
  };

  const openRenameModal = (config: BrainModelConfigResource) => {
    createRenameModal(config, triggerRefetch);
  };

  const nameRenderFn = (name: string, conf: BrainModelConfigResource) => (
    <Link href={`${baseHref}?brainModelConfigId=${encodeURIComponent(collapseId(conf['@id']))}`}>
      {name}
    </Link>
  );

  return (
    <>
      <ConfigList<BrainModelConfigResource>
        isLoading={configsLoadable.state === 'loading'}
        configs={configs}
        nameRenderFn={nameRenderFn}
      >
        <Column
          title=""
          key="actions"
          width={86}
          render={(_, config: BrainModelConfigResource) => (
            <>
              <Button
                size="small"
                type="text"
                disabled={config._createdBy.split('/').reverse()[0] !== session?.user.username}
                className="inline-block mr-2"
                onClick={() => openRenameModal(config)}
              >
                <EditIcon />
              </Button>

              <Button size="small" type="text" onClick={() => openCloneModal(config)}>
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
