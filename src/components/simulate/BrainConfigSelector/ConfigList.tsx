import { useState, useEffect } from 'react';
import { Table, ConfigProvider } from 'antd';
import { useAtomValue } from 'jotai';
import { loadable } from 'jotai/utils';

import { brainModelConfigListAtom } from '@/components/BrainConfigLoaderView/state';
import { BrainModelConfigResource } from '@/types/nexus';
import tableTheme from '@/components/BrainConfigLoaderView/antd-theme';

const { Column } = Table;

function getSorterFn(sortProp: 'name' | 'description' | '_createdBy') {
  return (a: BrainModelConfigResource, b: BrainModelConfigResource) =>
    a[sortProp] < b[sortProp] ? 1 : -1;
}

type Props = {
  onSelect: (selection: BrainModelConfigResource) => void;
};

const loadableBrainModelConfigListAtom = loadable(brainModelConfigListAtom);

export default function ConfigList({ onSelect }: Props) {
  const configsLoadable = useAtomValue(loadableBrainModelConfigListAtom);

  const [configs, setConfigs] = useState<BrainModelConfigResource[]>(
    configsLoadable.state === 'hasData' ? configsLoadable.data : []
  );

  useEffect(() => {
    if (configsLoadable.state !== 'hasData') return;

    setConfigs(configsLoadable.data);
  }, [configsLoadable]);

  return (
    <ConfigProvider theme={tableTheme}>
      <Table<BrainModelConfigResource>
        size="small"
        className="mt-6 mb-12"
        loading={configsLoadable.state === 'loading'}
        dataSource={configs}
        pagination={configs.length > 10 ? { defaultPageSize: 10 } : false}
        rowKey="@id"
        rowSelection={{
          type: 'radio',
          onSelect,
        }}
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
          dataIndex="_createdBy"
          key="createdBy"
          sorter={getSorterFn('_createdBy')}
          render={(createdBy) => createdBy.split('/').reverse()[0]}
        />
      </Table>
    </ConfigProvider>
  );
}
