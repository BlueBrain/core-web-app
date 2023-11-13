import kebabCase from 'lodash/kebabCase';
import { useCallback, useReducer } from 'react';
import { Button } from 'antd';
import { useRouter } from 'next/navigation';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';

import { CURATED_MODELS } from '../BrainConfigPanel/BuildSideBar';
import { EyeIcon } from '../icons';
import CloneIcon from '../icons/Clone';
import useCloneConfigModal from '@/hooks/config-clone-modal';
import Link from '@/components/Link';
import { cloneBrainModelConfig } from '@/api/nexus';
import { getBrainModelConfigsByNameQuery } from '@/queries/es';
import { BrainModelConfigResource } from '@/types/nexus';
import { collapseId } from '@/util/nexus';
import { classNames } from '@/util/utils';

type CuratedModel = {
  id: string;
  name: string;
  description: string;
};
interface CollapsibleMenuProps {
  opened: boolean;
  title: string;
  description: string;
}

type BuildMenuKey = '' | 'create-model' | 'browse-models';

const BUILD_BASE_HREF = '/build/cell-composition/interactive';

function CollapsibleMenuItem({
  id,
  opened,
  title,
  description,
  onSelect,
  Header,
  children,
}: {
  id: BuildMenuKey;
  opened: boolean;
  title: string;
  description: string;
  onSelect: (id: BuildMenuKey) => void;
  Header: (props: CollapsibleMenuProps) => JSX.Element;
  children: React.ReactNode;
}) {
  const onSelectCollapsible = () => onSelect(opened ? '' : id);

  return (
    <div
      id={id}
      className={classNames('bg-white p-7 group', opened ? 'shadow-lg' : 'hover:bg-primary-8')}
    >
      <button
        type="button"
        onClick={onSelectCollapsible}
        className={classNames('w-full cursor-pointer', opened && 'mb-8')}
      >
        <Header {...{ opened, title, description }} />
      </button>
      <div className={classNames('transition-all duration-200', !opened && 'hidden')}>
        {children}
      </div>
    </div>
  );
}

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

function BuildModelHeader({ title, description, opened }: CollapsibleMenuProps) {
  return (
    <div className="relative inline-flex flex-col w-full items-start justify-start">
      <h2
        className={classNames(
          'text-primary-8 font-bold text-xl',
          !opened && 'group-hover:text-white'
        )}
      >
        {title}
      </h2>
      <p
        className={classNames(
          'text-gray-400 font-normal w-1/3 line-clamp-2 text-left',
          !opened && 'group-hover:text-white'
        )}
      >
        {description}
      </p>
      {opened ? (
        <MinusOutlined
          className={classNames(
            'absolute top-1/2 -translate-y-1/2 right-7 text-primary-8',
            !opened && 'group-hover:text-white'
          )}
        />
      ) : (
        <PlusOutlined
          className={classNames(
            'absolute top-1/2 -translate-y-1/2 right-7 text-primary-8',
            !opened && 'group-hover:text-white'
          )}
        />
      )}
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
      <div className="grid grid-flow-col gap-2">
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

function BuildBrowseModel() {
  return <div />;
}

export default function BuildMainMenu() {
  const [currentMenu, setCurrentMenu] = useReducer(
    (_: BuildMenuKey, value: BuildMenuKey) => value,
    ''
  );

  const onSelect = (value: BuildMenuKey) => setCurrentMenu(value);

  return (
    <div className="flex flex-col gap-2 w-full">
      <CollapsibleMenuItem
        id="create-model"
        opened={currentMenu === 'create-model'}
        onSelect={onSelect}
        Header={BuildModelHeader}
        title="Create new brain models"
        description="Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
      >
        <BuildModelList />
      </CollapsibleMenuItem>
      <CollapsibleMenuItem
        id="browse-models"
        opened={currentMenu === 'browse-models'}
        onSelect={onSelect}
        Header={BuildModelHeader}
        title="Browse brain models"
        description="Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
      >
        <BuildBrowseModel />
      </CollapsibleMenuItem>
    </div>
  );
}
