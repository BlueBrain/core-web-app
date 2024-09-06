import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import { ErrorBoundary } from '@sentry/nextjs';
import { InfoCircleOutlined } from '@ant-design/icons';
import { ConfigProvider, Segmented } from 'antd';
import { SegmentedValue } from 'antd/lib/segmented';
import get from 'lodash/get';

import SimulationPlotAsImage from './SimulationPlotAsImage';
import { fetchJsonFileByUrl, queryES } from '@/api/nexus';
import { useSessionAtomValue } from '@/hooks/hooks';
import { getSimulationsPerMEModelQuery } from '@/queries/es';
import { selectedMEModelIdAtom } from '@/state/virtual-lab/build/me-model';
import { SingleNeuronSimulation } from '@/types/nexus';
import { SimulationPayload } from '@/types/simulation/single-neuron';
import { ensureArray } from '@/util/nexus';
import { SIMULATION_CONFIG_FILE_NAME_BASE } from '@/state/simulate/single-neuron-setter';
import { getSession } from '@/authFetch';
import { classNames } from '@/util/utils';
import CustomPopover from '@/components/simulate/single-neuron/molecules/Popover';
import SimpleErrorComponent from '@/components/GenericErrorFallback';

type LocationParams = {
  projectId: string;
  virtualLabId: string;
};

export default function Simulation({ params }: { params: LocationParams }) {
  const session = useSessionAtomValue();
  const selectedMEModelId = useAtomValue(selectedMEModelIdAtom);
  const [simulations, setSimulations] = useState<SingleNeuronSimulation[]>([]);

  useEffect(() => {
    if (!selectedMEModelId || !session) return;

    const fetchSims = async () => {
      const simulationsPerMEModelQuery = getSimulationsPerMEModelQuery(selectedMEModelId);
      const sims = await queryES<SingleNeuronSimulation>(simulationsPerMEModelQuery, session, {
        org: params.virtualLabId,
        project: params.projectId,
      });
      setSimulations(sims);
    };
    fetchSims();
  }, [params.projectId, params.virtualLabId, selectedMEModelId, session]);

  if (!simulations)
    return (
      <div className="flex h-full items-center justify-center text-4xl font-bold text-primary-9">
        No simulations available.
      </div>
    );

  return (
    <div className="flex w-full flex-col gap-2">
      {simulations.map((sim) => (
        <ErrorBoundary fallback={SimpleErrorComponent} key={sim['@id']}>
          <SimulationDetail simulation={sim} />
        </ErrorBoundary>
      ))}
    </div>
  );
}

const subtitleStyle = 'font-thin text-slate-600';

function SimulationDetail({ simulation }: { simulation: SingleNeuronSimulation }) {
  const [distributionJson, setDistributionJson] = useState<SimulationPayload | null>(null);
  const [simultionPlot, setSimulationPlot] = useState<SegmentedValue | undefined>(undefined);

  useEffect(() => {
    const configuration = ensureArray(simulation.distribution).find((o) =>
      o.name.startsWith(SIMULATION_CONFIG_FILE_NAME_BASE)
    );
    if (!simulation || !configuration) return;

    const fetchPayload = async () => {
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
    };

    fetchPayload();
  }, [simulation]);

  return (
    <div className="grid grid-cols-2 gap-8 border p-8">
      <div className="flex flex-col gap-10 text-primary-8">
        <NameDescription name={simulation.name} description={simulation.description} />
        <Params payload={distributionJson} />
        <div>
          <div className="text-lg font-bold text-primary-8">Injection location</div>
          <div className="mt-2 flex max-w-max items-center justify-center border border-gray-100 px-5 py-1 font-bold">
            {distributionJson?.config.currentInjection.injectTo}
          </div>
        </div>
        <div>
          <div className="text-lg font-bold text-primary-8">Recording locations</div>
          <div className="mt-2 grid grid-flow-col gap-2">
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
      </div>

      <div className="flex w-full flex-col items-end justify-center gap-5">
        {distributionJson?.stimulus && (
          <div className="flex w-full max-w-2xl flex-col">
            <div className="mb-4 text-2xl font-bold text-primary-8">Stimulus</div>
            <SimulationPlotAsImage yTitle="Current [nA]" plotData={distributionJson.stimulus} />
          </div>
        )}

        {distributionJson?.simulation && (
          <div className="flex w-full max-w-2xl flex-col">
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
        <div className={subtitleStyle}>Voltage initial</div>
        <div>
          <span className="font-bold">{payload.config.conditions.vinit}</span>
          <span>&nbsp;mV</span>
        </div>
      </div>

      <div>
        <div className={subtitleStyle}>Holding current</div>
        <div>
          <span className="font-bold">{payload.config.conditions.vinit}</span>
          <span>&nbsp;nA</span>
        </div>
      </div>
    </div>
  );
}
