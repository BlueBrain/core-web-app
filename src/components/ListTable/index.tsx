import { CSSProperties, ReactNode, useEffect, useState } from 'react';
import { Loadable } from 'jotai/vanilla/utils/loadable';
import { ConfigProvider, Table } from 'antd';
import { ColumnProps } from 'antd/es/table';
import { isNumeric } from '@/util/common';
import { ESResponseRaw } from '@/types/explore-section/resources';
import { BrainIcon, InteractiveViewIcon, VirtualLabIcon } from '@/components/icons';
import { classNames } from '@/util/utils';
import styles from '@/components/ListTable/list-table.module.scss';

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

function formatColumn({ render, ...rest }: Column) {
  return {
    render: render || ColumnContent,
    ...rest,
  };
}

function CustomTable({ children, style, ...props }: { children: ReactNode; style: CSSProperties }) {
  return (
    <table
      style={{ ...style, borderSpacing: '0 14px' }}
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
        background: 'white',
        borderBottomStyle: 'none',
        borderStartStartRadius: '0px',
        borderStartEndRadius: '0px',
        color: '#8C8C8C',
        fontWeight: 400,
        overflowWrap: 'anywhere',
      }}
      {...props} /* eslint-disable-line react/jsx-props-no-spreading */
    >
      {children}
    </th>
  );
}

function CustomTD({
  children,
  className,
  style,
  ...props
}: {
  className: string;
  children: ReactNode;
  style: CSSProperties;
}) {
  return (
    <td
      {...props} /* eslint-disable-line react/jsx-props-no-spreading */
      className={classNames(className, styles.customTD)}
      style={{
        ...style,
        borderColor: '#D9D9D9',
        borderStyle: 'solid none solid none',
        borderWidth: '1px',
      }}
    >
      {children}
    </td>
  );
}

export function IndexColContent({ text }: { text: string }) {
  return (
    <div className="flex flex-col gap-5">
      <span className="font-bold">{text}</span>
      <div className="flex items-center gap-3">
        <span className="text-neutral-4 text-sm uppercase">Open in</span>
        <span className="border border-neutral-4 p-2 text-primary-7">
          <InteractiveViewIcon />
        </span>
        <span className="border border-neutral-4 p-2 text-primary-7">
          <BrainIcon />
        </span>
        <span className="border border-neutral-4 p-2 text-primary-7">
          <VirtualLabIcon />
        </span>
      </div>
    </div>
  );
}

export function ValueArray({ value }: { value?: string[] }) {
  return value ? (
    <div className="bg-neutral-1 flex font-semibold gap-2 px-2 py-1 rounded text-primary-8 w-fit">
      {value.map((x, i, arr) => (
        <span key={x}>{i < arr.length - 1 ? `${x},` : x}</span>
      ))}
    </div>
  ) : null;
}

export default function ListTable({
  columns,
  data,
}: {
  columns: ColumnProps<any>[];
  data: Loadable<ESResponseRaw[] | undefined>;
}) {
  const [dataSource, setDataSource] = useState<ESResponseRaw[] | undefined>(
    data.state === 'hasData' ? data.data : undefined
  );

  useEffect(() => {
    if (data.state === 'hasData') {
      setDataSource(data.data);
    }
  }, [data]);

  return (
    <ConfigProvider
      theme={{
        components: {
          Table: {
            colorBgContainer: '#fff',
            colorBorderSecondary: '#8C8C8C',
            colorText: '#0050B3',
          },
        },
      }}
    >
      <Table
        className="bg-transparant"
        columns={(columns as Column[]).map(formatColumn)}
        components={{
          table: CustomTable,
          header: {
            cell: CustomTH,
          },
          body: {
            cell: CustomTD,
          },
        }}
        dataSource={dataSource}
        loading={data.state === 'loading'}
        pagination={false}
        rowClassName="align-top bg-white rounded-md"
        rowKey={(row) => row._source._self}
        tableLayout="fixed"
      />
    </ConfigProvider>
  );
}
