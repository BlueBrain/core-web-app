'use client';

import { useState, ReactNode } from 'react';
import { Button, ConfigProvider } from 'antd';

import { CURATED_MODELS } from './placeholder-data';
import RecentConfigList from './RecentConfigList';
import ConfigSearchList from './ConfigSearchList';
import { tableTheme } from './antd-theme';
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

type TabType = 'public' | 'my' | 'archives';
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
    id: 'my',
    name: 'My configurations',
    icon: <UserIcon />,
  },
  {
    id: 'archives',
    name: 'Archives',
    icon: <ArchiveIcon />,
  },
];

type BrainConfigLoaderProps = {
  baseHref: string;
};

export default function BrainConfigLoader({ baseHref }: BrainConfigLoaderProps) {
  const [activeTabId, setActiveTabId] = useState<TabType>('public');

  return (
    <div className={styles.container}>
      {CURATED_MODELS.map((model) => (
        <Panel
          key={model.title}
          className={styles.curatedModel}
          title={model.title}
          description={model.description}
          href={`${baseHref}?brainConfigId=${encodeURIComponent(model.id)}`}
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
                <span className={styles.textPrimary4}>Total configurations: </span> 34
              </small>
              <input className={styles.searchInput} placeholder="Search brain configuration..." />
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
