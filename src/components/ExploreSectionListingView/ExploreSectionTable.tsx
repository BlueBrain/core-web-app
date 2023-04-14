import { Loadable } from 'jotai/vanilla/utils/loadable';
import { Spin, Table } from 'antd';
import { useRouter } from 'next/navigation';
import { ColumnProps } from 'antd/es/table';
import { LoadingOutlined } from '@ant-design/icons';
import usePathname from '@/hooks/pathname';
import { ExploreSectionResource } from '@/types/explore-section';
import styles from '@/app/explore/explore.module.scss';

type ExploreSectionTableProps = {
  loadableData: Loadable<Promise<readonly ExploreSectionResource[] | undefined>>;
  columns: ColumnProps<any>[];
};

export default function ExploreSectionTable({ loadableData, columns }: ExploreSectionTableProps) {
  const router = useRouter();
  const pathname = usePathname();

  if (loadableData.state === 'loading') {
    return (
      <Spin
        style={{ display: 'table', width: '100%', height: '100vh' }}
        indicator={
          <LoadingOutlined
            style={{
              fontSize: 54,
              display: 'table-cell',
              verticalAlign: 'middle',
              textAlign: 'center',
            }}
            spin
          />
        }
      />
    );
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
