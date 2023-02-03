'use client';

import { Table, Button } from 'antd';
import { useRouter } from 'next/navigation';
import { useAtomValue, useSetAtom } from 'jotai/react';
import { useSession } from 'next-auth/react';

import { recentlyUsedConfigsAtom, triggerRefetchAtom } from './state';
import { basePath } from '@/config';
import useCloneConfigModal from '@/hooks/brain-config-clone-modal';
import useRenameModal from '@/hooks/brain-config-rename-modal';
import Link from '@/components/Link';
import EditIcon from '@/components/icons/Edit';
import CloneIcon from '@/components/icons/Clone';
import { BrainModelConfigResource } from '@/types/nexus';
import { collapseId } from '@/util/nexus';

const { Column } = Table;

type RecentConfigListProps = {
  baseHref: string;
};

export default function RecentConfigList({ baseHref }: RecentConfigListProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const recentlyUsedConfigs = useAtomValue(recentlyUsedConfigsAtom);
  const triggerRefetch = useSetAtom(triggerRefetchAtom);

  const { createModal: createCloneModal, contextHolder: cloneContextHolder } =
    useCloneConfigModal();
  const { createModal: createRenameModal, contextHolder: renameContextHolder } = useRenameModal();

  const openCloneModal = (currentConfig: BrainModelConfigResource) => {
    createCloneModal(currentConfig, (clonedConfig: BrainModelConfigResource) => {
      triggerRefetch();
      router.push(
        `${basePath}${baseHref}?brainModelConfigId=${encodeURIComponent(
          collapseId(clonedConfig['@id'])
        )}`
      );
    });
  };

  const openRenameModal = (config: BrainModelConfigResource) => {
    createRenameModal(config, triggerRefetch);
  };

  return (
    <>
      <h3 className="text-xl">Recently used configurations</h3>

      <Table<BrainModelConfigResource>
        size="small"
        className="mt-6 mb-12"
        dataSource={recentlyUsedConfigs}
        pagination={false}
        rowKey="@id"
      >
        <Column
          title="NAME"
          dataIndex="name"
          key="name"
          render={(name, config: BrainModelConfigResource) => (
            <Link
              href={`${baseHref}?brainModelConfigId=${encodeURIComponent(
                collapseId(config['@id'])
              )}`}
            >
              {name}
            </Link>
          )}
        />
        <Column title="DESCRIPTION" dataIndex="description" key="description" />
        <Column
          title="CREATED BY"
          dataIndex="_createdBy"
          key="createdBy"
          render={(createdBy) => createdBy.split('/').reverse()[0]}
        />
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
      </Table>

      {cloneContextHolder}
      {renameContextHolder}
    </>
  );
}
