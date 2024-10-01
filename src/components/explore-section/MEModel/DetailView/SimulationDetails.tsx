import React, { useEffect, useState } from 'react';
import { InfoCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import { ConfigProvider, Segmented, Spin } from 'antd';
import { SegmentedValue } from 'antd/lib/segmented';
import get from 'lodash/get';

import SimulationPlotAsImage from './SimulationPlotAsImage';
import CustomPopover from '@/components/simulate/single-neuron/molecules/Popover';
import { fetchJsonFileByUrl } from '@/api/nexus';
import { SingleNeuronSimulation, SynaptomeSimulation } from '@/types/nexus';
import {
  SimulationPayload,
  SingleNeuronModelSimulationConfig,
} from '@/types/simulation/single-neuron';
import { ensureArray } from '@/util/nexus';
import { SIMULATION_CONFIG_FILE_NAME_BASE } from '@/state/simulate/single-neuron-setter';
import { getSession } from '@/authFetch';
import { classNames } from '@/util/utils';

const subtitleStyle = 'font-thin text-neutral-4';
type GenericSimulation = SingleNeuronSimulation | SynaptomeSimulation;

type Props<T> = {
  index: number;
  simulation: T;
  children?: ({ config }: { config: SingleNeuronModelSimulationConfig }) => React.ReactNode;
};

export default function SimulationDetail<T extends GenericSimulation>({
  index,
  simulation,
  children,
}: Props<T>) {
  const [distributionJson, setDistributionJson] = useState<SimulationPayload | null>(null);
  const [simultionPlot, setSimulationPlot] = useState<SegmentedValue | undefined>(undefined);
  const [loadingConfig, setLoadingConfig] = useState(false);

  useEffect(() => {
    const configuration = ensureArray(simulation.distribution).find((o) =>
      o.name.startsWith(SIMULATION_CONFIG_FILE_NAME_BASE)
    );
    if (!simulation || !configuration) return;

    const fetchPayload = async () => {
      setLoadingConfig(true);
      try {
        const session = await getSession();
        if (!session) {
          throw new Error('No session was found');
        }
        const jsonFile = await fetchJsonFileByUrl<SimulationPayload>(
          configuration.contentUrl,
          session
        );
        if (!jsonFile) return;
        setDistributionJson(jsonFile);
        setSimulationPlot(Object.keys(jsonFile.simulation).at(0));
      } catch (error) {
        //
      } finally {
        setLoadingConfig(false);
      }
    };

    fetchPayload();
  }, [simulation]);

  if (loadingConfig) {
    return (
      <div className="flex h-full min-h-64 w-full flex-col items-center justify-center gap-3">
        <Spin indicator={<LoadingOutlined />} size="large" />
        <h2 className="font-light text-primary-9">Loading simulation {index + 1}...</h2>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-8 border p-8">
      <div className="flex flex-[0_1_60%] flex-col gap-10 text-primary-8">
        <NameDescription name={simulation.name} description={simulation.description} />
        <Params payload={distributionJson} />
        <div className="flex w-full flex-col gap-2">
          <div className="text-lg font-bold text-primary-8">Injection location</div>
          <div className="mt-2 flex max-w-max items-center justify-center border border-gray-100 px-5 py-1 font-bold">
            {distributionJson?.config.currentInjection.injectTo}
          </div>
        </div>
        <div className="flex w-full flex-col gap-2">
          <div className="text-lg font-bold text-primary-8">Recording locations</div>
          <div className="mt-2 flex items-center gap-4">
            {distributionJson?.config.recordFrom.map((r, ind) => (
              <div key={`${r.section}_${r.offset}`} className="flex flex-col gap-1">
                <div className="uppercase text-gray-400">Recording {ind + 1}</div>
                <div className="flex max-w-max items-center justify-start gap-3 border border-gray-100 px-5 py-1">
                  <span className="text-base font-bold capitalize text-primary-8">{r.section}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm uppercase">offset</span>
                    <CustomPopover
                      message="The recording position relative to the section. 0 being the start of the section and 1 being the end."
                      placement="bottomRight"
                      when={['hover']}
                    >
                      <InfoCircleOutlined className="cursor-pointer" />
                    </CustomPopover>
                    <span className="py-1 text-base font-bold text-primary-8">{r.offset}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {distributionJson?.config && children?.({ config: distributionJson.config })}
      </div>

      <div className="flex w-full flex-[1_1_40%] flex-col items-end justify-center gap-5">
        {distributionJson?.stimulus && (
          <div className="flex w-full flex-col">
            <div className="mb-4 text-2xl font-bold text-primary-8">Stimulus</div>
            <SimulationPlotAsImage yTitle="Current [nA]" plotData={distributionJson.stimulus} />
          </div>
        )}

        {distributionJson?.simulation && (
          <div className="flex w-full flex-col">
            <div className="mb-4 text-2xl font-bold text-primary-8">Recording</div>
            <ConfigProvider theme={{ hashed: false }}>
              <Segmented
                defaultValue="center"
                className={classNames(
                  'mb-4 max-w-max',
                  'bg-white [&_.ant-segmented-group]:gap-2',
                  '[&_.ant-segmented-item]:border [&_.ant-segmented-item]:border-gray-400 [&_.ant-segmented-item]:bg-white',
                  '[&_.ant-segmented-item-selected]:!border-primary-8 [&_.ant-segmented-item-selected]:!bg-primary-8 [&_.ant-segmented-item-selected]:text-white [&_.ant-segmented-item-selected]:!shadow-md'
                )}
                onChange={(value) => setSimulationPlot(value)}
                value={simultionPlot}
                options={Object.entries(distributionJson.simulation).map(([key]) => ({
                  label: key,
                  value: key,
                }))}
              />
            </ConfigProvider>
            {simultionPlot && (
              <SimulationPlotAsImage plotData={get(distributionJson.simulation, simultionPlot)} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function NameDescription({ name, description }: { name: string; description: string }) {
  return (
    <div className="">
      <div className={subtitleStyle}>Name</div>
      <div className="text-2xl font-bold">{name}</div>
      <p className="">{description}</p>
    </div>
  );
}

function Params({ payload }: { payload: SimulationPayload | null }) {
  if (!payload) return null;

  return (
    <div className="flex justify-between gap-10">
      <div>
        <div className={subtitleStyle}>Temperature</div>
        <div>
          <span className="font-bold">{payload.config.conditions.celsius}</span>
          <span>&nbsp;°C</span>
        </div>
      </div>

      <div>
        <div className={subtitleStyle}>Time step</div>
        <div>
          <span className="font-bold">0.01</span>
          <span>&nbsp;ms</span>
        </div>
      </div>

      <div>
        <div className={subtitleStyle}>Initial voltage</div>
        <div>
          <span className="font-bold">{payload.config.conditions.vinit}</span>
          <span>&nbsp;mV</span>
        </div>
      </div>

      <div>
        <div className={subtitleStyle}>Holding current</div>
        <div>
          <span className="font-bold">{payload.config.conditions.hypamp}</span>
          <span>&nbsp;nA</span>
        </div>
      </div>
    </div>
  );
}
