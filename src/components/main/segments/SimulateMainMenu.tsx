import { useEffect, useMemo, useReducer, useState } from 'react';
import Link from 'next/link';
import { useAtomValue } from 'jotai';
import { loadable } from 'jotai/utils';
import { isValid, formatDistance } from 'date-fns';
import { Tag } from 'antd';
import orderBy from 'lodash/orderBy';
import kebabCase from 'lodash/kebabCase';

import Table, { TableOnChangeFn, TableProps, paginateArray } from './Table';
import { CollapsibleMenuItem } from './molecules';
import { launchedSimCampaignListAtom } from '@/state/simulate';
import { LaunchedSimCampUIConfigType, WorkflowExecutionStatusType } from '@/types/nexus';
import { EyeIcon, FileIcon, SettingsIcon } from '@/components/icons';
import { collapseId } from '@/util/nexus';
import ClockIcon from '@/components/icons/Clock';
import FullCircleIcon from '@/components/icons/FullCircle';
import EmptyCircleIcon from '@/components/icons/EmptyCircle';
import { useLoadable as useLoadableData } from '@/hooks/hooks';

type SimulateMenuKey = 'new-experiment' | 'browse-experiments' | 'my-simulation-experiments' | null;
type CuratedTemplate = {
  id: string;
  name: string;
  description: string;
};

const loadableLaunchedSimCampaignListAtom = loadable(launchedSimCampaignListAtom);
const EXPIREMENT_BASE_URL = '/experiment-designer/experiment-setup';
const EXPLORE_SIM_CAMP_BASE_URM = '/explore/simulation-campaigns/test';

const CURATED_TEMPLATES = [
  {
    id: 'Quis pariatur eiusmod aute id. - 1',
    name: 'Template n°1',
    description:
      'Officia officia consectetur ut cillum in est adipisicing laboris in incididunt fugiat ipsum reprehenderit voluptate.',
  },
  {
    id: 'Quis pariatur eiusmod aute id. - 2',
    name: 'Template n°2',
    description:
      'Officia officia consectetur ut cillum in est adipisicing laboris in incididunt fugiat ipsum reprehenderit voluptate.',
  },
  {
    id: 'Quis pariatur eiusmod aute id. - 3',
    name: 'Template n°3',
    description:
      'Officia officia consectetur ut cillum in est adipisicing laboris in incididunt fugiat ipsum reprehenderit voluptate.',
  },
  {
    id: 'Quis pariatur eiusmod aute id. - 4',
    name: 'Template n°4',
    description:
      'Officia officia consectetur ut cillum in est adipisicing laboris in incididunt fugiat ipsum reprehenderit voluptate.',
  },
];

function getSorterFn<T extends LaunchedSimCampUIConfigType>(
  sortProp:
    | 'status'
    | 'startedAtTime'
    | 'endedAtTime'
    | 'name'
    | 'description'
    | '_createdBy'
    | '_createdAt'
) {
  return (a: T, b: T) => (a[sortProp] < b[sortProp] ? 1 : -1);
}

function getStatusIcon(status: WorkflowExecutionStatusType): React.ReactNode {
  switch (status) {
    case 'Running':
      return <ClockIcon className="text-primary-4" />;
    case 'Done':
      return <FullCircleIcon className="text-green-400" />;
    case 'Failed':
      return <EmptyCircleIcon className="text-red-400" />;
    default:
      return <EmptyCircleIcon />;
  }
}

function TemplateItem({ id, name, description }: CuratedTemplate) {
  return (
    <div id={id} className="cursor-pointer rounded-md border border-neutral-2 p-4 hover:bg-gray-50">
      <div className="block">
        <div className="mb-3 inline-flex w-full items-center justify-between gap-2">
          <h3 className="select-none text-lg font-bold text-primary-8">{name}</h3>
          <button type="button" className="text-sm text-neutral-4 hover:text-primary-8">
            Choose
          </button>
        </div>
        <p className="line-clamp-2 text-sm font-normal text-gray-400">{description}</p>
      </div>
    </div>
  );
}

function NewExperiment() {
  return (
    <div className="w-full flex-col items-start justify-start gap-2 rounded-md border border-neutral-2 px-4 pb-6 pt-4 hover:bg-gray-50">
      <div className="inline-flex w-full items-center justify-between gap-3">
        <h3 className="select-none text-xl font-bold text-primary-8">New experiments</h3>
        <Link
          href="/simulate/brain-config-selector"
          className="text-base text-neutral-4 hover:text-primary-8"
        >
          Choose
        </Link>
      </div>
      <p className="mb-4 line-clamp-2 w-3/5 select-none font-normal text-gray-400">
        Cillum duis duis dolor nulla. Proident ad eiusmod ut anim magna minim magna ea ex mollit et
        eu Exercitation eiusmod sint qui est elit in irure aliqua commodo irure do eiusmod ad.
      </p>
    </div>
  );
}

function TemplateList() {
  return (
    <div className="relative flex w-full flex-col items-start gap-2 bg-white p-7 text-left">
      <NewExperiment />
      <div className="grid grid-flow-col gap-2">
        {CURATED_TEMPLATES.map(({ id, name, description }) => (
          <TemplateItem
            key={kebabCase(`${name}-${id}`)}
            {...{
              id,
              name,
              description,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export function BrowseSimulations() {
  return (
    <Link
      href="/explore/simulation-campaigns"
      className="group relative flex w-full cursor-pointer flex-col items-start bg-white p-7 text-left hover:bg-primary-8"
    >
      <h2 className="text-xl font-bold text-primary-8 group-hover:text-white">
        Browse simulation experiments
      </h2>
      <p className="line-clamp-2 w-1/3 text-left font-normal text-gray-400">
        Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
        anim id est laborum.
      </p>
      <EyeIcon className="absolute right-12 top-1/2 h-5 w-5 -translate-y-1/2 text-primary-8 group-hover:text-white" />
    </Link>
  );
}

function NameColumn({ text }: { text: LaunchedSimCampUIConfigType['name'] }) {
  return (
    <div className="line-clamp-1 text-sm font-normal text-primary-8" title={text}>
      {text}
    </div>
  );
}

function StatusColumn({ row: { status } }: { row: LaunchedSimCampUIConfigType }) {
  return (
    <div className="flex flex-row items-center justify-start gap-2 text-primary-8">
      {getStatusIcon(status)} {status}
    </div>
  );
}

function ActionColumn({ row }: { row: LaunchedSimCampUIConfigType }) {
  return (
    <div className="inline-flex flex-row items-center justify-center gap-2">
      <button disabled title="Edit" type="button" className="cursor-pointer" aria-label="Edit">
        <FileIcon className="h-4 w-4 text-base text-primary-8 hover:text-primary-4" />
      </button>
      <Link
        title="Settings"
        href={`${EXPIREMENT_BASE_URL}?simulationCampaignUIConfigId=${collapseId(row['@id'])}`}
      >
        <SettingsIcon className="h-4 w-4 text-base text-primary-8 hover:text-primary-4" />
      </Link>
      {row.status === 'Done' && (
        <Link
          href={`${EXPLORE_SIM_CAMP_BASE_URM}?simCampId=${collapseId(row['@id'])}`}
          className="inline-block"
          title="Clone"
        >
          <EyeIcon className="h-4 w-4 text-base text-primary-8 hover:text-primary-4" />
        </Link>
      )}
    </div>
  );
}

function MySimulations() {
  const launchedSimCampaignsLoadable = useAtomValue(loadableLaunchedSimCampaignListAtom);
  const configs = useLoadableData<LaunchedSimCampUIConfigType[]>(
    loadableLaunchedSimCampaignListAtom,
    []
  );
  const [datasource, setDataSource] = useState(() => configs);
  const loading = launchedSimCampaignsLoadable.state === 'loading';

  const doneSimulationCount = useMemo(
    () => configs.filter((config) => config.status === 'Done').length,
    [configs]
  );

  const runningSimulationCount = useMemo(
    () => configs.filter((config) => config.status === 'Running').length,
    [configs]
  );

  const columns: TableProps<LaunchedSimCampUIConfigType>['columns'] = useMemo(
    () => [
      {
        key: 'name',
        name: 'Name',
        sortable: true,
        sortFn: () => getSorterFn('name'),
        sortPosition: 'left',
        cellRenderer: NameColumn,
      },
      {
        key: 'description',
        name: 'Description',
        sortable: true,
        sortFn: () => getSorterFn('name'),
        sortPosition: 'left',
      },
      {
        key: 'status',
        name: 'Status',
        sortPosition: 'left',
        cellRenderer: StatusColumn,
      },
      {
        key: 'startedAtTime',
        name: 'Started at',
        sortable: true,
        center: true,
        sortPosition: 'left',
        sortFn: () => getSorterFn('startedAtTime'),
        transformer: (text) => {
          if (isValid(new Date(text)))
            return formatDistance(new Date(text), new Date(), { addSuffix: true });
          return '';
        },
      },
      {
        key: 'endedAtTime',
        name: 'Completed at',
        center: true,
        sortPosition: 'left',
        sortFn: () => getSorterFn('endedAtTime'),
        transformer: (text) => {
          if (isValid(new Date(text)))
            return formatDistance(new Date(text), new Date(), { addSuffix: true });
          return '';
        },
      },
      {
        key: 'action',
        name: 'Actions',
        cellRenderer: ActionColumn,
      },
    ],
    []
  );

  const pagination = useMemo(
    () => ({
      total: configs.length,
      perPage: 10,
      showBelowThreshold: false,
    }),
    [configs.length]
  );

  const onChange: TableOnChangeFn = (trigger, pag, sort) => {
    let data: Array<LaunchedSimCampUIConfigType> = configs;
    let dataChunk: Array<LaunchedSimCampUIConfigType> = [];
    data = sort && sort.key && sort.dir ? orderBy(configs, sort.key, sort.dir) : configs;
    dataChunk = paginateArray(
      data,
      pag.perPage ?? pagination.perPage,
      trigger === 'sort' ? pag.currentPage! - 1 : pag.currentPage!
    );
    setDataSource(dataChunk);
    if (pag && trigger === 'pagination') {
      pag.onPageChange?.(pag.currentPage! + 1);
    }
  };

  useEffect(() => {
    if (configs && !loading) {
      setDataSource(paginateArray(configs, pagination.perPage, 0));
    }
  }, [configs, loading, pagination.perPage]);

  return (
    <div className="relative w-full">
      <div className="sticky top-0 z-20 w-full bg-white px-7 py-8">
        <div className="inline-flex w-full items-center justify-between gap-5">
          <div className="grid grid-flow-col gap-5">
            <div className="text-sm font-medium text-primary-8">
              Simulations running{' '}
              <strong>
                <Tag bordered={false}>{runningSimulationCount}</Tag>
              </strong>
            </div>
            <div className="text-sm font-medium text-primary-8">
              Simulations done{' '}
              <strong>
                <Tag bordered={false}>{doneSimulationCount}</Tag>
              </strong>
            </div>
          </div>
        </div>
      </div>
      <div className="px-7">
        <Table<LaunchedSimCampUIConfigType>
          loading={loading}
          name="my-simulation-table"
          columns={columns}
          data={datasource}
          classNames={{
            colCell: 'uppercase',
          }}
          pagination={pagination}
          onChange={onChange}
        />
      </div>
    </div>
  );
}

export default function MainMenu() {
  const [openMySimulations, toggleMySimulation] = useReducer((val) => !val, false);

  return (
    <div className="flex w-full flex-col gap-2">
      <TemplateList />
      <BrowseSimulations />
      <CollapsibleMenuItem<SimulateMenuKey>
        id="my-simulation-experiments"
        opened={openMySimulations}
        onSelect={() => toggleMySimulation()}
        title="My simulation experiments"
        description="Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
      >
        {() => <MySimulations />}
      </CollapsibleMenuItem>
    </div>
  );
}
