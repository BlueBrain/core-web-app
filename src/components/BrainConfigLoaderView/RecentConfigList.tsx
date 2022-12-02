'use client';

import { useState } from 'react';
import { Table, Button, ConfigProvider } from 'antd';
import { useRouter } from 'next/navigation';

import { modalTheme } from './antd-theme';
import { RECENTLY_USED_CONFIGS } from './placeholder-data';
import CloneBrainConfigModal from './CloneBrainConfigModal';
import RenameBrainConfigModal from './RenameBrainConfigModal';
import Link from '@/components/Link';
import EditIcon from '@/components/icons/Edit';
import CloneIcon from '@/components/icons/Clone';
import { basePath } from '@/config';

const { Column } = Table;

type RecentConfigListProps = {
  baseHref: string;
};

type BrainConfig = typeof RECENTLY_USED_CONFIGS[number];

export default function RecentConfigList({ baseHref }: RecentConfigListProps) {
  const router = useRouter();
  const [recentlyUsedConfigs, setRecentlyUsedConfigs] =
    useState<BrainConfig[]>(RECENTLY_USED_CONFIGS);

  const [brainConfig, setBrainConfig] = useState<BrainConfig>();
  const [isCloneModalOpened, setIsCloneModalOpened] = useState<boolean>(false);
  const [isRenameModalOpened, setIsRenameModalOpened] = useState<boolean>(false);

  const openCloneModal = (currentBrainConfig: BrainConfig) => {
    setBrainConfig(currentBrainConfig);
    setIsCloneModalOpened(true);
  };

  const openRenameModal = (currentBrainConfig: BrainConfig) => {
    setBrainConfig(currentBrainConfig);
    setIsRenameModalOpened(true);
  };

  const onCloneSuccess = (clonedBrainConfigId: string) => {
    router.push(`${basePath}${baseHref}?brainConfigId=${encodeURIComponent(clonedBrainConfigId)}`);
  };

  const onRenameSuccess = (id: string, newName: string) => {
    if (!brainConfig) return;

    brainConfig.name = newName;
    setRecentlyUsedConfigs([...recentlyUsedConfigs]);
    setIsRenameModalOpened(false);
  };

  return (
    <>
      <h3 className="text-xl">Recently used configurations</h3>

      <Table<BrainConfig>
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
          render={(name, { id }: BrainConfig) => (
            <Link href={`${baseHref}?brainConfigId=${encodeURIComponent(id)}`}>{name}</Link>
          )}
        />
        <Column title="DESCRIPTION" dataIndex="description" key="description" />
        <Column title="CREATED BY" dataIndex="createdBy" key="createdBy" />
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
            brainConfig={brainConfig}
            open={isCloneModalOpened}
            onCancel={() => setIsCloneModalOpened(false)}
            onCloneSuccess={onCloneSuccess}
          />

          {isRenameModalOpened && (
            <RenameBrainConfigModal
              brainConfig={brainConfig}
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
