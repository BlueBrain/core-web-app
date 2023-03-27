import { Loadable } from 'jotai/vanilla/utils/loadable';
import { Spin, Table } from 'antd';
import { useRouter } from 'next/navigation';
import { ColumnProps } from 'antd/es/table';
import { LoadingOutlined } from '@ant-design/icons';
import { EphysResource, ObservatoryResource } from '@/types/observatory';
import styles from '@/app/observatory/observatory.module.scss';

type ObservatoryTableProps = {
  loadableData: Loadable<Promise<readonly (ObservatoryResource | EphysResource)[] | undefined>>;
  columns: ColumnProps<any>[];
};

export default function ObservatoryTable({ loadableData, columns }: ObservatoryTableProps) {
  const router = useRouter();

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
            router.push(`/observatory/morphology/${record.key}`);
          },
        })}
      />
    );
  }
  return <div>Something went wrong</div>;
}
