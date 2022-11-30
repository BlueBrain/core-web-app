'use client';

import { useState } from 'react';
import { Table, Button, ConfigProvider } from 'antd';
import { useRouter } from 'next/navigation';

import { modalTheme } from './antd-theme';
import { RECENTLY_USED_CONFIGS } from './placeholder-data';
import CloneBrainConfigModal from './CloneBrainConfigModal';
import Link from '@/components/Link';
import EditIcon from '@/components/icons/Edit';
import CloneIcon from '@/components/icons/Clone';

const { Column } = Table;

type RecentConfigListProps = {
  baseHref: string;
};

export default function RecentConfigList({ baseHref }: RecentConfigListProps) {
  const router = useRouter();

  const [brainConfigId, setBrainConfigId] = useState<string>();
  const [isCloneModalOpened, setIsCloneModalOpened] = useState<boolean>(false);

  const openModal = (currentBrainConfigId: string) => {
    setBrainConfigId(currentBrainConfigId);
    setIsCloneModalOpened(true);
  };

  const onCloneSuccess = (clonedBrainConfigId: string) => {
    router.push(`${baseHref}?brainConfigId=${encodeURIComponent(clonedBrainConfigId)}`);
  };

  return (
    <>
      <h3 className="text-xl">Recently used configurations</h3>

      <Table
        size="small"
        className="mt-6 mb-12"
        dataSource={RECENTLY_USED_CONFIGS}
        pagination={false}
        rowKey="id"
      >
        <Column title="NAME" dataIndex="name" key="name" />
        <Column title="DESCRIPTION" dataIndex="description" key="description" />
        <Column title="CREATED BY" dataIndex="createdBy" key="createdBy" />
        <Column
          title=""
          key="actions"
          width={86}
          render={(config) => (
            <>
              <Link href={`${baseHref}?brainConfigId=${encodeURIComponent(config.name)}`}>
                <Button size="small" type="text" className="inline-block mr-2">
                  <EditIcon />
                </Button>
              </Link>

              <Button
                size="small"
                type="text"
                className="inline-block"
                onClick={() => openModal(config.name)}
              >
                <CloneIcon />
              </Button>
            </>
          )}
        />
      </Table>

      {brainConfigId && (
        <ConfigProvider theme={modalTheme}>
          <CloneBrainConfigModal
            brainConfigId={brainConfigId}
            open={isCloneModalOpened}
            onCancel={() => setIsCloneModalOpened(false)}
            onCloneSuccess={onCloneSuccess}
          />
        </ConfigProvider>
      )}
    </>
  );
}
