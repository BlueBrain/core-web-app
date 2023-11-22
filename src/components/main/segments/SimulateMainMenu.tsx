import { useEffect, useMemo, useReducer, useState } from 'react';
import Link from 'next/link';
import { useAtomValue } from 'jotai';
import { loadable } from 'jotai/utils';
import orderBy from 'lodash/orderBy';
import kebabCase from 'lodash/kebabCase';
import { isValid, formatDistance } from 'date-fns';
import { Tag } from 'antd';

import Table, { TablePagination, TableProps, TableSort, paginateArray } from './Table';
import { CollapsibleMenuItem } from './molecules';
import { launchedSimCampaignListAtom } from '@/state/simulate';
import { LaunchedSimCampUIConfigType, WorkflowExecutionStatusType } from '@/types/nexus';
import { EyeIcon, FileIcon, SettingsIcon } from '@/components/icons';
import { collapseId } from '@/util/nexus';
import ClockIcon from '@/components/icons/Clock';
import FullCircleIcon from '@/components/icons/FullCircle';
import EmptyCircleIcon from '@/components/icons/EmptyCircle';

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

function SimulateTemplateItem({ id, name, description }: CuratedTemplate) {
  return (
    <div id={id} className="border border-neutral-2 p-4 rounded-md hover:bg-gray-50 cursor-pointer">
      <div className="block">
        <div className="inline-flex items-center justify-between w-full gap-2 mb-3">
          <h3 className="text-primary-8 font-bold text-lg select-none">{name}</h3>
          <button type="button" className="text-neutral-4 text-sm hover:text-primary-8">
            Choose
          </button>
        </div>
        <p className="text-gray-400 text-sm font-normal line-clamp-2">{description}</p>
      </div>
    </div>
  );
}

function NewExperiment() {
  return (
    <div className="px-4 pt-4 pb-6 flex-col items-start justify-start gap-2 border hover:bg-gray-50 border-neutral-2 w-full rounded-md">
      <div className="inline-flex items-center justify-between w-full gap-3">
        <h3 className="text-primary-8 font-bold select-none text-xl">New experiments</h3>
        <Link
          href="/simulate/brain-config-selector"
          className="text-neutral-4 text-base hover:text-primary-8"
        >
          Choose
        </Link>
      </div>
      <p className="text-gray-400 font-normal select-none w-3/5 line-clamp-2 mb-4">
        Cillum duis duis dolor nulla. Proident ad eiusmod ut anim magna minim magna ea ex mollit et
        eu Exercitation eiusmod sint qui est elit in irure aliqua commodo irure do eiusmod ad.
      </p>
    </div>
  );
}

function SimulateTemplateList() {
  return (
    <div className="relative w-full p-7 bg-white flex flex-col items-start text-left gap-2">
      <NewExperiment />
      <div className="grid grid-flow-col gap-2">
        {CURATED_TEMPLATES.map(({ id, name, description }) => (
          <SimulateTemplateItem
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
      className="relative w-full p-7 bg-white hover:bg-primary-8 flex flex-col items-start text-left cursor-pointer group"
    >
      <h2 className="text-primary-8 font-bold text-xl group-hover:text-white">
        Browse simulation experiments
      </h2>
      <p className="text-gray-400 font-normal w-1/3 line-clamp-2 text-left">
        Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
        anim id est laborum.
      </p>
      <EyeIcon className="absolute right-12 top-1/2 -translate-y-1/2 text-primary-8 group-hover:text-white w-5 h-5" />
    </Link>
  );
}

function NameColumn({ text }: { text: LaunchedSimCampUIConfigType['name'] }) {
  return (
    <div className="text-sm font-normal text-primary-8 line-clamp-1" title={text}>
      {text}
    </div>
  );
}

function StatusColumn({ row: { status } }: { row: LaunchedSimCampUIConfigType }) {
  return (
    <div className="flex flex-row gap-2 items-center justify-start text-primary-8">
      {getStatusIcon(status)} {status}
    </div>
  );
}

function ActionColumn({ row }: { row: LaunchedSimCampUIConfigType }) {
  return (
    <div className="inline-flex flex-row items-center justify-center gap-2">
      <button disabled title="Edit" type="button" className="cursor-pointer">
        <FileIcon className="w-4 h-4 text-base text-primary-8 hover:text-primary-4" />
      </button>
      <Link
        title="Settings"
        href={`${EXPIREMENT_BASE_URL}?simulationCampaignUIConfigId=${collapseId(row['@id'])}`}
      >
        <SettingsIcon className="w-4 h-4 text-base text-primary-8 hover:text-primary-4" />
      </Link>
      {row.status === 'Done' && (
        <Link
          href={`${EXPLORE_SIM_CAMP_BASE_URM}?simCampId=${collapseId(row['@id'])}`}
          className="inline-block"
          title="Clone"
        >
          <EyeIcon className="w-4 h-4 text-base text-primary-8 hover:text-primary-4" />
        </Link>
      )}
    </div>
  );
}

function MySimulations() {
  const launchedSimCampaignsLoadable = useAtomValue(loadableLaunchedSimCampaignListAtom);
  const [configs, setConfigs] = useState<LaunchedSimCampUIConfigType[]>([]);
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
        sortable: true,
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

  const onChange = (input: TablePagination | TableSort) => {
    if ('currentPage' in input) {
      const dataChunk = paginateArray(
        configs,
        input.perPage ?? pagination.perPage,
        input.currentPage!
      );
      setDataSource(dataChunk);
      input.onPageChange?.(input.currentPage! + 1);
    }
    if ('sortFn' in input && 'key' in input && 'dir' in input) {
      const newData = orderBy(configs, [input.key], [input.dir ?? 'asc']);
      const dataChunk = paginateArray(newData, pagination.perPage, 0);
      input.onPageChange?.(1);
      setDataSource(dataChunk);
    }
  };

  useEffect(() => {
    if (launchedSimCampaignsLoadable.state !== 'hasData') return;

    setConfigs(launchedSimCampaignsLoadable.data);
  }, [launchedSimCampaignsLoadable]);

  useEffect(() => {
    if (configs && !loading) {
      setDataSource(paginateArray(configs, pagination.perPage, 0));
    }
  }, [configs, loading, pagination.perPage]);

  return (
    <div className="relative w-full">
      <div className="sticky top-0 z-20 bg-white w-full py-8 px-7">
        <div className="inline-flex items-center justify-between gap-5 w-full">
          <div className="grid grid-flow-col gap-5">
            <div className="text-primary-8 text-sm font-medium">
              Simulations running{' '}
              <strong>
                <Tag bordered={false}>{runningSimulationCount}</Tag>
              </strong>
            </div>
            <div className="text-primary-8 text-sm font-medium">
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

export default function SimulateMainMenu() {
  const [openMySimulations, toggleMySimulation] = useReducer((val) => !val, false);

  return (
    <div className="flex flex-col gap-2 w-full">
      <SimulateTemplateList />
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
