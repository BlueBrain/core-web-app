import { ConfigProvider, Table } from 'antd';
import { useAtomValue } from 'jotai';
import { useEffect, useState, ReactNode } from 'react';

import { ActivityColumn, ActivityRecord, Status } from './types';
import { MEModelResource } from '@/types/me-model';
import { notValidatedMEModelsAtom } from '@/state/virtual-lab/activity';
import timeElapsedFromToday from '@/util/date';
import Link from '@/components/Link';
import FullCircleIcon from '@/components/icons/FullCircle';
import PartialCircleIcon from '@/components/icons/PartialCircle';
import TriangleIcon from '@/components/icons/Triangle';
import BrainIcon from '@/components/icons/Brain';
import { classNames } from '@/util/utils';

const LinkIcon = (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10.1891 5.55214L13.3543 8.85771C13.5486 9.06056 13.5486 9.38944 13.3543 9.59229L10.1891 12.8979C9.99486 13.1007 9.67994 13.1007 9.48571 12.8979C9.29147 12.695 9.29147 12.3661 9.48571 12.1633L11.8019 9.74442L4.05 9.74442V8.70558H11.8019L9.48571 6.28671C9.29147 6.08386 9.29147 5.75498 9.48571 5.55213C9.67994 5.34929 9.99486 5.34929 10.1891 5.55214Z"
      fill="#91D5FF"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M17.1 0.9H0.9V17.1H17.1V0.9ZM0 0V18H18V0H0Z"
      fill="#91D5FF"
    />
  </svg>
);

const statusToColorMap: { [key in Status]: string } = {
  initalized: 'text-white',
  processing: 'text-primary-2',
  running: 'text-primary-2',
  error: 'text-error',
  done: 'text-secondary-5',
  default: 'text-light',
};

const statusToIcon: { [key in Status]: ReactNode | null } = {
  initalized: null,
  processing: <PartialCircleIcon className="mr-2" />,
  running: <PartialCircleIcon className="mr-2" />,
  error: <TriangleIcon className="mr-2" />,
  done: <FullCircleIcon className="mr-2" />,
  default: null,
};

const columns: ActivityColumn[] = [
  {
    title: 'Scale',
    dataIndex: 'scale',
    key: 'scale',
    render: (text, record) => (
      <span className={statusToColorMap[record.status] || statusToColorMap.default}>
        <BrainIcon />
      </span>
    ),
  },
  {
    title: 'Type',
    dataIndex: 'type',
    key: 'type',
    render: (text, record) => (
      <span className={statusToColorMap[record.status as Status] || statusToColorMap.default}>
        {text}
      </span>
    ),
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status) => {
      const icon = statusToIcon[status as Status] || statusToIcon.default;
      return (
        <span
          className={classNames(
            'flex items-center capitalize',
            statusToColorMap[status as Status] || statusToColorMap.default
          )}
        >
          {icon}
          {status}
        </span>
      );
    },
  },
  {
    title: 'Date',
    dataIndex: 'date',
    key: 'date',
    render: (text, record) => (
      <span className={statusToColorMap[record.status] || statusToColorMap.default}>{text}</span>
    ),
  },
  {
    title: 'Actions',
    dataIndex: 'key',
    key: 'key',
    render: (text) => {
      const url = `/build/me-model/summary?meModelId=${text}`;
      return <Link href={url}>{LinkIcon}</Link>;
    },
  },
];

export default function ActivityTable() {
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState<ActivityRecord[]>([]);
  const notValidatedMEModels = useAtomValue(notValidatedMEModelsAtom);

  useEffect(() => {
    if (!notValidatedMEModels) return;

    const rowItemData = generateRowItem(notValidatedMEModels);
    setDataSource(rowItemData);
    setLoading(false);
  }, [notValidatedMEModels]);

  return (
    <ConfigProvider
      theme={{
        hashed: false,
        components: {
          Table: {
            headerColor: '#69C0FF',
            headerSplitColor: 'transparent',
            bodySortBg: 'rgb(226, 25, 25)',
            colorBgContainer: '#002766',
            colorText: '#FFFFFF',
            borderColor: '#1890FF',
            cellPaddingInline: 0,
          },
        },
      }}
    >
      <Table
        className={classNames(
          '[&_.ant-table-tbody>tr:last-child>td]:border-b-0',
          '[&_.ant-table-thead>tr>th]:border-b-0'
        )}
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        loading={loading}
      />
    </ConfigProvider>
  );
}

function generateRowItem(meModels: MEModelResource[]): ActivityRecord[] {
  return meModels.map((item) => ({
    key: item['@id'],
    scale: 'TODO',
    type: 'Single cell',
    section: 'Build - Analysis',
    name: item.name,
    status: item.status,
    date: timeElapsedFromToday(item._createdAt),
  }));
}
