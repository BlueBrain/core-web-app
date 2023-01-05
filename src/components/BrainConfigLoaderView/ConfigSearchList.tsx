'use client';

import { Table, Button } from 'antd';
import { useRouter } from 'next/navigation';
import { useAtomValue } from 'jotai';

import { brainModelConfigListAtom } from './state';
import useCloneModal from '@/hooks/brain-config-clone-modal';
import { collapseId } from '@/util/nexus';
import { BrainModelConfigResource } from '@/types/nexus';
import Link from '@/components/Link';
import CloneIcon from '@/components/icons/Clone';

const { Column } = Table;

function getSorterFn(sortProp: 'name' | 'description' | '_createdBy') {
  return (a: BrainModelConfigResource, b: BrainModelConfigResource) =>
    a[sortProp] < b[sortProp] ? 1 : -1;
}

type ConfigSearchListProps = {
  baseHref: string;
};

export default function ConfigSearchList({ baseHref }: ConfigSearchListProps) {
  const router = useRouter();
  const brainModelConfigs = useAtomValue(brainModelConfigListAtom);

  const { showModal, contextHolder } = useCloneModal();

  const showCloneModal = (currentConfig: BrainModelConfigResource) => {
    showModal(currentConfig, (clonedConfig) =>
      router.push(
        `${baseHref}?brainModelConfigId=${encodeURIComponent(collapseId(clonedConfig['@id']))}`
      )
    );
  };

  return (
    <>
      <Table<BrainModelConfigResource>
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
            <Button size="small" type="text" onClick={() => showCloneModal(config)}>
              <CloneIcon />
            </Button>
          )}
        />
      </Table>

      {contextHolder}
    </>
  );
}
