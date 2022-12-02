'use client';

import { useState } from 'react';
import { Table, Button, ConfigProvider } from 'antd';
import { useRouter } from 'next/navigation';

import { modalTheme } from './antd-theme';
import { PUBLIC_CONFIGS } from './placeholder-data';
import CloneBrainConfigModal from './CloneBrainConfigModal';
import Link from '@/components/Link';
import CloneIcon from '@/components/icons/Clone';

const { Column } = Table;

type BrainConfig = typeof PUBLIC_CONFIGS[number];

function getSorterFn(sortProp: keyof BrainConfig) {
  return (a: BrainConfig, b: BrainConfig) => (a[sortProp] < b[sortProp] ? 1 : -1);
}

type ConfigSearchListProps = {
  baseHref: string;
};

export default function ConfigSearchList({ baseHref }: ConfigSearchListProps) {
  const router = useRouter();

  const [brainConfig, setBrainConfig] = useState<BrainConfig>();
  const [isCloneModalOpened, setIsCloneModalOpened] = useState<boolean>(false);

  const openModal = (currentBrainConfig: BrainConfig) => {
    setBrainConfig(currentBrainConfig);
    setIsCloneModalOpened(true);
  };

  const onCloneSuccess = (clonedBrainConfigId: string) => {
    router.push(`${baseHref}?brainConfigId=${encodeURIComponent(clonedBrainConfigId)}`);
  };

  return (
    <>
      <Table<BrainConfig>
        size="small"
        className="mt-6 mb-12"
        dataSource={PUBLIC_CONFIGS}
        pagination={false}
        rowKey="id"
      >
        <Column
          title="NAME"
          dataIndex="name"
          key="name"
          sorter={getSorterFn('name')}
          render={(name, { id }: BrainConfig) => (
            <Link href={`${baseHref}?brainConfigId=${encodeURIComponent(id)}`}>{name}</Link>
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
          dataIndex="createdBy"
          key="createdBy"
          sorter={getSorterFn('createdBy')}
        />
        <Column
          title=""
          key="actions"
          width={86}
          render={(_, config: BrainConfig) => (
            <Button size="small" type="text" onClick={() => openModal(config)}>
              <CloneIcon />
            </Button>
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
        </ConfigProvider>
      )}
    </>
  );
}
