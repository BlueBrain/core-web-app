'use client';

import { ConfigProvider, Table } from 'antd';

type Member = {
  key: string;
  name: string;
  lastActive: string;
  role: 'administrator' | 'member';
};

export default function VirtualLabTeamTable() {
  const dataSource: Member[] = [
    {
      key: '1',
      name: 'Julian Budd',
      lastActive: 'Active 5 days ago',
      role: 'administrator',
    },
    {
      key: '2',
      name: 'Aleksandra Teska',
      lastActive: 'Active 5 days ago',
      role: 'member',
    },
  ];

  const columns = [
    {
      title: 'Icon',
      key: 'icon',
      dataIndex: 'name',
      render: (record: Member) => {
        return (
          <div
            className={`flex h-12 w-12 items-center justify-center bg-blue-500 ${record.role === 'member' ? 'rounded-full' : ''}`}
          >
            <span className="text-2xl font-bold text-white">AB</span>
          </div>
        );
      },
    },
    {
      title: 'name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => <span className="font-bold">{name}</span>,
    },
    {
      title: 'Last active',
      dataIndex: 'lastActive',
      key: 'lastActive',
      render: (lastActive: string) => <span className="text-primary-3">{lastActive}</span>,
    },
  ];

  return (
    <div>
      <div className="flex gap-2">
        <span>Total members</span>
        <span className="font-bold">11</span>
      </div>
      <ConfigProvider
        theme={{
          components: {
            Table: {
              colorBgContainer: 'rgba(255, 255, 255, 0)',
              colorText: '#FFFFFF',
              borderColor: 'rgba(255, 255, 255, 0)',
              cellPaddingInline: 0,
            },
          },
        }}
      >
        <Table
          bordered={false}
          dataSource={dataSource}
          pagination={false}
          columns={columns}
          showHeader={false}
        />
      </ConfigProvider>
    </div>
  );
}
