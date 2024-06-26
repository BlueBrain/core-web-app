import { ConfigProvider, Table } from 'antd';

export default function VirtualLabHistoryTable() {
  // mock data creation
  const dataSource = [...Array(10).keys()].map((x) => ({
    key: x,
    date: '12.02.2024',
    brainRegion: 'Ventral part of the lateral geniculate complex',
    type: 'Neuron morphology',
    createdBy: 'Georges Khazen',
  }));

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Brain region',
      dataIndex: 'brainRegion',
      key: 'brainRegion',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Created by',
      dataIndex: 'createdBy',
      key: 'createdBy',
    },
  ];

  return (
    <ConfigProvider
      theme={{
        components: {
          Table: {
            headerBg: '#000000',
            headerColor: '#8C8C8C',
            headerSplitColor: 'rgb(8,8,8)',
            bodySortBg: 'rgb(226, 25, 25)',
            colorBgContainer: 'rgb(0, 0, 0)',
            colorText: '#FFFFFF',
            borderColor: '#8C8C8C',
            cellPaddingInline: 0,
          },
        },
      }}
    >
      <Table dataSource={dataSource} columns={columns} pagination={false} />
    </ConfigProvider>
  );
}
