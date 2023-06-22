import { CSSProperties, ReactNode } from 'react';
import { ConfigProvider, Table } from 'antd';
import { isNumeric } from '@/util/common';

type Column = {
  dataIndex: string | string[];
  label: string;
  key: string;
  render?: (text: string, record: any, index: number) => ReactNode;
};

function ColumnContent(text: string) {
  return isNumeric(text) ? (
    text
  ) : (
    <span className="bg-neutral-1 px-2 py-2 rounded-md text-center">{text}</span>
  );
}

function formatColumn({ dataIndex, label, key, render }: Column) {
  return {
    dataIndex: typeof dataIndex === 'string' ? dataIndex.split('.') : dataIndex,
    key,
    sorter: true,
    title: label,
    render: render || ColumnContent,
  };
}

function CustomTable({ children, style, ...props }: { children: ReactNode; style: CSSProperties }) {
  return (
    <table
      style={{ ...style, background: '#F5F5F5', borderSpacing: '0px 14px' }}
      {...props} /* eslint-disable-line react/jsx-props-no-spreading */
    >
      {children}
    </table>
  );
}

function CustomTH({ children, style, ...props }: { children: ReactNode; style: CSSProperties }) {
  return (
    <th
      style={{
        ...style,
        background: '#F5F5F5',
        borderStartStartRadius: '0px',
        borderStartEndRadius: '0px',
        color: '#8C8C8C',
        fontSize: '10px',
        fontWeight: 400,
        overflowWrap: 'anywhere',
      }}
      {...props} /* eslint-disable-line react/jsx-props-no-spreading */
    >
      {children}
    </th>
  );
}

export default function ListTable({
  columns,
  dataSource,
}: {
  columns: Column[];
  dataSource: Record<keyof typeof columns, any>;
}) {
  return (
    <ConfigProvider
      theme={{
        components: {
          Table: {
            colorBgContainer: 'white',
            colorText: '#0050B3',
          },
        },
      }}
    >
      <Table
        className="bg-transparant"
        columns={columns.map(formatColumn)}
        components={{
          table: CustomTable,
          header: {
            cell: CustomTH,
          },
        }}
        dataSource={dataSource}
        rowClassName="align-top bg-white rounded-md"
        tableLayout="fixed"
      />
    </ConfigProvider>
  );
}
