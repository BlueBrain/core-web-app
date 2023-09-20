'use client';

import { ReactNode, Suspense, useState, useCallback, useEffect } from 'react';
import { Button, ConfigProvider } from 'antd';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import debounce from 'lodash/debounce';
import { useRouter } from 'next/navigation';

import RecentConfigList from './RecentConfigList';
import ConfigSearchList from './ConfigSearchList';
import tableTheme from '@/components/ConfigList/antd-theme';
import {
  searchConfigListTypeAtom,
  searchConfigListStringAtom,
  configListAtom,
} from '@/state/brain-model-config-list';
import { CURATED_MODELS } from '@/components/BrainConfigPanel';
import Link from '@/components/Link';
import { classNames } from '@/util/utils';
import IconPlus from '@/components/icons/Plus';
import ArrowLeftIcon from '@/components/icons/ArrowLeft';
import SettingsIcon from '@/components/icons/Settings';
import UserIcon from '@/components/icons/User';
import ArchiveIcon from '@/components/icons/Archive';
import CloneIcon from '@/components/icons/Clone';

import useCloneConfigModal from '@/hooks/config-clone-modal';
import { BrainModelConfigResource } from '@/types/nexus';
import { cloneBrainModelConfig } from '@/api/nexus';
import { getBrainModelConfigsByNameQuery } from '@/queries/es';
import { collapseId } from '@/util/nexus';
import styles from './brain-config-loader-view.module.scss';

type PanelProps = {
  className?: string;
  title: string;
  description: string;
  href: string;
  modelId: string;
};

function Panel({ title, description, href, className = '', modelId }: PanelProps) {
  const router = useRouter();
  const { createModal: createCloneModal, contextHolder: cloneContextHolder } =
    useCloneConfigModal<BrainModelConfigResource>(
      cloneBrainModelConfig,
      getBrainModelConfigsByNameQuery
    );

  const openCloneModal = useCallback(() => {
    const config = {
      '@id': modelId,
      name: title,
      description,
    } as BrainModelConfigResource;

    createCloneModal(config, () => router.push(href));
  }, [description, title, modelId, createCloneModal, router, href]);

  return (
    <div className={classNames(styles.panel, className)}>
      <header>
        <div>{title}</div>
        <div className="flex items-center gap-4">
          <Link href={href}>
            <IconPlus />
          </Link>
          <button onClick={openCloneModal} type="button">
            <CloneIcon />
          </button>
        </div>
      </header>
      <div>{description}</div>
      {cloneContextHolder}
    </div>
  );
}

type TabType = 'public' | 'personal' | 'archive';
type SearchTab = {
  id: TabType;
  name: string;
  icon: ReactNode;
};

const searchTabs: SearchTab[] = [
  {
    id: 'public',
    name: 'Public configurations',
    icon: <SettingsIcon />,
  },
  {
    id: 'personal',
    name: 'My configurations',
    icon: <UserIcon />,
  },
  {
    id: 'archive',
    name: 'Archives',
    icon: <ArchiveIcon />,
  },
];

function BrainModelConfigsCount() {
  const brainModelConfigs = useAtomValue(configListAtom);

  return <span>{brainModelConfigs.length}</span>;
}

type BrainConfigLoaderProps = {
  baseHref: string;
};

export default function BrainConfigLoader({ baseHref }: BrainConfigLoaderProps) {
  const [activeTabId, setActiveTabId] = useAtom(searchConfigListTypeAtom);
  const setSearchString = useSetAtom(searchConfigListStringAtom);

  const [searchInputValue, setSearchInputValue] = useState<string>('');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const setSearchStringDebounced = useCallback(
    debounce((searchStr: string) => setSearchString(searchStr), 300),
    [setSearchString]
  );

  const setSearch = (searchStr: string) => {
    setSearchInputValue(searchStr);
    setSearchStringDebounced(searchStr);
  };

  useEffect(() => {
    setSearchString('');
  }, [setSearchString]);

  return (
    <div className={styles.container}>
      {CURATED_MODELS.map((model) => (
        <Panel
          key={model.name}
          className={styles.curatedModel}
          title={model.name}
          description={model.description}
          href={`${baseHref}?brainModelConfigId=${encodeURIComponent(collapseId(model.id))}`}
          modelId={model.id}
        />
      ))}

      <ConfigProvider theme={tableTheme}>
        <div className={styles.modelListView}>
          <RecentConfigList baseHref={baseHref} />

          <div>
            {searchTabs.map((tab) => (
              <Button
                key={tab.id}
                type="text"
                className={classNames(
                  styles.tabBtn,
                  activeTabId === tab.id ? styles.activeTabBtn : null
                )}
                icon={tab.icon}
                onClick={() => setActiveTabId(tab.id)}
              >
                {tab.name}
              </Button>
            ))}

            <div className={styles.searchCtrlContainer}>
              <small>
                <span className={styles.textPrimary4}>Total configurations: </span>{' '}
                <Suspense fallback={null}>
                  <BrainModelConfigsCount />
                </Suspense>
              </small>
              <input
                className={styles.searchInput}
                placeholder="Search brain configuration..."
                value={searchInputValue}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <ConfigSearchList baseHref={baseHref} />
          </div>
        </div>
      </ConfigProvider>

      <Link className={styles.backBtn} href="/">
        <ArrowLeftIcon />
        Back home
      </Link>
    </div>
  );
}
