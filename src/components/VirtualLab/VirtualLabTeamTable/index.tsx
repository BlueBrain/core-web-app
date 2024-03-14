'use client';

import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { ConfigProvider, Select, Table } from 'antd';

type Role = 'administrator' | 'member';

type Member = {
  key: string;
  name: string;
  lastActive: string;
  role: Role;
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
      render: (_: any, record: Member) => {
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
    {
      title: 'Action',
      key: 'role',
      dataIndex: 'role',
      render: (role: Role) => (
        <ConfigProvider
          theme={{
            components: {
              Select: {
                colorBgContainer: '#002766',
                colorBgElevated: '#002766',
                colorBorder: 'rgba(255, 255, 255, 0)',
                colorText: 'rgb(255, 255, 255)',
                optionSelectedBg: '#002766',
              },
            },
          }}
        >
          <Select
            suffixIcon={<DownOutlined style={{ color: 'white' }} />}
            defaultValue={role}
            style={{ width: 200 }}
            onChange={() => {}}
            options={[
              { value: 'administrator', label: 'Administrator' },
              { value: 'member', label: 'Member' },
            ]}
          />
        </ConfigProvider>
      ),
    },
  ];

  return (
    <div className="my-10">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <span>Total members</span>
          <span className="font-bold">11</span>
        </div>
        <div role="button" className="flex w-[150px] justify-between border border-primary-7 p-3">
          <span className="font-bold">Invite member</span>
          <PlusOutlined />
        </div>
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
