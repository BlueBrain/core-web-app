'use client';

import { useState } from 'react';
import { Table, Button } from 'antd';
import { useRouter } from 'next/navigation';
import { useAtomValue, useSetAtom } from 'jotai';

import RenameBrainConfigModal from './RenameBrainConfigModal';
import { recentlyUsedConfigsAtom, triggerRefetchAtom } from './state';
import useCloneConfigModal from '@/hooks/brain-config-clone-modal';
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
  const recentlyUsedConfigs = useAtomValue(recentlyUsedConfigsAtom);
  const triggerRefetch = useSetAtom(triggerRefetchAtom);

  const { showModal, contextHolder } = useCloneConfigModal();

  const [brainConfig, setBrainConfig] = useState<BrainModelConfigResource>();
  const [isRenameModalOpened, setIsRenameModalOpened] = useState<boolean>(false);

  const openRenameModal = (currentBrainConfig: BrainModelConfigResource) => {
    setBrainConfig(currentBrainConfig);
    setIsRenameModalOpened(true);
  };

  const showCloneModal = (currentConfig: BrainModelConfigResource) => {
    showModal(currentConfig, (clonedConfig) => {
      triggerRefetch();
      router.push(
        `${baseHref}?brainModelConfigId=${encodeURIComponent(collapseId(clonedConfig['@id']))}`
      );
    });
  };

  const onRenameSuccess = () => {
    if (!brainConfig) return;

    triggerRefetch();
    setIsRenameModalOpened(false);
  };

  return (
    <>
      <h3 className="text-xl">Recently used configurations</h3>

      <Table<BrainModelConfigResource>
        size="small"
        className="mt-6 mb-12"
        dataSource={recentlyUsedConfigs}
        pagination={false}
        rowKey="id"
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
                onClick={() => openRenameModal(config)}
              >
                <EditIcon />
              </Button>

              <Button
                size="small"
                type="text"
                className="inline-block"
                onClick={() => showCloneModal(config)}
              >
                <CloneIcon />
              </Button>
            </>
          )}
        />
      </Table>

      {brainConfig && isRenameModalOpened && (
        <RenameBrainConfigModal
          config={brainConfig}
          open={isRenameModalOpened}
          onCancel={() => setIsRenameModalOpened(false)}
          onRenameSuccess={onRenameSuccess}
        />
      )}

      {contextHolder}
    </>
  );
}
