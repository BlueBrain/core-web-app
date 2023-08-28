'use client';

import { useState, useEffect, useMemo, ReactNode } from 'react';
import { useAtomValue } from 'jotai';
import { loadable } from 'jotai/utils';
import { Table, Button } from 'antd';

import {
  DateISOString,
  LaunchedSimCampUIConfigType,
  WorkflowExecutionStatusType,
} from '@/types/nexus';
import { launchedSimCampaignListAtom } from '@/state/simulate';
import ConfigList from '@/components/ConfigList';
import Link from '@/components/Link';
import { EyeIcon, SettingsIcon, FileIcon } from '@/components/icons';
import { dateColumnInfoToRender } from '@/util/date';
import { classNames } from '@/util/utils';
import ClockIcon from '@/components/icons/Clock';
import FullCircleIcon from '@/components/icons/FullCircle';
import EmptyCircleIcon from '@/components/icons/EmptyCircle';
import { collapseId } from '@/util/nexus';

const { Column } = Table;

const loadableLaunchedSimCampaignListAtom = loadable(launchedSimCampaignListAtom);

const expDesBaseUrl = '/experiment-designer/experiment-setup';
const exploreSimCampBaseUrl = '/explore/simulation-campaigns/test';

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
  return collapseId(config['@id']);
}

function getStatusIcon(status: WorkflowExecutionStatusType): ReactNode {
  switch (status) {
    case 'Running':
      return <ClockIcon />;
    case 'Done':
      return <FullCircleIcon />;
    case 'Failed':
      return <EmptyCircleIcon />;
    default:
      return <EmptyCircleIcon />;
  }
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

  const doneSimulationCount = useMemo(
    () => configs.filter((config) => config.status === 'Done').length,
    [configs]
  );

  const runningSimulationCount = useMemo(
    () => configs.filter((config) => config.status === 'Running').length,
    [configs]
  );

  return (
    <>
      <div className="text-2xl h-10 py-2 mt-7 font-bold">My simulation configurations</div>

      <div className="flex flex-row justify-between mt-2">
        <div className="flex flex-row gap-5">
          <small className="flex flex-row gap-1 self-center">
            <span className="text-primary-4">Simulations running</span>
            <span className="font-bold">{runningSimulationCount}</span>
          </small>
          <small className="flex flex-row gap-1 self-center">
            <span className="text-primary-4">Simulations done</span>
            <span className="font-bold">{doneSimulationCount}</span>
          </small>
        </div>
      </div>

      <ConfigList<LaunchedSimCampUIConfigType>
        isLoading={launchedSimCampaignsLoadable.state === 'loading'}
        configs={configs}
        showCreationDate={false}
        showCreatedBy={false}
        rowClassName={rowClassFn}
      >
        <Column
          title="STATUS"
          dataIndex="status"
          key="status"
          sorter={getSorterFn('status')}
          render={(status: WorkflowExecutionStatusType) => (
            <div className="flex flex-row gap-3 items-center justify-start">
              {getStatusIcon(status)} {status}
            </div>
          )}
        />
        <Column
          title="STARTED"
          dataIndex="startedAtTime"
          key="startedAtTime"
          render={dateRenderer}
          sorter={getSorterFn('startedAtTime')}
        />
        <Column
          title="COMPLETED"
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
            const iconColor = config.status === 'Done' ? 'text-[#7DFF8A]' : 'text-white';
            const defaultActionStyle = 'inline-block mr-2';

            return (
              <>
                <Button
                  size="small"
                  type="text"
                  className={classNames(
                    defaultActionStyle,
                    'align-bottom cursor-not-allowed',
                    iconColor
                  )}
                  title="Not implemented yet"
                >
                  <FileIcon fill={iconColor} />
                </Button>

                <Link href={`${expDesBaseUrl}?simulationCampaignUIConfigId=${extractId(config)}`}>
                  <Button
                    size="small"
                    type="text"
                    className={classNames(defaultActionStyle, iconColor)}
                  >
                    <SettingsIcon fill={iconColor} />
                  </Button>
                </Link>

                {config.status === 'Done' && (
                  <Link
                    href={`${exploreSimCampBaseUrl}?simCampId=${extractId(config)}`}
                    className="inline-block"
                  >
                    <Button
                      size="small"
                      type="text"
                      className={classNames(defaultActionStyle, iconColor)}
                    >
                      <EyeIcon />
                    </Button>
                  </Link>
                )}
              </>
            );
          }}
        />
      </ConfigList>
    </>
  );
}
