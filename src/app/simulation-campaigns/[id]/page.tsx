'use client';

import { Table, Tag } from 'antd';
import { useRouter } from 'next/navigation';
import { ColumnProps } from 'antd/es/table';
import styles from '../../observatory/observatory.module.scss';
import Link from '@/components/Link';

interface Simulation {
  key: string;
  dimensionValues: string;
  startedAt: string;
  endedAt: string;
  status: string;
}

export default function Observatory() {
  const router = useRouter();
  const dataSource: Simulation[] = [
    {
      key: '1',
      dimensionValues: 'Dimension Values',
      startedAt: '4 days ago',
      endedAt: '3 days ago',
      status: 'Completed',
    },
    {
      key: '1',
      dimensionValues: 'Dimension Values',
      startedAt: '4 days ago',
      endedAt: '3 days ago',
      status: 'Completed',
    },
  ];

  const columHeader = (text: string) => <div className={styles['table-header']}>{text}</div>;

  const columns: ColumnProps<Simulation>[] = [
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

  return (
    <div className="flex h-screen" style={{ background: '#d1d1d1' }}>
      <div className="bg-primary-9 text-light w-10">
        <Link
          href="/observatory"
          className="block text-sm"
          style={{ transform: 'translate(-37%, 100px) rotate(-90deg)', width: 'max-content' }}
        >
          Simulation Observatory
        </Link>
      </div>
      <div className="bg-primary-8 text-light w-10">
        <Link
          href="/simulation-campaigns"
          className="block text-sm"
          style={{ transform: 'translate(-37%, 100px) rotate(-90deg)', width: 'max-content' }}
        >
          Simulation Campaign
        </Link>
      </div>

      <div className="w-full h-full flex flex-col">
        <div className="p-7 bg-white">
          <div className="text-xs text-primary-7">Simulation Campaign</div>
          <div className="font-bold text-xl text-primary-7">Campaign Name</div>
          <div className="flex justify-between mt-10">
            <div className="flex-1 text-primary-7 text-xs mr-4">
              <div className="uppercase text-neutral-4">Description</div>
              <div className="mt-3">
                Nunc mi ipsum faucibus vitae aliquet nec ullamcorper sit amet. Tincidunt vitae
                semper quis lectus nulla at. Volutpat ac tincidunt vitae semper. Adipiscing commodo
                elit at imperdiet dui accumsan
              </div>
            </div>

            <div className="flex-1 text-primary-7 text-xs mr-4">
              <div className="text-xs uppercase text-neutral-4">Brain Configuration</div>
              <div className="mt-3">Release 23.01</div>
            </div>
            <div className="flex-1 text-primary-7 text-xs mr-4">
              <div className="text-xs uppercase text-neutral-4">Dimensions</div>
              <div className="mt-3">
                <ul>
                  <li>Name of dimension 1</li>
                  <li>Name of dimension 2</li>
                  <li>Name of dimension 3</li>
                </ul>
              </div>
            </div>
            <div className="flex-1 text-primary-7 text-xs mr-4">
              <div className="text-xs uppercase text-neutral-4">Attribute</div>
              <div className="mt-3">Attribute</div>
            </div>
            <div className="flex-1 text-primary-7 text-xs mr-4">
              <div className="text-xs uppercase text-neutral-4">Tags</div>
              <div className="mt-3">
                <Tag>Tag 1</Tag>
                <Tag>Tag 2</Tag>
                <Tag>Tag 3</Tag>
                <Tag>Tag 4</Tag>
                <Tag>Tag 5</Tag>
                <Tag>Tag 6</Tag>
              </div>
            </div>
            <div className="flex-1 text-primary-7 text-xs mr-4">
              <div className="text-xs uppercase text-neutral-4">Status</div>
              <div className="mt-3">Done</div>
            </div>
          </div>
          <div className="flex  mt-10">
            <div className="text-primary-7 text-xs mr-10">
              <div className="text-xs uppercase text-neutral-4">User</div>
              <div className="mt-3">Polina Litvak</div>
            </div>
            <div className="text-primary-7 text-xs mr-4">
              <div className="text-xs uppercase text-neutral-4">Updated at</div>
              <div className="mt-3">4 days ago</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-7 text-primary-7 font-bold">
          Total simulations in campaign: 4000
        </div>
        <div className="bg-white w-full flex-1 pl-4">
          <Table
            dataSource={dataSource}
            rowClassName={styles['table-row']}
            columns={columns}
            onRow={(record) => ({
              onClick: (e) => {
                e.preventDefault();
                router.push(`/simulations/${record.key}`);
              },
            })}
          />
        </div>
      </div>
    </div>
  );
}
