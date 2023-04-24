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

const TYPE = 'https://neuroshapes.org/LayerThickness';

const { pageSizeAtom, searchStringAtom, filtersAtom, dataAtom, totalAtom, aggregationsAtom } =
  createListViewAtoms({
    type: TYPE,
  });

const columHeader = (text: string) => <div className={styles.tableHeader}>{text}</div>;

const columns: ColumnProps<ExploreSectionResource>[] = [
  {
    title: <div className={styles.headerText}>LAYER THICKNESS {String.fromCharCode(956)}m</div>,
    dataIndex: 'layerThickness',
    key: 'layerThickness',
    className: 'text-primary-7 ',
    render: (data) => <span>{isNumber(data) ? formatNumber(data) : ''}</span>,
    sorter: (a, b) => sorter(a.layerThickness, b.layerThickness),
  },
  {
    title: columHeader('Brain Region'),
    dataIndex: 'brainRegion',
    key: 'brainRegion',
    className: 'text-primary-7 ',
    render: (text, record) => <Link href={`/explore/layer-thickness/${record.key}`}>{text}</Link>,
    sorter: (a, b) => sorter(a.brainRegion, b.brainRegion),
  },
  {
    title: columHeader('Description'),
    dataIndex: 'description',
    key: 'description',
    className: 'text-primary-7 ',
    sorter: (a, b) => sorter(a.description, b.description),
  },
  {
    title: columHeader('Specie'),
    dataIndex: 'subjectSpecies',
    key: 'subjectSpecies',
    className: 'text-primary-7 ',
    sorter: (a, b) => sorter(a.subjectSpecies, b.subjectSpecies),
  },
  {
    title: columHeader('Subject Age'),
    dataIndex: 'subjectAge',
    key: 'subjectAge',
    className: 'text-primary-7 ',
    sorter: (a, b) => sorter(a.subjectAge, b.subjectAge),
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

export default function LayerThickness() {
  return (
    <div className="flex min-h-screen" style={{ background: '#d1d1d1' }}>
      <Sidebar />
      <ExploreSectionListingView
        title="Layer Thickness"
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
