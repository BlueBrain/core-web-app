import { ConfigProvider, Table } from 'antd';
import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';

import { ActivityColumn, RowItem } from './types';
import { MEModelResource } from '@/types/me-model';
import { notValidatedMEModelsAtom } from '@/state/virtual-lab/activity';
import timeElapsedFromToday from '@/util/date';
import Link from '@/components/Link';

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

const columns: ActivityColumn[] = [
  {
    title: 'Scale',
    dataIndex: 'scale',
    key: 'scale',
  },
  {
    title: 'Type',
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: 'Section',
    dataIndex: 'section',
    key: 'section',
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: 'Date',
    dataIndex: 'date',
    key: 'date',
  },
  {
    title: 'Actions',
    render: (data) => {
      const url = `/build/me-model/summary?meModelId=${data.key}`;
      return <Link href={url}>{LinkIcon}</Link>;
    },
  },
];

export default function TableStatuses() {
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState<RowItem[]>([]);
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
        components: {
          Table: {
            headerBg: '#002766',
            headerColor: '#69C0FF',
            headerSplitColor: '#002766',
            bodySortBg: 'rgb(226, 25, 25)',
            colorBgContainer: '#002766',
            colorText: '#FFFFFF',
            borderColor: '#8C8C8C',
            cellPaddingInline: 0,
          },
        },
      }}
    >
      <Table dataSource={dataSource} columns={columns} pagination={false} loading={loading} />
    </ConfigProvider>
  );
}

function generateRowItem(meModels: MEModelResource[]): RowItem[] {
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
