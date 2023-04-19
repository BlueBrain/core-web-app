'use client';

import { ColumnProps } from 'antd/es/table';
import { format, parseISO } from 'date-fns';
import isNumber from 'lodash/isNumber';
import Sidebar from '@/components/explore-section/Sidebar';
import { ExploreSectionResource } from '@/types/explore-section';
import { dateStringToUnix, sorter, formatNumber } from '@/util/common';
import Link from '@/components/Link';
import ExploreSectionListingView from '@/components/ExploreSectionListingView';
import createListViewAtoms from '@/state/explore-section/list-atoms-constructor';
import styles from '@/app/explore/explore.module.scss';

const TYPE = 'https://neuroshapes.org/NeuronDensity';

const { pageSizeAtom, searchStringAtom, filtersAtom, dataAtom, totalAtom, aggregationsAtom } =
  createListViewAtoms({
    type: TYPE,
  });

const columHeader = (text: string) => <div className={styles.tableHeader}>{text}</div>;

const columns: ColumnProps<ExploreSectionResource>[] = [
  {
    title: columHeader('Brain Region'),
    dataIndex: 'brainRegion',
    key: 'brainRegion',
    className: 'text-primary-7 ',
    sorter: (a, b) => sorter(a.brainRegion, b.brainRegion),
  },
  {
    title: columHeader('Mean ± STD (Neurons / MM³'),
    dataIndex: 'neuronDensity',
    key: 'neuronDensity',
    className: 'text-primary-7',
    render: (data) => <span>{isNumber(data?.value) ? formatNumber(data?.value) : ''}</span>,
    sorter: (a, b) => sorter(a.neuronDensity?.value, b.neuronDensity?.value),
  },
  {
    title: columHeader('M-Type'),
    dataIndex: 'mtype',
    key: 'mtype',
    className: 'text-primary-7 ',
    sorter: (a, b) => sorter(a.mtype, b.mtype),
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
    render: (text, record) => <Link href={`/explore/neuron-density/${record.key}`}>{text}</Link>,
    sorter: (a, b) => sorter(a.name, b.name),
  },
  {
    title: columHeader('Specie'),
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

export default function NeuronDensity() {
  return (
    <div className="flex min-h-screen" style={{ background: '#d1d1d1' }}>
      <Sidebar />
      <ExploreSectionListingView
        title="Neuron Density"
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
