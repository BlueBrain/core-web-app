'use client';

import { ReactNode, Suspense } from 'react';
import { Button, ConfigProvider } from 'antd';
import { useAtom, useAtomValue } from 'jotai/react';

import RecentConfigList from './RecentConfigList';
import ConfigSearchList from './ConfigSearchList';
import tableTheme from './antd-theme';
import { searchTypeAtom, brainModelConfigListAtom } from './state';
import { CURATED_MODELS } from '@/components/BrainConfigPanel';
import Link from '@/components/Link';
import { classNames } from '@/util/utils';
import IconPlus from '@/components/icons/Plus';
import ArrowLeftIcon from '@/components/icons/ArrowLeft';
import SettingsIcon from '@/components/icons/Settings';
import UserIcon from '@/components/icons/User';
import ArchiveIcon from '@/components/icons/Archive';

import styles from './brain-config-loader-view.module.scss';

type PanelProps = {
  className?: string;
  title: string;
  description: string;
  href: string;
};

function Panel({ title, description, href, className = '' }: PanelProps) {
  return (
    <Link href={href} className={classNames(styles.panel, className)}>
      <header>
        <div>{title}</div>
        <IconPlus />
      </header>
      <div>{description}</div>
    </Link>
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
  const brainModelConfigs = useAtomValue(brainModelConfigListAtom);

  return <span>{brainModelConfigs.length}</span>;
}

type BrainConfigLoaderProps = {
  baseHref: string;
};

export default function BrainConfigLoader({ baseHref }: BrainConfigLoaderProps) {
  const [activeTabId, setActiveTabId] = useAtom(searchTypeAtom);

  return (
    <div className={styles.container}>
      {CURATED_MODELS.map((model) => (
        <Panel
          key={model.name}
          className={styles.curatedModel}
          title={model.name}
          description={model.description}
          href={`${baseHref}?brainModelConfigId=${encodeURIComponent(model.id)}`}
        />
      ))}

      <ConfigProvider theme={tableTheme}>
        <div className={styles.modelListView}>
          <Suspense>
            <RecentConfigList baseHref={baseHref} />
          </Suspense>

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
                <span className={styles.textPrimary5}>Total configurations: </span>{' '}
                <Suspense fallback={null}>
                  <BrainModelConfigsCount />
                </Suspense>
              </small>
              <input className={styles.searchInput} placeholder="Search brain configuration..." />
            </div>

            <Suspense>
              <ConfigSearchList baseHref={baseHref} />
            </Suspense>
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
