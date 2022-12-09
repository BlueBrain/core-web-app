'use client';

import { useEffect, useState, useMemo } from 'react';
import { Table, Tag, Input } from 'antd';
import { useRouter } from 'next/navigation';
import { ColumnProps } from 'antd/es/table';
import { useSession } from 'next-auth/react';

import Link from '@/components/Link';
import styles from '../observatory/observatory.module.scss';
import tableStyles from './table.module.scss';

const { Search } = Input;

interface Campaign {
  id: string;
  name: string;
  description: string;
  configuration: string;
  dimensions: string;
  attributes: string;
  tags: string[];
}
const QueryBase = {
  track_total_hits: true,
  size: 20,
  from: 0,
  query: {
    bool: {
      filter: {
        bool: {
          should: [{ term: { '@type.keyword': 'https://neuroshapes.org/SimulationCampaign' } }],
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

      const res = await fetch('https://bbp.epfl.ch/nexus/v1/search/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify(query),
      });

      const r = await res.json();
      const data = r.hits.hits.map((item: any) => ({
        key: btoa(item._id),
        name: item._source.name,
        description: item._source.description,
        id: btoa(item._id),
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

  const columns: ColumnProps<Campaign>[] = [
    {
      title: columHeader('Name'),
      dataIndex: 'name',
      key: 'name',
      render: (text) => <div className="font-bold text-primary-7">{text}</div>,
    },
    {
      title: columHeader('Description'),
      dataIndex: 'description',
      key: 'description',
      render: (text) => <div className="text-primary-7">{text}</div>,
    },
    {
      title: columHeader('Configuration'),
      dataIndex: 'configuration',
      key: 'configuration',
      render: (text) => <div className="text-primary-7">{text}</div>,
    },
    {
      title: columHeader('Dimensions'),
      dataIndex: 'dimensions',
      key: 'dimensions',
      render: (text) => <div className="text-primary-7">{text}</div>,
    },
    {
      title: columHeader('Attributes'),
      dataIndex: 'attributes',
      key: 'attributes',
      render: (text) => <div className="text-primary-7">{text}</div>,
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
            <Search allowClear size="large" onSearch={onSearch} enterButton="Search" />
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
            onRow={(record) => ({
              onClick: (e) => {
                e.preventDefault();
                router.push(`/simulation-campaigns/${record.id}`);
              },
            })}
          />
        </div>
      </section>
    </div>
  );
}
