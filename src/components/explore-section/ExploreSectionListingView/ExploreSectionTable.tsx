'use client';

import { MouseEvent, useState, ReactNode, CSSProperties, useEffect } from 'react';
import { useAtomValue } from 'jotai';
import { Table } from 'antd';
import { useRouter } from 'next/navigation';
import { ColumnProps } from 'antd/es/table';
import { Loadable } from 'jotai/vanilla/utils/loadable';
import { VerticalAlignMiddleOutlined } from '@ant-design/icons';
import sessionAtom from '@/state/session';
import usePathname from '@/hooks/pathname';
import { to64 } from '@/util/common';
import { ESResponseRaw } from '@/types/explore-section/resources';
import fetchArchive from '@/api/archive';
import Spinner from '@/components/Spinner';
import { classNames } from '@/util/utils';
import styles from '@/app/explore/explore.module.scss';

type ExploreSectionTableProps = {
  data: Loadable<ESResponseRaw[] | undefined>;
  columns: ColumnProps<any>[];
  enableDownload?: boolean;
};

function CustomTH({
  children,
  style,
  onClick,
  handleResizing,
  ...props
}: {
  children: ReactNode;
  style: CSSProperties;
  onClick: () => void;
  handleResizing: () => void;
}) {
  const modifiedStyle = {
    ...style,
    fontWeight: '500',
    color: '#434343',
    verticalAlign: 'baseline',
  };

  return handleResizing ? (
    <th {...props} /* eslint-disable-line react/jsx-props-no-spreading */ style={modifiedStyle}>
      <div className="flex">
        <button
          className={classNames('flex items-top', styles.alignmentHack)}
          onClick={onClick}
          type="button"
        >
          {children}
        </button>
        <VerticalAlignMiddleOutlined className={styles.dragIcons} onMouseDown={handleResizing} />
      </div>
    </th>
  ) : (
    <th {...props} /* eslint-disable-line react/jsx-props-no-spreading */ style={modifiedStyle}>
      {children}
    </th>
  );
}

export default function ExploreSectionTable({
  data,
  columns,
  enableDownload,
}: ExploreSectionTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [fetching, setFetching] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<ESResponseRaw[] | undefined>(
    data.state === 'hasData' ? data.data : undefined
  );

  const clearSelectedRows = () => {
    setFetching(false);
    setSelectedRows([]);
  };
  const session = useAtomValue(sessionAtom);

  useEffect(() => {
    if (data.state === 'hasData') {
      setDataSource(data.data);
    }
  }, [data]);

  const onCellRouteHandler = {
    onCell: (record: ESResponseRaw) => ({
      onClick: (e: MouseEvent<HTMLInputElement>) => {
        e.preventDefault();

        router.push(`${pathname}/${to64(`${record._source.project.label}!/!${record._id}`)}`);
      },
    }),
  };

  if (data.state === 'hasError') {
    return <div>Something went wrong</div>;
  }

  return (
    <>
      <Table
        className={styles.table}
        columns={columns.map((col, i) => ({
          ...col,
          ...(!(enableDownload && i === 0) && onCellRouteHandler),
        }))}
        dataSource={dataSource}
        loading={data.state === 'loading'}
        rowClassName={styles.tableRow}
        rowKey={(row) => row._source._self}
        rowSelection={
          enableDownload
            ? {
                selectedRowKeys: selectedRows.map(({ _source }) => _source._self),
                onChange: (_keys, rows) => setSelectedRows(rows),
                type: 'checkbox',
              }
            : undefined
        }
        pagination={false}
        components={{
          header: {
            cell: CustomTH,
          },
        }}
      />
      {session && selectedRows.length > 0 && (
        <div className="sticky bottom-0 flex justify-end">
          <button
            className="bg-primary-8 flex gap-2 items-center justify-between font-bold px-7 py-4 rounded-none text-white"
            onClick={() => {
              setFetching(true);

              fetchArchive(
                selectedRows.map((x) => x._source._self),
                session,
                clearSelectedRows
              );
            }}
            type="button"
          >
            <span>{`Download ${selectedRows.length === 1 ? 'Resource' : 'Resources'} (${
              selectedRows.length
            })`}</span>
            {fetching && <Spinner className="h-6 w-6" />}
          </button>
        </div>
      )}
    </>
  );
}
