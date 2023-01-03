'use client';

import { useState } from 'react';
import { Table, Button, ConfigProvider } from 'antd';
import { useRouter } from 'next/navigation';
import { useAtomValue, useSetAtom } from 'jotai';

import { modalTheme } from './antd-theme';
import CloneBrainConfigModal from './CloneBrainConfigModal';
import RenameBrainConfigModal from './RenameBrainConfigModal';
import { recentlyUsedConfigsAtom, triggerRefetchAtom } from './state';
import Link from '@/components/Link';
import EditIcon from '@/components/icons/Edit';
import CloneIcon from '@/components/icons/Clone';
import { basePath } from '@/config';
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

  const [brainConfig, setBrainConfig] = useState<BrainModelConfigResource>();
  const [isCloneModalOpened, setIsCloneModalOpened] = useState<boolean>(false);
  const [isRenameModalOpened, setIsRenameModalOpened] = useState<boolean>(false);

  const openCloneModal = (currentBrainConfig: BrainModelConfigResource) => {
    setBrainConfig(currentBrainConfig);
    setIsCloneModalOpened(true);
  };

  const openRenameModal = (currentBrainConfig: BrainModelConfigResource) => {
    setBrainConfig(currentBrainConfig);
    setIsRenameModalOpened(true);
  };

  const onCloneSuccess = (clonedBrainConfigId: string) => {
    triggerRefetch();
    router.push(
      `${basePath}${baseHref}?brainModelConfigId=${encodeURIComponent(
        collapseId(clonedBrainConfigId)
      )}`
    );
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
                onClick={() => openCloneModal(config.name)}
              >
                <CloneIcon />
              </Button>
            </>
          )}
        />
      </Table>

      {brainConfig && (
        <ConfigProvider theme={modalTheme}>
          <CloneBrainConfigModal
            config={brainConfig}
            open={isCloneModalOpened}
            onCancel={() => setIsCloneModalOpened(false)}
            onCloneSuccess={onCloneSuccess}
          />

          {isRenameModalOpened && (
            <RenameBrainConfigModal
              config={brainConfig}
              open={isRenameModalOpened}
              onCancel={() => setIsRenameModalOpened(false)}
              onRenameSuccess={onRenameSuccess}
            />
          )}
        </ConfigProvider>
      )}
    </>
  );
}
