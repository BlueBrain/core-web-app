'use client';

import { useState, useEffect } from 'react';
import { useAtomValue } from 'jotai';
import { loadable } from 'jotai/utils';
import { Table, Button } from 'antd';

import SearchInput from './SearchInput';
import { DateISOString, LaunchedSimCampUIConfigType } from '@/types/nexus';
import { launchedSimCampaignListAtom } from '@/state/simulate';
import ConfigList from '@/components/ConfigList';
import Link from '@/components/Link';
import { EyeIcon, SettingsIcon, FileIcon } from '@/components/icons';
import { dateColumnInfoToRender } from '@/util/date';
import { classNames } from '@/util/utils';

const { Column } = Table;

const loadableLaunchedSimCampaignListAtom = loadable(launchedSimCampaignListAtom);

const expDesBaseUrl = '/experiment-designer/experiment-setup';

const dateRenderer = (createdAtStr: DateISOString) => {
  const dateColumnInfo = dateColumnInfoToRender(createdAtStr);
  if (!dateColumnInfo) return null;

  return <span title={dateColumnInfo.tooltip}>{dateColumnInfo.text}</span>;
};

function getSorterFn<T extends LaunchedSimCampUIConfigType>(
  sortProp: 'status' | 'startedAtTime' | 'endedAtTime'
) {
  return (a: T, b: T) => (a[sortProp] < b[sortProp] ? 1 : -1);
}

function extractId(config: LaunchedSimCampUIConfigType) {
  return config['@id'].split('/').pop();
}

export default function LaunchedSimCampaignList() {
  const launchedSimCampaignsLoadable = useAtomValue(loadableLaunchedSimCampaignListAtom);

  const [configs, setConfigs] = useState<LaunchedSimCampUIConfigType[]>([]);

  useEffect(() => {
    if (launchedSimCampaignsLoadable.state !== 'hasData') return;

    setConfigs(launchedSimCampaignsLoadable.data);
  }, [launchedSimCampaignsLoadable]);

  const rowClassFn = (config: LaunchedSimCampUIConfigType) =>
    config.status === 'Done' ? 'text-green-400' : '';

  return (
    <>
      <div className="text-2xl h-10 py-2 px-6 mt-7 font-bold">Simulation Campaigns Run Status</div>

      <div className="flex justify-end mb-3">
        <SearchInput />
      </div>

      <ConfigList<LaunchedSimCampUIConfigType>
        isLoading={launchedSimCampaignsLoadable.state === 'loading'}
        configs={configs}
        showCreationDate={false}
        rowClassName={rowClassFn}
      >
        <Column title="STATUS" dataIndex="status" key="status" sorter={getSorterFn('status')} />
        <Column
          title="STARTED"
          dataIndex="startedAtTime"
          key="startedAtTime"
          render={dateRenderer}
          sorter={getSorterFn('startedAtTime')}
        />
        <Column
          title="COMPLETED AT"
          dataIndex="endedAtTime"
          key="endedAtTime"
          render={dateRenderer}
          sorter={getSorterFn('endedAtTime')}
        />
        <Column
          title="ACTIONS"
          key="actions"
          width={130}
          render={(config: LaunchedSimCampUIConfigType) => {
            const iconFillStyle = config.status === 'Done' ? '#7DFF8A' : 'white';
            const defaultActionStyle = 'inline-block mr-2';

            return (
              <>
                <Button
                  size="small"
                  type="text"
                  className={classNames(defaultActionStyle, 'align-bottom cursor-not-allowed')}
                  title="Not implemented yet"
                >
                  <FileIcon fill={iconFillStyle} />
                </Button>

                {config.status === 'Done' && (
                  <Link href="/explore/simulation-campaigns" className="inline-block">
                    <Button
                      size="small"
                      type="text"
                      className={classNames(defaultActionStyle, 'cursor-not-allowed')}
                      title="Not implemented yet"
                    >
                      <EyeIcon fill={iconFillStyle} />
                    </Button>
                  </Link>
                )}

                <Link href={`${expDesBaseUrl}?simulationCampaignUIConfigId=${extractId(config)}`}>
                  <Button size="small" type="text" className={defaultActionStyle}>
                    <SettingsIcon fill={iconFillStyle} />
                  </Button>
                </Link>
              </>
            );
          }}
        />
      </ConfigList>
    </>
  );
}
