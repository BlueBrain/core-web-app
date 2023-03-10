'use client';

import { Table } from 'antd';
import { useAtomValue } from 'jotai';
import { ColumnProps } from 'antd/es/table';
import { format, parseISO } from 'date-fns';
import { EphysResource } from '@/types/observatory';
import Sidebar from '@/components/observatory/Sidebar';
import { dataAtom } from '@/state/ephys';
import EphysSearch from '@/components/observatory/ephys/EphysSearch';
import LoadMoreButton from '@/components/observatory/ephys/LoadMoreButton';
import { sorter, dateStringToUnix } from '@/util/common';
import styles from '@/app/observatory/observatory.module.scss';

const columHeader = (text: string) => <div className={styles.tableHeader}>{text}</div>;

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

export default function ExperimentalDataList() {
  const data = useAtomValue(dataAtom);

  return (
    <div className="flex min-h-screen" style={{ background: '#d1d1d1' }}>
      <Sidebar />
      <section className="w-full">
        <div className="flex py-8">
          <div className="ml-10 text-primary-7 text-2xl font-bold flex-auto w-10/12">
            Experimental Data
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
                className={styles.table}
                pagination={false}
              />
              <LoadMoreButton />
            </>
          )}
        </div>
      </section>
    </div>
  );
}
