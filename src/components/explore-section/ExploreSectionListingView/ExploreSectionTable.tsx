import { useState } from 'react';
import { useAtomValue } from 'jotai';
import { Loadable } from 'jotai/vanilla/utils/loadable';
import { Table } from 'antd';
import { useRouter } from 'next/navigation';
import { ColumnProps } from 'antd/es/table';
import sessionAtom from '@/state/session';
import usePathname from '@/hooks/pathname';
import { ExploreSectionResource } from '@/types/explore-section';
import CentralLoadingSpinner from '@/components/CentralLoadingSpinner';
import fetchArchive from '@/api/archive';
import Spinner from '@/components/Spinner';
import styles from '@/app/explore/explore.module.scss';

type ExploreSectionTableProps = {
  loadableData: Loadable<Promise<readonly ExploreSectionResource[] | undefined>>;
  columns: ColumnProps<any>[];
  enableDownload?: boolean;
};

export default function ExploreSectionTable({
  loadableData,
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

  if (loadableData.state === 'loading') {
    return <CentralLoadingSpinner />;
  }

  if (loadableData.state === 'hasData') {
    return (
      <>
        <Table
          rowKey="key"
          dataSource={loadableData.data}
          columns={columns}
          rowClassName={styles.tableRow}
          rowSelection={
            enableDownload
              ? {
                  selectedRowKeys: selectedRows.map(({ key }) => key),
                  onChange: (_keys, rows) => setSelectedRows([...rows]),
                  type: 'checkbox',
                }
              : undefined
          }
          className={styles.table}
          pagination={false}
          onRow={(record) => ({
            onClick: (e) => {
              e.preventDefault();
              router.push(`${pathname}/${record.key}`);
            },
          })}
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

  return <div>Something went wrong</div>;
}
