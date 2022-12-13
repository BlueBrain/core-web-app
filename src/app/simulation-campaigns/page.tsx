'use client';

import { useEffect, useState, useMemo } from 'react';
import { Table, Tag, Input } from 'antd';
import { useRouter } from 'next/navigation';
import { ColumnProps } from 'antd/es/table';
import { useSession } from 'next-auth/react';

import moment from 'moment';
import Link from '@/components/Link';
import { Campaign } from '@/types/nexus';
import styles from '../observatory/observatory.module.scss';
import tableStyles from './table.module.scss';

const { Search } = Input;

const QueryBase = {
  track_total_hits: true,
  size: 200,
  from: 0,
  query: {
    bool: {
      filter: {
        bool: {
          should: [
            {
              term: {
                '@type.keyword':
                  'https://bbp.epfl.ch/ontologies/core/bmo/SimulationCampaignConfiguration',
              },
            },
          ],
        },
      },
      must: {
        match_all: {},
      },
    },
  },
};
export default function Observatory() {
  const router = useRouter();
  const { data: session } = useSession();
  const [results, setResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const searchQuery = useMemo(
    () => ({
      query: {
        multi_match: { query: searchTerm, prefix_length: 0, fields: ['*'] },
      },
    }),
    [searchTerm]
  );

  useEffect(() => {
    async function fetchSimCampaigns() {
      if (!session?.user) return;
      const query = searchTerm ? { ...QueryBase, ...searchQuery } : QueryBase;

      const simCampaignResponse = await fetch(
        'https://staging.nise.bbp.epfl.ch/nexus/v1/search/query',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.accessToken}`,
          },
          body: JSON.stringify(query),
        }
      );

      const simCampaigns = await simCampaignResponse.json();
      const data = simCampaigns.hits.hits.map((item: any) => ({
        key: btoa(item._id),
        name: item._source.name,
        description: item._source.description,
        id: btoa(item._id),
        self: btoa(item._source._self),
        startedAt: item._source.startedAt,
        createdAt: item._source.createdAt,
        dimensions: 'palceholder, dimensions',
        attributes: 'lorem ipsum attrs',
        tags: ['mtype', 'xtype', 'placeholder-tag'],
      }));

      setResults(data);
    }

    fetchSimCampaigns();
  }, [session, searchTerm, searchQuery]);

  const columHeader = (text: string) => <div className={styles['table-header']}>{text}</div>;

  const onSearch = (value: string) => setSearchTerm(value);

  const sorter = (a: any, b: any) =>
    Number.isNaN(a) && Number.isNaN(b) ? (a || '').localeCompare(b || '') : a - b;

  const columns: ColumnProps<Campaign>[] = [
    {
      title: columHeader('Name'),
      dataIndex: 'name',
      key: 'name',
      sortDirections: ['descend', 'ascend'],
      render: (text) => <div className="font-bold text-primary-7">{text}</div>,
      sorter: (a, b) => sorter(a.name, b.name),
    },
    {
      title: columHeader('Description'),
      dataIndex: 'description',
      key: 'description',
      render: (text) => <div className="text-primary-7">{text}</div>,
      sorter: true,
      ellipsis: true,
    },
    {
      title: columHeader('Configuration'),
      dataIndex: 'configuration',
      key: 'configuration',
      render: (text) => <div className="text-primary-7">{text}</div>,
      sorter: true,
    },
    {
      title: columHeader('Dimensions'),
      dataIndex: 'dimensions',
      key: 'dimensions',
      render: (text) => <div className="text-primary-7">{text}</div>,
      sorter: true,
    },
    {
      title: columHeader('StartedAt'),
      dataIndex: 'startedAt',
      key: 'startedAt',
      render: (text) => <div className="text-primary-7">{moment(text).format('MMM Do YY')}</div>,
      sorter: (a, b) => moment(a.startedAt).unix() - moment(b.startedAt).unix(),
    },
    {
      title: columHeader('CreatedAt'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => <div className="text-primary-7">{moment(text).format('MMM Do YY')}</div>,
      sorter: (a, b) => moment(a.createdAt).unix() - moment(b.createdAt).unix(),
    },
    {
      title: columHeader('Attributes'),
      dataIndex: 'attributes',
      key: 'attributes',
      render: (text) => <div className="text-primary-7">{text}</div>,
      sorter: true,
    },

    {
      title: columHeader('Tags'),
      dataIndex: 'tags',
      key: 'tags',
      render: (v: string[]) => (
        <>
          {v.map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </>
      ),
      sorter: true,
    },
  ];

  return (
    <div className="flex min-h-screen" style={{ background: '#d1d1d1' }}>
      <div className="bg-primary-9 text-light w-10">
        <Link
          href="/observatory"
          className="block text-sm"
          style={{ transform: 'translate(-37%, 100px) rotate(-90deg)', width: 'max-content' }}
        >
          Simulation Observatory
        </Link>
      </div>
      <section className="w-full">
        <div className="flex py-8">
          <div className="ml-10 text-primary-7 text-2xl font-bold flex-auto w-10/12">
            Simulation Campaigns
          </div>
          <div className="mr-10">
            <Search
              allowClear
              size="large"
              onSearch={onSearch}
              className="bg-primary-7"
              enterButton="Search"
            />
          </div>
        </div>
        <div
          className="bg-white w-full h-80 overflow-scroll"
          style={{ height: 'calc(100vh - 100px)' }}
        >
          <Table
            className={tableStyles.container}
            dataSource={results}
            rowClassName={styles['table-row']}
            columns={columns}
            pagination={{ total: 200 }}
            onRow={(record) => ({
              onClick: (e) => {
                e.preventDefault();
                router.push(`/simulation-campaigns/${record.self}`);
              },
            })}
          />
        </div>
      </section>
    </div>
  );
}
