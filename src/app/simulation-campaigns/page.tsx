'use client';

import { useEffect, useState, useMemo } from 'react';
import { Table, Pagination, Tag, Input } from 'antd';
import { useRouter } from 'next/navigation';
import { ColumnProps } from 'antd/es/table';
import { useSession } from 'next-auth/react';
import moment from 'moment';
import Sidebar from '@/components/observatory/Sidebar';
import { Campaign } from '@/types/observatory';
import { createHeaders } from '@/util/utils';
import { nexus } from '@/config';
import { sorter } from '@/util/common';
import styles from '@/app/observatory/observatory.module.scss';
import tableStyles from './table.module.scss';

const { Search } = Input;

const PAGE_SIZE = 10;

const API_SEARCH = `${nexus.url}/search/query`;

const QueryBase = {
  track_total_hits: true,
  sort: [{ createdAt: { order: 'desc' } }],
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
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalResults, setTotalResults] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(PAGE_SIZE);

  const searchQuery = useMemo(
    () => ({
      query: {
        multi_match: {
          query: searchTerm,
          prefix_length: 0,
          fields: ['*'],
        },
      },
    }),
    [searchTerm]
  );

  const paginationQuery = useMemo(
    () => ({
      size: pageSize,
      from: (currentPage - 1) * pageSize,
    }),
    [pageSize, currentPage]
  );

  useEffect(() => {
    async function fetchSimCampaigns() {
      if (!session?.user) return;
      const query = searchTerm
        ? { ...QueryBase, ...paginationQuery, ...searchQuery }
        : { ...QueryBase, ...paginationQuery };

      const simCampaignResponse = await fetch(API_SEARCH, {
        method: 'POST',
        headers: createHeaders(session.accessToken),
        body: JSON.stringify(query),
      });

      const simCampaigns = await simCampaignResponse.json();
      setTotalResults(simCampaigns._shards.total);
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
  }, [session, searchTerm, searchQuery, paginationQuery]);

  const columHeader = (text: string) => <div className={styles.tableHeader}>{text}</div>;

  const onSearch = (value: string) => setSearchTerm(value);

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
      title: columHeader('Started At'),
      dataIndex: 'startedAt',
      key: 'startedAt',
      render: (text) => <div className="text-primary-7">{moment(text).format('MMM Do YY')}</div>,
      sorter: (a, b) => moment(a.startedAt).unix() - moment(b.startedAt).unix(),
    },
    {
      title: columHeader('Created At'),
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
    <div className="flex min-h-screen z-0" style={{ background: '#d1d1d1' }}>
      <Sidebar />
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
              className="bg-primary-7 border-none bg-transparent"
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
            columns={columns}
            pagination={false}
            onRow={(record) => ({
              onClick: (e) => {
                e.preventDefault();
                router.push(`/simulation-campaigns/${record.self}`);
              },
            })}
          />
          <Pagination
            className={tableStyles.pagination}
            onChange={(page) => setCurrentPage(page)}
            onShowSizeChange={(current, size) => setPageSize(size)}
            defaultCurrent={1}
            total={totalResults}
          />
        </div>
      </section>
    </div>
  );
}
