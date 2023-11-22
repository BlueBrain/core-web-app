import kebabCase from 'lodash/kebabCase';
import { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import { Button, Switch, Tag } from 'antd';
import { useRouter } from 'next/navigation';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { loadable } from 'jotai/utils';
import { useSession } from 'next-auth/react';
import { Session } from 'next-auth';
import { EyeOutlined, FileTextOutlined, InfoCircleFilled } from '@ant-design/icons';
import { isValid, formatDistance } from 'date-fns';
import { orderBy } from 'lodash/fp';

import { CURATED_MODELS } from '../../BrainConfigPanel/BuildSideBar';
import { EyeIcon } from '../../icons';
import CloneIcon from '../../icons/Clone';
import Table, { TablePagination, TableProps, TableSort, paginateArray } from './Table';
import { CollapsibleMenuItem, SubMenuList } from './molecules';
import {
  SearchType,
  configListAtom,
  searchConfigListTypeAtom,
} from '@/state/brain-model-config-list';
import { cloneBrainModelConfig, renameBrainModelConfig } from '@/api/nexus';
import { getBrainModelConfigsByNameQuery } from '@/queries/es';
import { BrainModelConfigResource, SupportedConfigListTypes } from '@/types/nexus';
import { collapseId } from '@/util/nexus';
import { triggerRefetchAtom } from '@/components/BrainConfigLoaderView/state';
import useCloneConfigModal from '@/hooks/config-clone-modal';
import useRenameModal from '@/hooks/config-rename-modal';
import Link from '@/components/Link';

type CuratedModel = {
  id: string;
  name: string;
  description: string;
};

type BuildMenuKey = 'create-model' | 'browse-models' | null;

const loadableConfigAtom = loadable(configListAtom);
const BUILD_BASE_HREF = '/build/cell-composition/interactive';
const BUILD_MENU: Array<SubMenuList<BuildMenuKey>> = [
  {
    id: 'create-model',
    title: 'Create new brain models',
    description:
      'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    Component: () => <BuildModelList />,
  },
  {
    id: 'browse-models',
    title: 'Browse brain models',
    description:
      'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    Component: () => <BuildBrowseModel />,
  },
];

function BuildModelItem({
  id,
  name,
  description,
  openCloneModel,
}: CuratedModel & { openCloneModel: () => void }) {
  const href = `${BUILD_BASE_HREF}?brainModelConfigId=${encodeURIComponent(collapseId(id))}`;
  return (
    <div className="border border-neutral-2 p-4 rounded-md hover:bg-gray-50 cursor-pointer">
      <div className="block">
        <h3 className="text-primary-8 font-bold text-xl">{name}</h3>
        <p className="text-gray-400 font-normal w-3/4 line-clamp-2">{description}</p>
      </div>
      <div className="w-full inline-flex items-center justify-between mt-8">
        <Link href={href}>
          <div className="relative py-1 p-4 rounded-md !h-6 box-content hover:bg-primary-0 group">
            <div className="text-primary-8 flex items-center gap-1 font-bold text-base">
              <EyeIcon className="text-primary-8 w-5 h-5" />
              <span>View</span>
            </div>
            <div className="h-[1.5px] bg-neutral-3 absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%]  group-hover:bg-primary-0" />
          </div>
        </Link>
        <Button
          type="text"
          icon={<CloneIcon className="text-primary-8 w-4 h-4" />}
          className="relative group text-primary-8 font-bold text-base flex items-center justify-center py-1 p-4 h-6 rounded-md box-content hover:!bg-primary-0"
          onClick={openCloneModel}
        >
          Clone
          <div className="h-[1.5px] bg-neutral-3 absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] mx-auto group-hover:bg-primary-0" />
        </Button>
      </div>
    </div>
  );
}

function BuildModelList() {
  const router = useRouter();
  const { createModal: instantiateCloneModal, contextHolder: cloneContextHolder } =
    useCloneConfigModal<BrainModelConfigResource>(
      cloneBrainModelConfig,
      getBrainModelConfigsByNameQuery
    );

  const openCloneModal = useCallback(
    ({ id, name, description }: CuratedModel) =>
      () => {
        const config = {
          '@id': id,
          name,
          description,
        } as BrainModelConfigResource;

        instantiateCloneModal(config, (clonedConfig: BrainModelConfigResource) =>
          router.push(
            `${BUILD_BASE_HREF}?brainModelConfigId=${encodeURIComponent(
              collapseId(clonedConfig['@id'])
            )}`
          )
        );
      },
    [instantiateCloneModal, router]
  );

  return (
    <>
      <div className="grid grid-flow-col gap-2 px-7">
        {CURATED_MODELS.map(({ id, name, description }) => (
          <BuildModelItem
            key={kebabCase(`${name}-${id}`)}
            openCloneModel={openCloneModal({ id, name, description })}
            {...{
              id,
              name,
              description,
            }}
          />
        ))}
      </div>
      {cloneContextHolder}
    </>
  );
}

function disableAction<T extends BrainModelConfigResource>(config: T, session: Session | null) {
  return config._createdBy.split('/').reverse()[0] !== session?.user.username;
}

function getSorterFn<T extends SupportedConfigListTypes>(
  sortProp: 'name' | 'description' | '_createdBy' | '_createdAt'
) {
  return (a: T, b: T) => (a[sortProp] < b[sortProp] ? 1 : -1);
}

function ActionColumn({
  row,
  openRenameModal,
  openCloneModal,
}: {
  row: BrainModelConfigResource;
  openCloneModal: (currentConfig: BrainModelConfigResource) => void;
  openRenameModal: (currentConfig: BrainModelConfigResource) => void;
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const onRename = () => openRenameModal(row);
  const onView = () =>
    router.push(
      `${BUILD_BASE_HREF}?brainModelConfigId=${encodeURIComponent(collapseId(row['@id']))}`
    );
  const onClone = () => openCloneModal(row);
  const disableEdit = disableAction(row, session);
  return (
    <div className="inline-flex flex-row items-center justify-center gap-2">
      <button
        title="Edit"
        type="button"
        className="cursor-pointer"
        onClick={onRename}
        disabled={disableEdit}
      >
        <FileTextOutlined className="w-4 h-4 text-base text-primary-8 hover:text-primary-4" />
      </button>
      <button title="View" type="button" className="cursor-pointer" onClick={onView}>
        <EyeOutlined className="w-4 h-4 text-base text-primary-8 hover:text-primary-4" />
      </button>
      <button title="Clone" type="button" className="cursor-pointer" onClick={onClone}>
        <CloneIcon className="w-4 h-4 text-base text-primary-8 hover:text-primary-4" />
      </button>
    </div>
  );
}

function BrowseModelsGrid({
  openCloneModal,
  openRenameModal,
}: {
  openCloneModal: (currentConfig: BrainModelConfigResource) => void;
  openRenameModal: (currentConfig: BrainModelConfigResource) => void;
}) {
  const configsLoadable = useAtomValue(loadableConfigAtom);

  const [configs, setConfigs] = useState<BrainModelConfigResource[]>(
    configsLoadable.state === 'hasData' ? configsLoadable.data : []
  );
  const [datasource, setDataSource] = useState(() => configs);
  const loading = configsLoadable.state === 'loading';

  const pagination = useMemo(
    () => ({
      total: configs.length,
      perPage: 10,
      showBelowThreshold: false,
    }),
    [configs.length]
  );

  const NameColumn = useCallback(
    // eslint-disable-next-line react/no-unused-prop-types
    ({ row, text }: { row: BrainModelConfigResource; text: BrainModelConfigResource['name'] }) => (
      <Link
        href={`${BUILD_BASE_HREF}?brainModelConfigId=${encodeURIComponent(collapseId(row['@id']))}`}
        className="text-sm font-bold text-primary-8"
      >
        {text}
      </Link>
    ),
    []
  );

  const StatusColumn = useCallback(
    () => (
      <div className="inline-flex items-center justify-center gap-1">
        <InfoCircleFilled className="text-blue-500" />
        <span className="leading-9">Waiting</span>
      </div>
    ),
    []
  );

  const ActionColumnWrapper = useCallback(
    // eslint-disable-next-line react/no-unused-prop-types
    ({ row }: { row: BrainModelConfigResource }) => (
      <ActionColumn {...{ row, openCloneModal, openRenameModal }} />
    ),
    [openCloneModal, openRenameModal]
  );

  const columns: TableProps<BrainModelConfigResource>['columns'] = useMemo(
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
        cellRenderer: StatusColumn,
      },
      {
        key: '_createdBy',
        name: 'created by',
        sortable: true,
        center: true,
        sortPosition: 'left',
        transformer: (text) => text.split('/').at(-1) ?? '',
        sortFn: () => getSorterFn('_createdBy'),
      },
      {
        key: '_createdAt',
        name: 'started',
        transformer: (text) => {
          if (isValid(new Date(text)))
            return formatDistance(new Date(text), new Date(), { addSuffix: true });
          return '';
        },
        sortable: true,
        sortPosition: 'left',
        sortFn: () => getSorterFn('_createdAt'),
      },
      {
        key: 'action',
        name: 'Actions',
        cellRenderer: ActionColumnWrapper,
      },
    ],
    [ActionColumnWrapper, NameColumn, StatusColumn]
  );

  useEffect(() => {
    if (configsLoadable.state !== 'hasData') return;

    setConfigs(configsLoadable.data);
  }, [configsLoadable]);

  useEffect(() => {
    if (configs && !loading) {
      setDataSource(paginateArray(configs, pagination.perPage, 0));
    }
  }, [configs, loading, pagination.perPage]);

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
      const newData = orderBy(input.key, input.dir ?? 'asc', configs);
      const dataChunk = paginateArray(newData, pagination.perPage, 0);
      input.onPageChange?.(1);
      setDataSource(dataChunk);
    }
  };

  return (
    <Table<BrainModelConfigResource>
      loading={loading}
      name="browse-models-table"
      columns={columns}
      data={datasource}
      classNames={{
        colCell: 'uppercase',
      }}
      pagination={pagination}
      onChange={onChange}
    />
  );
}

function BuildBrowseModel() {
  const router = useRouter();
  const [activeTabId, setActiveTabId] = useAtom(searchConfigListTypeAtom);
  const triggerRefetch = useSetAtom(triggerRefetchAtom);

  const toggleConfigSearchType = (stype: SearchType) => (checked: boolean) => {
    if (checked) setActiveTabId(stype);
    else setActiveTabId('public');
  };

  const { createModal: createCloneModal, contextHolder: cloneContextHolder } =
    useCloneConfigModal<BrainModelConfigResource>(
      cloneBrainModelConfig,
      getBrainModelConfigsByNameQuery
    );
  const { createModal: createRenameModal, contextHolder: renameContextHolder } =
    useRenameModal<BrainModelConfigResource>(
      renameBrainModelConfig,
      getBrainModelConfigsByNameQuery
    );

  const openCloneModal = useCallback(
    (currentConfig: BrainModelConfigResource) => {
      createCloneModal(currentConfig, (clonedConfig: BrainModelConfigResource) => {
        triggerRefetch();
        router.push(
          `${BUILD_BASE_HREF}?brainModelConfigId=${encodeURIComponent(
            collapseId(clonedConfig['@id'])
          )}`
        );
      });
    },
    [createCloneModal, router, triggerRefetch]
  );

  const openRenameModal = useCallback(
    (config: BrainModelConfigResource) => {
      createRenameModal(config, triggerRefetch);
    },
    [createRenameModal, triggerRefetch]
  );

  return (
    <div className="relative w-full">
      <div className="sticky top-0 z-20 bg-white w-full py-8 px-7">
        <div className="inline-flex items-center justify-between gap-5 w-full">
          <div className="grid grid-flow-col gap-5">
            <div className="text-primary-8 text-sm font-medium">
              Brain configuration being built{' '}
              <strong>
                <Tag bordered={false}>13</Tag>
              </strong>
            </div>
            <div className="text-primary-8 text-sm font-medium">
              Brain configuration built{' '}
              <strong>
                <Tag bordered={false}>24</Tag>
              </strong>
            </div>
          </div>
          <div className="grid grid-flow-col gap-3">
            <div className="inline-flex items-center justify-center gap-2">
              <Switch
                checked={activeTabId === 'recent'}
                size="small"
                onClick={toggleConfigSearchType('recent')}
                className="text-primary-8"
              />
              <span className="text-primary-8 text-sm font-medium">Show recent models</span>
            </div>
            <div className="inline-flex items-center justify-center gap-2">
              <Switch
                checked={activeTabId === 'personal'}
                size="small"
                onClick={toggleConfigSearchType('personal')}
              />
              <span className="text-primary-8 text-sm font-medium">Show only my models</span>
            </div>
          </div>
        </div>
      </div>
      <div className="px-7">
        <BrowseModelsGrid {...{ openCloneModal, openRenameModal }} />
      </div>
      {cloneContextHolder}
      {renameContextHolder}
    </div>
  );
}

export default function BuildMainMenu() {
  const [currentMenu, setCurrentMenu] = useReducer(
    (_: BuildMenuKey, value: BuildMenuKey) => value,
    null
  );

  const onSelect = (value: BuildMenuKey) => setCurrentMenu(value);

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex flex-col gap-2 w-full">
        {BUILD_MENU.map(({ id, title, description, Component }) => (
          <CollapsibleMenuItem<BuildMenuKey>
            key={id}
            opened={currentMenu === id}
            onSelect={onSelect}
            {...{ id, title, description }}
          >
            {({ opened }) => <Component opened={opened} />}
          </CollapsibleMenuItem>
        ))}
      </div>
    </div>
  );
}
