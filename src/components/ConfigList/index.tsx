import { Table, ConfigProvider } from 'antd';

import { TableRowSelection } from 'antd/lib/table/interface';
import { ReactNode } from 'react';
import tableTheme from './antd-theme';
import { BrainModelConfigResource } from '@/types/nexus';

const { Column } = Table;

function getSorterFn(sortProp: 'name' | 'description' | '_createdBy') {
  return (a: BrainModelConfigResource, b: BrainModelConfigResource) =>
    a[sortProp] < b[sortProp] ? 1 : -1;
}

type ConfigListProps = {
  configs: BrainModelConfigResource[];
  isLoading?: boolean;
  rowSelection?: TableRowSelection<BrainModelConfigResource>;
  nameRenderFn?: (name: string, config: BrainModelConfigResource) => ReactNode;
  children?: ReactNode;
};

export default function ConfigList({
  configs,
  isLoading = true,
  rowSelection,
  nameRenderFn = (name) => name,
  children,
}: ConfigListProps) {
  return (
    <ConfigProvider theme={tableTheme}>
      <Table<BrainModelConfigResource>
        size="small"
        className="mt-6 mb-12"
        loading={isLoading}
        dataSource={configs}
        pagination={configs.length > 10 ? { defaultPageSize: 10 } : false}
        rowKey="@id"
        rowSelection={rowSelection}
      >
        <Column
          title="NAME"
          dataIndex="name"
          key="name"
          sorter={getSorterFn('name')}
          render={nameRenderFn}
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
        {children}
      </Table>
    </ConfigProvider>
  );
}
