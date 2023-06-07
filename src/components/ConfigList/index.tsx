import { Table, ConfigProvider } from 'antd';

import { TableRowSelection } from 'antd/lib/table/interface';
import { ReactNode } from 'react';
import tableTheme from './antd-theme';
import { DateISOString, SupportedConfigListTypes } from '@/types/nexus';
import timeElapsedFromToday from '@/util/date';

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
};

const dateTimeFormatOptions: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  hour12: false,
};

function dateRenderer(createdAtStr: DateISOString) {
  if (!createdAtStr) return null;

  const createdAt = new Date(createdAtStr);
  const tooltip = new Intl.DateTimeFormat('en-GB', dateTimeFormatOptions).format(createdAt);
  return <span title={tooltip}>{timeElapsedFromToday(createdAtStr)}</span>;
}

export default function ConfigList<T extends SupportedConfigListTypes>({
  configs,
  isLoading = true,
  rowSelection,
  nameRenderFn = (name) => name,
  children,
}: ConfigListProps<T>) {
  return (
    <ConfigProvider theme={tableTheme}>
      <Table<T>
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
        <Column
          title="CREATED AT"
          dataIndex="_createdAt"
          key="createdAt"
          width={140}
          sorter={getSorterFn('_createdAt')}
          render={dateRenderer}
        />
        {children}
      </Table>
    </ConfigProvider>
  );
}
