import { Table } from 'antd';
import { useRouter } from 'next/navigation';
import { ColumnProps } from 'antd/es/table';
import { Dimension } from '@/types/nexus';
import styles from '@/app/observatory/observatory.module.scss';

const columHeader = (text: string) => <div className={styles['table-header']}>{text}</div>;

const columns: ColumnProps<Dimension>[] = [
  {
    title: columHeader('Dimension values'),
    dataIndex: 'dimensionValues',
    key: 'dimesionValues',
    render: (text) => <div className="font-bold text-primary-7">{text}</div>,
  },
  {
    title: columHeader('Started at'),
    dataIndex: 'startedAt',
    key: 'startedAt',
    render: (text) => <div className="text-primary-7">{text}</div>,
  },
  {
    title: columHeader('Ended at'),
    dataIndex: 'endedAt',
    key: 'endedAt',
    render: (text) => <div className="text-primary-7">{text}</div>,
  },
  {
    title: columHeader('Status'),
    dataIndex: 'status',
    key: 'status',
    render: (text) => <div className="text-primary-7">{text}</div>,
  },
];

export default function DimensionFilter({ dimensions }: any) {
  const router = useRouter();
  return (
    <Table
      dataSource={dimensions}
      rowClassName={styles['table-row']}
      columns={columns}
      onRow={(record) => ({
        onClick: (e) => {
          e.preventDefault();
          router.push(`/simulations/${record.key}`);
        },
      })}
    />
  );
}
