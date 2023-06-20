import { MouseEvent, useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import { Table } from 'antd';
import { useRouter } from 'next/navigation';
import { ColumnProps } from 'antd/es/table';
import { Loadable } from 'jotai/vanilla/utils/loadable';
import sessionAtom from '@/state/session';
import usePathname from '@/hooks/pathname';
import { to64 } from '@/util/common';
import { ExploreSectionResource, ESResponseRaw } from '@/types/explore-section/resources';
import fetchArchive from '@/api/archive';
import Spinner from '@/components/Spinner';
import styles from '@/app/explore/explore.module.scss';

type ExploreSectionTableProps = {
  data: Loadable<ExploreSectionResource[] | undefined>;
  columns: ColumnProps<any>[];
  enableDownload?: boolean;
};

export default function ExploreSectionTable({
  data,
  columns,
  enableDownload,
}: ExploreSectionTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [fetching, setFetching] = useState<boolean>(false);
  const clearSelectedRows = () => {
    setFetching(false);
    setSelectedRows([]);
  };
  const session = useAtomValue(sessionAtom);
  const [dataSource, setDataSource] = useState<ExploreSectionResource[] | undefined>();

  useEffect(() => {
    if (data.state === 'hasData') {
      setDataSource(data.data);
    }
  }, [data]);

  const onCellRouteHandler = {
    onCell: (record: ESResponseRaw | ESResponseRaw) => ({
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
        rowKey="_id"
        rowSelection={
          enableDownload
            ? {
                selectedRowKeys: selectedRows.map(({ key }) => key),
                onChange: (_keys, rows) => setSelectedRows([...rows]),
                type: 'checkbox',
              }
            : undefined
        }
        pagination={false}
      />
      {session && selectedRows.length > 0 && (
        <div className="sticky bottom-0 flex justify-end">
          <button
            className="bg-primary-8 flex gap-2 items-center justify-between font-bold px-7 py-4 rounded-none text-white"
            onClick={() => {
              setFetching(true);

              fetchArchive(
                selectedRows.map((x) => x.self),
                session,
                clearSelectedRows
              );
            }}
            type="button"
          >
            <span>Download Resources ({selectedRows.length})</span>
            {fetching && <Spinner className="h-6 w-6" />}
          </button>
        </div>
      )}
    </>
  );
}
