'use client';

import { useCallback, useEffect } from 'react';

import { LoadingOutlined } from '@ant-design/icons';
import { Collapse, CollapseProps, ConfigProvider, Spin, Tabs } from 'antd';
import { useAtomValue, useSetAtom } from 'jotai';
import { loadable } from 'jotai/utils';
import { useQueryState } from 'nuqs';
import BookmarkedResourcesTable from './BookmarkedResourcesTable';
import { DataType } from '@/constants/explore-section/list-views';
import { bookmarksForProjectAtomFamily } from '@/state/virtual-lab/bookmark';
import {
  EXPERIMENT_DATA_TYPES,
  ExperimentTypeNames,
} from '@/constants/explore-section/data-types/experiment-data-types';
import {
  MODEL_DATA_TYPES,
  ModelTypeNames,
} from '@/constants/explore-section/data-types/model-data-types';
import { BookmarkTabsName, isModel, isSimulation } from '@/types/virtual-lab/bookmark';
import { Btn } from '@/components/Btn';
import { SimulationTypeNames } from '@/types/simulation/single-neuron';
import { SIMULATION_DATA_TYPES } from '@/constants/explore-section/data-types/simulation-data-types';

type Props = {
  labId: string;
  projectId: string;
};

export default function BookmarkTabs({ labId, projectId }: Props) {
  const [activePanel, setActivePanel] = useQueryState('category');
  const bookmarks = useAtomValue(
    loadable(bookmarksForProjectAtomFamily({ virtualLabId: labId, projectId }))
  );
  const refreshBookmarks = useSetAtom(
    bookmarksForProjectAtomFamily({ virtualLabId: labId, projectId })
  );

  useEffect(() => {
    refreshBookmarks();
  }, [refreshBookmarks]);

  const tabKeyFromQueryParam = (queryParam: string | null) => {
    if (!queryParam) {
      return BookmarkTabsName.EXPERIMENTS;
    }

    if (isModel(activePanel)) {
      return BookmarkTabsName.MODELS;
    }

    if (isSimulation(activePanel)) {
      return BookmarkTabsName.SIMULATIONS;
    }

    return BookmarkTabsName.EXPERIMENTS;
  };

  const updateQueryParam = (activeKey: string) => {
    switch (activeKey) {
      case 'experiments':
        return setActivePanel(ExperimentTypeNames.MORPHOLOGY);
      case 'models':
        return setActivePanel(ModelTypeNames.E_MODEL);
      case 'simulations':
        return setActivePanel(SimulationTypeNames.SYNAPTOME_SIMULATION);
      default:
        return setActivePanel(ExperimentTypeNames.MORPHOLOGY);
    }
  };

  const resourceTypeFromTabName = (tab: BookmarkTabsName) => {
    switch (tab) {
      case BookmarkTabsName.EXPERIMENTS:
        return EXPERIMENT_DATA_TYPES;
      case BookmarkTabsName.MODELS:
        return MODEL_DATA_TYPES;
      case BookmarkTabsName.SIMULATIONS:
        return SIMULATION_DATA_TYPES;
      default:
        throw new Error(`${tab} is not supported as a bookmark`);
    }
  };

  const collapsibleItems = useCallback(
    (tab: BookmarkTabsName) => {
      if (bookmarks.state !== 'hasData') {
        return [];
      }

      const resourceTypes = resourceTypeFromTabName(tab);

      const keys = Object.keys(resourceTypes) as DataType[];

      return keys
        .filter((t) => bookmarks.data[t]?.length)
        .map((t) => {
          return {
            key: resourceTypes[t].name,
            'data-testid': `${t}-tab`,
            label: (
              <div>
                <span className="text-center text-xl font-bold leading-7 text-primary-8">
                  {resourceTypes[t].title}
                </span>
                <span className="ml-2 text-sm font-normal text-gray-600">
                  {bookmarks.data[t]?.length ?? 0} pinned datasets
                </span>
              </div>
            ),
            children:
              bookmarks.data[t]?.length > 0 ? (
                <BookmarkedResourcesTable
                  dataType={t}
                  bookmarkTabName={tab}
                  labId={labId}
                  projectId={projectId}
                />
              ) : (
                <p>There are no pinned datasets for {resourceTypes[t].title}</p>
              ),
          };
        }) as CollapseProps['items'];
    },
    [bookmarks, labId, projectId]
  );

  const tabContent = (tab: BookmarkTabsName) => {
    return (
      <div className="mb-5 w-full bg-white p-8">
        {bookmarks.state === 'loading' && (
          <Spin indicator={<LoadingOutlined />} className="w-full" />
        )}
        {bookmarks.state === 'hasError' && (
          <p className="text-center font-bold text-primary-8">
            Library resources could not be loaded
          </p>
        )}

        {bookmarks.state === 'hasData' &&
          (collapsibleItems(tab)?.length ? (
            <Collapse
              items={collapsibleItems(tab)}
              defaultActiveKey={activePanel ? [activePanel] : []}
              expandIconPosition="end"
              destroyInactivePanel
              onChange={(key) => {
                if (Array.isArray(key) && key.length === 1) {
                  setActivePanel(key[0]);
                }
              }}
            />
          ) : (
            <p className="text-center font-bold text-primary-8">
              There are no {tab} resources in the library
            </p>
          ))}
      </div>
    );
  };

  return (
    <div className="mr-5">
      <ConfigProvider
        theme={{
          components: {
            Collapse: {
              headerBg: '#ffffff',
            },
            Tabs: {
              horizontalItemPadding: '0px',
              inkBarColor: '#ffffff00',
              itemActiveColor: '#003A8C',
              itemSelectedColor: '#003A8C',
              itemColor: '#ffffff',
            },
          },
          token: {
            borderRadius: 0,
          },
        }}
      >
        <Tabs
          activeKey={tabKeyFromQueryParam(activePanel)}
          onChange={updateQueryParam}
          items={[
            {
              key: 'experiments',
              label: (
                <div className="align-center flex w-[200px] items-center justify-center text-xl font-bold">
                  Experimental data
                </div>
              ),
              children: tabContent(BookmarkTabsName.EXPERIMENTS),
            },
            {
              key: 'models',
              label: (
                <div className="align-center flex w-[200px] items-center justify-center text-xl font-bold">
                  Models
                </div>
              ),
              children: tabContent(BookmarkTabsName.MODELS),
            },
            {
              key: 'simulations',
              label: (
                <div className="align-center flex w-[200px] items-center justify-center text-xl font-bold">
                  Simulations
                </div>
              ),
              children: tabContent(BookmarkTabsName.SIMULATIONS),
            },
          ]}
          renderTabBar={(tabBarProps, DefaultTabBar) => {
            return (
              <DefaultTabBar
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...tabBarProps}
              >
                {(node) => (
                  <Btn
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    {...node.props}
                    key={node.key}
                    className={
                      node.key === tabBarProps.activeKey
                        ? 'bg-white'
                        : 'border border-primary-4 bg-transparent'
                    }
                  >
                    {node}
                  </Btn>
                )}
              </DefaultTabBar>
            );
          }}
          tabBarStyle={{ marginBottom: 0 }}
        />
      </ConfigProvider>
    </div>
  );
}
