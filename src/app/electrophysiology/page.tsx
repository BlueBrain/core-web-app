'use client';

import { Suspense } from 'react';
import { Table, Spin } from 'antd';
import { useAtomValue } from 'jotai';
import { useRouter } from 'next/navigation';
import { ColumnProps } from 'antd/es/table';
import { format, parseISO } from 'date-fns';
import { LoadingOutlined } from '@ant-design/icons';
import { EphysResource } from '@/types/observatory';
import Sidebar from '@/components/observatory/Sidebar';
import Link from '@/components/Link';
import { dataAtom } from '@/state/ephys';
import EphysSearch from '@/components/observatory/ephys/EphysSearch';
import ControlPanel from '@/components/observatory/Filters';
import LoadMoreButton from '@/components/observatory/ephys/LoadMoreButton';
import { sorter, dateStringToUnix } from '@/util/common';
import styles from '@/app/observatory/observatory.module.scss';

const columHeader = (text: string) => <div className={styles.tableHeader}>{text}</div>;

const antIcon = (
  <LoadingOutlined
    style={{ fontSize: 54, display: 'table-cell', verticalAlign: 'middle', textAlign: 'center' }}
    spin
  />
);

const columns: ColumnProps<EphysResource>[] = [
  {
    title: columHeader('Brain Region'),
    dataIndex: 'brainRegion',
    key: 'brainRegion',
    className: 'text-primary-7 capitalize',
    sorter: (a, b) => sorter(a.brainRegion, b.brainRegion),
  },
  {
    title: columHeader('E-Type'),
    dataIndex: 'etype',
    key: 'etype',
    className: 'text-primary-7 capitalize',
    sorter: (a, b) => sorter(a.etype, b.etype),
  },
  {
    title: columHeader('Data'),
    dataIndex: 'name',
    key: 'name',
    className: 'text-primary-7 capitalize',
    render: (text, record) => <Link href={`/electrophysiology/${record.key}`}>{text}</Link>,
    sorter: (a, b) => sorter(a.name, b.name),
  },
  {
    title: columHeader('Species'),
    dataIndex: 'subjectSpecies',
    key: 'subjectSpecies',
    className: 'text-primary-7 capitalize',
    sorter: (a, b) => sorter(a.subjectSpecies, b.subjectSpecies),
  },
  {
    title: columHeader('Contributor'),
    dataIndex: 'contributor',
    key: 'contributor',
    className: 'text-primary-7 capitalize',
    sorter: (a, b) => sorter(a.contributor, b.contributor),
  },
  {
    title: columHeader('Date'),
    dataIndex: 'createdAt',
    key: 'createdAt',
    className: 'text-primary-7 capitalize',
    render: (text) => <>{format(parseISO(text), 'dd.MM.yyyy')}</>,
    sorter: (a, b) => sorter(dateStringToUnix(a.createdAt), dateStringToUnix(b.createdAt)),
  },
];

function EphysList() {
  const data = useAtomValue(dataAtom);
  const router = useRouter();

  return (
    <div className="flex min-h-screen" style={{ background: '#d1d1d1' }}>
      <Sidebar />
      <section className="w-full">
        <div className="flex py-8">
          <div className="ml-10 text-primary-7 text-2xl font-bold flex-auto w-10/12">
            Neuron Electrophysiology Data
          </div>
          <div className="mr-10">
            <EphysSearch />
          </div>
        </div>
        <div
          className="bg-white w-full h-80 overflow-scroll"
          style={{ height: 'calc(100vh - 100px)' }}
        >
          {data && (
            <>
              <Table
                rowKey="key"
                dataSource={data}
                columns={columns}
                rowClassName={styles.tableRow}
                className={styles.table}
                pagination={false}
                onRow={(record) => ({
                  onClick: (e) => {
                    e.preventDefault();
                    router.push(`/electrophysiology/${record.key}`);
                  },
                })}
              />
              <LoadMoreButton />
            </>
          )}
        </div>
      </section>
      <ControlPanel />
    </div>
  );
}

function EphysListPage() {
  return (
    <Suspense
      fallback={
        <Spin style={{ display: 'table', width: '100%', height: '100vh' }} indicator={antIcon} />
      }
    >
      <EphysList />
    </Suspense>
  );
}

export default EphysListPage;
