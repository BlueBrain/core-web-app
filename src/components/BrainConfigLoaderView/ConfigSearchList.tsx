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

const { Column } = Table;

function getSorterFn(sortProp: 'name' | 'description' | '_createdBy') {
  return (a: BrainModelConfigResource, b: BrainModelConfigResource) =>
    a[sortProp] < b[sortProp] ? 1 : -1;
}

type ConfigSearchListProps = {
  baseHref: string;
};

export default function ConfigSearchList({ baseHref }: ConfigSearchListProps) {
  const { data: session } = useSession();
  const router = useRouter();

  const configsLoadable = useAtomValue(loadable(configListAtom));
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

  return (
    <>
      <Table<BrainModelConfigResource>
        size="small"
        className="mt-6 mb-12"
        loading={configsLoadable.state === 'loading'}
        dataSource={configs}
        pagination={configs.length > 10 ? { defaultPageSize: 10 } : false}
        rowKey="@id"
      >
        <Column
          title="NAME"
          dataIndex="name"
          key="name"
          sorter={getSorterFn('name')}
          render={(name, conf: BrainModelConfigResource) => (
            <Link
              href={`${baseHref}?brainModelConfigId=${encodeURIComponent(collapseId(conf['@id']))}`}
            >
              {name}
            </Link>
          )}
        />
        <Column
          title="DESCRIPTION"
          dataIndex="description"
          key="description"
          sorter={getSorterFn('description')}
        />
        <Column
          title="CREATED BY"
          dataIndex="_createdBy"
          key="createdBy"
          sorter={getSorterFn('_createdBy')}
          render={(createdBy) => createdBy.split('/').reverse()[0]}
        />
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
      </Table>

      {cloneContextHolder}
      {renameContextHolder}
    </>
  );
}
