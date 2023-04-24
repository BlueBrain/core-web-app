import { Loadable } from 'jotai/vanilla/utils/loadable';
import { Table } from 'antd';
import { useRouter } from 'next/navigation';
import { ColumnProps } from 'antd/es/table';
import usePathname from '@/hooks/pathname';
import { ExploreSectionResource } from '@/types/explore-section';
import CentralLoadingSpinner from '@/components/CentralLoadingSpinner';
import styles from '@/app/explore/explore.module.scss';

type ExploreSectionTableProps = {
  loadableData: Loadable<Promise<readonly ExploreSectionResource[] | undefined>>;
  columns: ColumnProps<any>[];
};

export default function ExploreSectionTable({ loadableData, columns }: ExploreSectionTableProps) {
  const router = useRouter();
  const pathname = usePathname();

  if (loadableData.state === 'loading') {
    return <CentralLoadingSpinner />;
  }

  if (loadableData.state === 'hasData') {
    return (
      <Table
        rowKey="key"
        dataSource={loadableData.data}
        columns={columns}
        rowClassName={styles.tableRow}
        className={styles.table}
        pagination={false}
        onRow={(record) => ({
          onClick: (e) => {
            e.preventDefault();
            router.push(`${pathname}/${record.key}`);
          },
        })}
      />
    );
  }
  return <div>Something went wrong</div>;
}
