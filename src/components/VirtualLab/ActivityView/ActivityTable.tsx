import { ConfigProvider, Table } from 'antd';
import { useEffect, useState, ReactNode, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { atom, useAtom } from 'jotai';
import memoizeOne from 'memoize-one';
import { LoadingOutlined } from '@ant-design/icons';
import StatusHeader from './StatusHeader';

import { ActivityColumn, ActivityRecord, Status } from './types';
import timeElapsedFromToday from '@/util/date';
import Link from '@/components/Link';
import EmptyCircleIcon from '@/components/icons/EmptyCircle';
import FullCircleIcon from '@/components/icons/FullCircle';
import PartialCircleIcon from '@/components/icons/PartialCircle';
import TriangleIcon from '@/components/icons/Triangle';
import { classNames } from '@/util/utils';
import { getSession } from '@/authFetch';
import { fetchResourceById } from '@/api/nexus';
import { DataType, DataTypeToNexusType } from '@/constants/explore-section/list-views';
import { DataQuery, fetchEsResourcesByType } from '@/api/explore-section/resources';
import { to64 } from '@/util/common';
import { MEModel } from '@/types/me-model';
import { generateVlProjectUrl } from '@/util/virtual-lab/urls';

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
  created: 'text-secondary-5',
};

const statusToIcon: { [key in Status]: ReactNode | null } = {
  initalized: <EmptyCircleIcon className="mr-2" />,
  processing: <PartialCircleIcon className="mr-2" />,
  running: <PartialCircleIcon className="mr-2" />,
  error: <TriangleIcon className="mr-2" />,
  done: <FullCircleIcon className="mr-2" />,
  created: <FullCircleIcon className="mr-2" />,
  default: null,
};

const columns: ActivityColumn[] = [
  {
    title: 'Scale',
    dataIndex: 'scale',
    key: 'scale',
    render: (text, record) => (
      <span className={statusToColorMap[record.status] || statusToColorMap.default}>{text}</span>
    ),
  },
  {
    title: 'Use case',
    dataIndex: 'usecase',
    key: 'usecase',
    render: (text, record) => (
      <span className={statusToColorMap[record.status] || statusToColorMap.default}>{text}</span>
    ),
  },
  {
    title: 'Activity',
    dataIndex: 'activity',
    key: 'activity',
    render: (text, record) => (
      <span className={statusToColorMap[record.status] || statusToColorMap.default}>{text}</span>
    ),
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (text, record) => (
      <span className={statusToColorMap[record.status] || statusToColorMap.default}>{text}</span>
    ),
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (_, record) => {
      const icon = statusToIcon[record.status] || statusToIcon.default;
      return (
        <span
          className={classNames(
            'flex items-center capitalize',
            statusToColorMap[record.status] || statusToColorMap.default
          )}
        >
          {icon}
          {record.status}
        </span>
      );
    },
  },
  {
    title: 'Date',
    dataIndex: 'date',
    key: 'date',
    render: (_, record) => (
      <span className={statusToColorMap[record.status] || statusToColorMap.default}>
        {record.date}
      </span>
    ),
  },
  {
    title: 'Actions',
    dataIndex: 'linkUrl',
    key: 'linkUrl',
    render: (_, record) => {
      return <Link href={record.linkUrl}>{LinkIcon}</Link>;
    },
  },
];

const getAtom = memoizeOne((_vlab: string, _project: string) =>
  atom<ActivityRecord[] | undefined>(undefined)
);

export default function ActivityTable() {
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const projectId = params.projectId as string;
  const virtualLabId = params.virtualLabId as string;
  const [dataSource, setDataSource] = useAtom(getAtom(virtualLabId, projectId));

  const errorCount = useMemo(() => {
    return dataSource?.filter((r) => r.status === 'error')?.length;
  }, [dataSource]);

  const modelBuildsCount = useMemo(() => {
    return dataSource?.filter((r) => r.activity === 'Build')?.length;
  }, [dataSource]);

  const analysisRuningCount = useMemo(() => {
    return dataSource?.filter((r) => r.activity === 'Build - Analysis' && r.status === 'running')
      ?.length;
  }, [dataSource]);

  useEffect(() => {
    async function fetchResource() {
      const session = await getSession();
      if (!session) return null;

      const hits = await fetchEsResourcesByType(query, undefined, {
        projectId,
        virtualLabId,
      });

      const results = (await Promise.all(
        hits.hits
          .map((h) => h._source)
          .filter((r) => !r['@id'].includes('mmb-point-neuron-framework-model'))
          .map((r) =>
            fetchResourceById(r['@id'], session, {
              org: virtualLabId,
              project: projectId,
            })
          )
      )) as Result[];

      setDataSource(generateRowItems(results, { virtualLabId, projectId }));

      setLoading(false);
    }

    fetchResource();
  }, [projectId, virtualLabId, setDataSource]);

  return (
    <div className="flex h-full w-full flex-col">
      <StatusHeader error={errorCount} build={modelBuildsCount} running={analysisRuningCount} />
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
        {dataSource && (
          <Table
            className={classNames(
              '[&_.ant-table-tbody>tr:last-child>td]:border-b-0',
              '[&_.ant-table-thead>tr>th]:border-b-0'
            )}
            dataSource={dataSource}
            columns={columns}
            pagination={false}
          />
        )}

        {loading && !dataSource && (
          <div className="flex h-full items-center justify-center">
            <LoadingOutlined />
          </div>
        )}
      </ConfigProvider>
    </div>
  );
}

function generateRowItems(
  resources: Result[],
  vlabInfo: { projectId: string; virtualLabId: string }
): ActivityRecord[] {
  const records: ActivityRecord[] = [];

  const type = (r: Result) => (Array.isArray(r['@type']) ? r['@type'][1] : r['@type']);

  const isSim = (r: Result) => type(r).includes('Simulation');
  const isSynaptome = (r: Result) => type(r).includes('Synaptome');

  const activity = (r: Result) => {
    if (isSim(r)) return 'Simulate';
    if (isSynaptome(r)) return 'Build';
    return 'Build - Analysis';
  };

  const defaultStatus = (r: Result) => {
    if (isSim(r)) return 'done'; // All single cell and synaptome simulations are 'done' by the time they're saved
    if (isSynaptome(r)) return 'created';
    return r.status ?? 'initalized';
  };

  const link = (r: ActivityRecord, id: string) => {
    if (r.usecase === 'Single cell') {
      const url = buildUrl(vlabInfo.projectId, vlabInfo.virtualLabId, '/build/me-model/view', id);
      if (r.activity === 'Build - Analysis') return url + '?tab=analysis';
      if (r.activity === 'Simulate') return url + '?tab=simulation';
      return url;
    }

    const url = buildUrl(vlabInfo.projectId, vlabInfo.virtualLabId, '/build/synaptome/view', id);

    if (r.activity === 'Simulate') return url + '?tab=simulation';
    return url;
  };

  for (const resource of resources) {
    const record: ActivityRecord = {
      id: resource['@id'],
      key: resource['@id'],
      scale: 'Cellular',
      usecase: isSynaptome(resource) ? 'Synaptome' : 'Single cell',
      activity: activity(resource),
      name: resource.name,
      status: defaultStatus(resource),
      date: timeElapsedFromToday(resource._updatedAt),
      linkUrl: '',
    };
    record.linkUrl = link(
      record,
      record.activity === 'Simulate' && resource.used ? resource.used['@id'] : resource['@id'] // Simulations point to their parent resource
    );
    records.push(record);

    // Add a new entry for 'creation' of MeModel ( in addition to analysis)
    if (resource['@type'].includes('MEModel')) {
      const buildRecord = { ...record };
      buildRecord.key = record.key + '_';
      buildRecord.status = 'created';
      buildRecord.activity = 'Build';
      buildRecord.linkUrl = link(buildRecord, resource['@id']);
      records.push(buildRecord);
    }
  }

  return records;
}

const query = {
  sort: {
    updatedAt: 'desc',
  },

  query: {
    bool: {
      must: [
        {
          terms: {
            '@type.keyword': [
              DataTypeToNexusType[DataType.CircuitMEModel],
              DataTypeToNexusType[DataType.SingleNeuronSimulation],
              DataTypeToNexusType[DataType.SingleNeuronSynaptome],
              DataTypeToNexusType[DataType.SingleNeuronSynaptomeSimulation],
            ],
          },
        },
        {
          term: {
            deprecated: false,
          },
        },
      ],
    },
  },
} satisfies DataQuery;

type Result = {
  '@id': string;
  '@type': string | string[];
  _updatedAt: string;
  name: string;
  status?: ActivityRecord['status'];
  used?: MEModel; // For single cell simulations only
};

function buildUrl(projectId: string, virtualLabId: string, path: string, id: string) {
  const virtualLabUrl = generateVlProjectUrl(virtualLabId, projectId);
  return `${virtualLabUrl}${path}/${to64(`${virtualLabId}/${projectId}!/!${id}`)}`;
}
