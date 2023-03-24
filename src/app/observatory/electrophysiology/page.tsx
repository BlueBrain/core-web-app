'use client';

import { ColumnProps } from 'antd/es/table';
import { format, parseISO } from 'date-fns';
import { EphysResource } from '@/types/observatory';
import Sidebar from '@/components/observatory/Sidebar';
import Link from '@/components/Link';
import {
  aggregationsAtom,
  dataAtom,
  filtersAtom,
  pageSizeAtom,
  searchStringAtom,
} from '@/state/observatory/ephys';
import { sorter, dateStringToUnix } from '@/util/common';
import ObservatoryListingView from '@/components/ObservatoryListingView';
import styles from '@/app/observatory/observatory.module.scss';

const columHeader = (text: string) => <div className={styles.tableHeader}>{text}</div>;

const columns: ColumnProps<EphysResource>[] = [
  {
    title: columHeader('Brain Region'),
    dataIndex: 'brainRegion',
    key: 'brainRegion',
    className: 'text-primary-7 ',
    sorter: (a, b) => sorter(a.brainRegion, b.brainRegion),
  },
  {
    title: columHeader('E-Type'),
    dataIndex: 'etype',
    key: 'etype',
    className: 'text-primary-7 ',
    sorter: (a, b) => sorter(a.etype, b.etype),
  },
  {
    title: columHeader('Data'),
    dataIndex: 'name',
    key: 'name',
    className: 'text-primary-7 ',
    render: (text, record) => (
      <Link href={`/observatory/electrophysiology/${record.key}`}>{text}</Link>
    ),
    sorter: (a, b) => sorter(a.name, b.name),
  },
  {
    title: columHeader('Species'),
    dataIndex: 'subjectSpecies',
    key: 'subjectSpecies',
    className: 'text-primary-7 ',
    sorter: (a, b) => sorter(a.subjectSpecies, b.subjectSpecies),
  },
  {
    title: columHeader('Contributor'),
    dataIndex: 'contributor',
    key: 'contributor',
    className: 'text-primary-7 ',
    sorter: (a, b) => sorter(a.contributor, b.contributor),
  },
  {
    title: columHeader('Date'),
    dataIndex: 'createdAt',
    key: 'createdAt',
    className: 'text-primary-7 ',
    render: (text) => <>{format(parseISO(text), 'dd.MM.yyyy')}</>,
    sorter: (a, b) => sorter(dateStringToUnix(a.createdAt), dateStringToUnix(b.createdAt)),
  },
];

function EphysListPage() {
  return (
    <div className="flex min-h-screen" style={{ background: '#d1d1d1' }}>
      <Sidebar />
      <ObservatoryListingView
        title="Electrophysiology Data"
        columns={columns}
        dataAtom={dataAtom}
        pageSizeAtom={pageSizeAtom}
        searchStringAtom={searchStringAtom}
        aggregationsAtom={aggregationsAtom}
        filtersAtom={filtersAtom}
      />
    </div>
  );
}

export default EphysListPage;
