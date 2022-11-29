'use client';

import { useState } from 'react';
import { Table, Button, ConfigProvider } from 'antd';
import { useRouter } from 'next/navigation';

import { modalTheme } from './antd-theme';
import { PUBLIC_CONFIGS } from './placeholder-data';
import CloneBrainConfigModal from './CloneBrainConfigModal';
import CloneIcon from '@/components/icons/Clone';

const { Column } = Table;

type TableEntry = {
  name: string;
  description: string;
  createdBy: string;
  createdAt: string;
};

function getSorterFn(sortProp: keyof TableEntry) {
  return (a: TableEntry, b: TableEntry) => (a[sortProp] < b[sortProp] ? 1 : -1);
}

type ConfigSearchListProps = {
  baseHref: string;
};

export default function ConfigSearchList({ baseHref }: ConfigSearchListProps) {
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
      <Table
        size="small"
        className="mt-6 mb-12"
        dataSource={PUBLIC_CONFIGS}
        pagination={false}
        rowKey="id"
      >
        <Column title="NAME" dataIndex="name" key="name" sorter={getSorterFn('name')} />
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
          render={(brainConfig) => (
            <Button size="small" type="text" onClick={() => openModal(brainConfig.name)}>
              <CloneIcon />
            </Button>
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
