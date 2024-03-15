'use client';

import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { ConfigProvider, Select, Table } from 'antd';
import { Member, Role } from './types';
import { mockMembers } from './mockData';

export default function VirtualLabTeamTable() {
  const getInitials = (name: string) => {
    const splitted = name.split(' ');
    return splitted.length > 1 ? `${splitted[0][0]}${splitted[1][0]}` : splitted[0][0];
  };

  const generateRandomHexColor = () => {
    // Generating random RGB values
    const red = Math.floor(Math.random() * 256);
    const green = Math.floor(Math.random() * 256);
    const blue = Math.floor(Math.random() * 256);

    // Converting RGB to hexadecimal
    const hexRed = red.toString(16).padStart(2, '0');
    const hexGreen = green.toString(16).padStart(2, '0');
    const hexBlue = blue.toString(16).padStart(2, '0');

    // Concatenating hexadecimal values
    return `#${hexRed}${hexGreen}${hexBlue}`;
  };

  const columns = [
    {
      title: 'Icon',
      key: 'icon',
      dataIndex: 'name',
      render: (_: any, record: Member) => {
        return (
          <div
            style={{ backgroundColor: generateRandomHexColor() }}
            className={`flex h-12 w-12 items-center justify-center ${record.role === 'member' ? 'rounded-full' : ''}`}
          >
            <span className="text-2xl font-bold text-white">{getInitials(record.name)}</span>
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
          dataSource={mockMembers}
          pagination={false}
          columns={columns}
          showHeader={false}
        />
      </ConfigProvider>
    </div>
  );
}
