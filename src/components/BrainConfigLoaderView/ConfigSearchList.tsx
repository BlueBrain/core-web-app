'use client';

import { useState } from 'react';
import { Table, Button, ConfigProvider } from 'antd';
import { useRouter } from 'next/navigation';
import { useAtomValue } from 'jotai';

import { modalTheme } from './antd-theme';
import CloneBrainConfigModal from './CloneBrainConfigModal';
import { brainModelConfigListAtom } from './state';
import { collapseId } from '@/util/nexus';
import { BrainModelConfig } from '@/types/nexus';
import Link from '@/components/Link';
import CloneIcon from '@/components/icons/Clone';

const { Column } = Table;

function getSorterFn(sortProp: 'name' | 'description' | '_createdBy') {
  return (a: BrainModelConfig, b: BrainModelConfig) => (a[sortProp] < b[sortProp] ? 1 : -1);
}

type ConfigSearchListProps = {
  baseHref: string;
};

export default function ConfigSearchList({ baseHref }: ConfigSearchListProps) {
  const router = useRouter();
  const brainModelConfigs = useAtomValue(brainModelConfigListAtom);

  const [brainModelConfig, setBrainModelConfig] = useState<BrainModelConfig>();
  const [isCloneModalOpened, setIsCloneModalOpened] = useState<boolean>(false);

  const openModal = (currentConfig: BrainModelConfig) => {
    setBrainModelConfig(currentConfig);
    setIsCloneModalOpened(true);
  };

  const onCloneSuccess = (clonedBrainConfigId: string) => {
    router.push(
      `${baseHref}?brainModelConfigId=${encodeURIComponent(collapseId(clonedBrainConfigId))}`
    );
  };

  return (
    <>
      <Table<BrainModelConfig>
        size="small"
        className="mt-6 mb-12"
        dataSource={brainModelConfigs}
        pagination={false}
        rowKey="@id"
      >
        <Column
          title="NAME"
          dataIndex="name"
          key="name"
          sorter={getSorterFn('name')}
          render={(name, conf: BrainModelConfig) => (
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
          render={(_, config: BrainModelConfig) => (
            <Button size="small" type="text" onClick={() => openModal(config)}>
              <CloneIcon />
            </Button>
          )}
        />
      </Table>

      {brainModelConfig && (
        <ConfigProvider theme={modalTheme}>
          <CloneBrainConfigModal
            config={brainModelConfig}
            open={isCloneModalOpened}
            onCancel={() => setIsCloneModalOpened(false)}
            onCloneSuccess={onCloneSuccess}
          />
        </ConfigProvider>
      )}
    </>
  );
}
