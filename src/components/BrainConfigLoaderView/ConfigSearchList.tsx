'use client';

import { Table, Button } from 'antd';
import { useRouter } from 'next/navigation';
import { useAtomValue, useSetAtom } from 'jotai/react';
import { useSession } from 'next-auth/react';

import { brainModelConfigListAtom, triggerRefetchAtom } from './state';
import useCloneModal from '@/hooks/brain-config-clone-modal';
import useRenameModal from '@/hooks/brain-config-rename-modal';
import { collapseId } from '@/util/nexus';
import { BrainModelConfigResource } from '@/types/nexus';
import Link from '@/components/Link';
import CloneIcon from '@/components/icons/Clone';
import EditIcon from '@/components/icons/Edit';
import { basePath } from '@/config';

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
  const brainModelConfigs = useAtomValue(brainModelConfigListAtom);
  const triggerRefetch = useSetAtom(triggerRefetchAtom);

  const { createModal: createCloneModal, contextHolder: cloneContextHolder } = useCloneModal();
  const { createModal: createRenameModal, contextHolder: renameContextHolder } = useRenameModal();

  const openCloneModal = (config: BrainModelConfigResource) => {
    createCloneModal(config, (clonedConfig: BrainModelConfigResource) =>
      router.push(
        `${basePath}${baseHref}?brainModelConfigId=${encodeURIComponent(
          collapseId(clonedConfig['@id'])
        )}`
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
        dataSource={brainModelConfigs}
        pagination={brainModelConfigs.length > 10 ? { defaultPageSize: 10 } : false}
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
