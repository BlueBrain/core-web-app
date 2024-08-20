import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import { ErrorBoundary } from '@sentry/nextjs';


import SimulationPlotAsImage from './SimulationPlotAsImage';
import { fetchJsonFileByUrl, queryES } from '@/api/nexus';
import { useSessionAtomValue } from '@/hooks/hooks';
import { getSimulationsPerMEModelQuery } from '@/queries/es';
import { selectedMEModelIdAtom } from '@/state/virtual-lab/build/me-model';
import { SingleNeuronSimulation } from '@/types/nexus';
import { SimulationPayload } from '@/types/simulation/single-neuron';
import { ensureArray } from '@/util/nexus';
import {
  SIMULATION_CONFIG_FILE_NAME_BASE,
} from '@/state/simulate/single-neuron-setter';
import { getSession } from '@/authFetch';
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
      console.log('@@sims', sims)
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
  console.log('@@distributionJson', distributionJson)
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
    };

    fetchPayload();
  }, [simulation]);


  return (
    <div className="grid grid-cols-2 gap-8 border p-8">
      <div className="flex flex-col gap-10 text-primary-8">
        <NameDescription name={simulation.name} description={simulation.description} />
        <Params payload={distributionJson} />
        <div>
          <div className={subtitleStyle}>Injection location</div>
          <div className="font-bold">{distributionJson?.config.currentInjection.injectTo}</div>
        </div>
        <div>
          <div className={subtitleStyle}>Recording locations</div>
          <div className="flex gap-2 flex-flow-row">
            {distributionJson?.config.recordFrom.map((r) => (
              <div key={`${r.section}_${r.offset}`} className='flex border border-gray-100'>
                <span className='text-base font-light bg-primary-8 p-2'>Section: {r.section}</span>
                <span className='text-base font-normal text-primary-8'>Segment Offset: {r.offset}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col items-end justify-center gap-2">
        {distributionJson?.stimulus && (
          <SimulationPlotAsImage
            title='Stimulus'
            plotData={distributionJson.stimulus}
          />
        )}
        {distributionJson?.simulation && Object.entries(distributionJson?.simulation).map(([key, value]) => (
          <SimulationPlotAsImage
            key={key}
            title={`Recording ${key}`}
            plotData={value}
          />
        ))}
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

