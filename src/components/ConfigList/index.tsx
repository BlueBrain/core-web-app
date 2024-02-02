import { Table, ConfigProvider } from 'antd';

import { TableRowSelection } from 'antd/lib/table/interface';
import { ReactNode } from 'react';
import tableTheme from './antd-theme';
import { DateISOString, SupportedConfigListTypes } from '@/types/nexus';
import { dateColumnInfoToRender } from '@/util/date';

const { Column } = Table;

function getSorterFn<T extends SupportedConfigListTypes>(
  sortProp: 'name' | 'description' | '_createdBy' | '_createdAt'
) {
  return (a: T, b: T) => (a[sortProp] < b[sortProp] ? 1 : -1);
}

type ConfigListProps<T> = {
  configs: T[];
  isLoading?: boolean;
  rowSelection?: TableRowSelection<T>;
  nameRenderFn?: (name: string, config: T) => ReactNode;
  children?: ReactNode;
  showCreationDate?: boolean;
  showCreatedBy?: boolean;
  rowClassName?: ((config: T) => string) | undefined | string;
};

const dateRenderer = (createdAtStr: DateISOString) => {
  const dateColumnInfo = dateColumnInfoToRender(createdAtStr);
  if (!dateColumnInfo) return null;

  return <span title={dateColumnInfo.tooltip}>{dateColumnInfo.text}</span>;
};

export default function ConfigList<T extends SupportedConfigListTypes>({
  configs,
  isLoading = true,
  rowSelection,
  nameRenderFn = (name) => name,
  children,
  showCreationDate = true,
  showCreatedBy = true,
  rowClassName = undefined,
}: ConfigListProps<T>) {
  return (
    <ConfigProvider theme={tableTheme}>
      <Table<T>
        size="small"
        className="mb-12 mt-6"
        loading={isLoading}
        dataSource={configs}
        pagination={configs.length > 10 ? { defaultPageSize: 10 } : false}
        rowKey="@id"
        rowSelection={rowSelection}
        rowClassName={rowClassName}
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
        {showCreatedBy && (
          <Column
            title="CREATED BY"
            dataIndex="_createdBy"
            key="createdBy"
            sorter={getSorterFn('_createdBy')}
            render={(createdBy) => createdBy.split('/').reverse()[0]}
          />
        )}
        {showCreationDate && (
          <Column
            title="DATE CREATED"
            dataIndex="_createdAt"
            key="createdAt"
            width={140}
            sorter={getSorterFn('_createdAt')}
            render={dateRenderer}
          />
        )}
        {children}
      </Table>
    </ConfigProvider>
  );
}
