'use client';

import { ColumnProps } from 'antd/es/table';
import { format, parseISO } from 'date-fns';
import isNumber from 'lodash/isNumber';
import Sidebar from '@/components/explore-section/Sidebar';
import { ExploreSectionResource } from '@/types/explore-section';
import { dateStringToUnix, sorter, formatNumber } from '@/util/common';
import Link from '@/components/Link';
import ExploreSectionListingView from '@/components/explore-section/ExploreSectionListingView';
import createListViewAtoms from '@/state/explore-section/list-atoms-constructor';
import styles from '@/app/explore/explore.module.scss';

const TYPE = 'https://neuroshapes.org/BoutonDensity';

const { pageSizeAtom, searchStringAtom, filtersAtom, dataAtom, totalAtom, aggregationsAtom } =
  createListViewAtoms({
    type: TYPE,
  });

const columHeader = (text: string) => <div className={styles.tableHeader}>{text}</div>;

const columns: ColumnProps<ExploreSectionResource>[] = [
  {
    title: columHeader('#'),
    key: 'index',
    className: 'text-primary-7',
    render: (text: string, record: any, index: number) => index + 1,
  },
  {
    title: columHeader('Brain region'),
    dataIndex: 'brainRegion',
    key: 'brainRegion',
    className: 'text-primary-7 ',
    render: (text, record) => <Link href={`/explore/bouton-density/${record.key}`}>{text}</Link>,
    sorter: (a, b) => sorter(a.brainRegion, b.brainRegion),
  },
  {
    title: columHeader('M-Type'),
    dataIndex: 'mtype',
    key: 'mtype',
    className: 'text-primary-7 ',
    sorter: (a, b) => sorter(a.mtype, b.mtype),
  },
  {
    title: (
      <div className={styles.headerText}>MEAN ± STD (boutons / {String.fromCharCode(956)}m)</div>
    ),
    dataIndex: 'boutonDensity',
    key: 'boutonDensity',
    className: 'text-primary-7',
    render: (data) => <span>{isNumber(data?.value) ? formatNumber(data?.value) : ''}</span>,
    sorter: (a, b) => sorter(a.boutonDensity?.value, b.boutonDensity?.value),
  },
  {
    title: columHeader('SEM'),
    dataIndex: 'sem',
    key: 'sem',
    className: 'text-primary-7 ',
    sorter: (a, b) => sorter(a.sem, b.sem),
  },
  {
    title: columHeader('Nº of cells'),
    dataIndex: 'ncells',
    key: 'ncells',
    className: 'text-primary-7 ',
    sorter: (a, b) => sorter(a.ncells, b.ncells),
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
  {
    title: columHeader('Reference'),
    dataIndex: 'reference',
    key: 'reference',
    className: 'text-primary-7 ',
    sorter: (a, b) => sorter(a.reference, b.reference),
  },
];

export default function BoutonDensity() {
  return (
    <div className="flex min-h-screen" style={{ background: '#d1d1d1' }}>
      <Sidebar />
      <ExploreSectionListingView
        title="Bouton densities"
        totalAtom={totalAtom}
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
