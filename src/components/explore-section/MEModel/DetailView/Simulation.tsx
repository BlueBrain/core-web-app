import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import { ErrorBoundary } from '@sentry/nextjs';
import { Empty } from 'antd';

import { fetchJsonFileByUrl, queryES } from '@/api/nexus';
import { useSessionAtomValue } from '@/hooks/hooks';
import { getSimulationsPerMEModelQuery } from '@/queries/es';
import { selectedMEModelIdAtom } from '@/state/virtual-lab/build/me-model';
import { SingleNeuronSimulation } from '@/types/nexus';
import { SingleNeuronSimulationPayload } from '@/types/simulation/single-neuron';
import SimpleErrorComponent from '@/components/GenericErrorFallback';

export default function Simulation() {
  const session = useSessionAtomValue();
  const selectedMEModelId = useAtomValue(selectedMEModelIdAtom);
  const [simulations, setSimulations] = useState<SingleNeuronSimulation[]>([]);

  useEffect(() => {
    if (!selectedMEModelId || !session) return;

    const fetchSims = async () => {
      const simulationsPerMEModelQuery = getSimulationsPerMEModelQuery(selectedMEModelId);
      const sims = await queryES<SingleNeuronSimulation>(simulationsPerMEModelQuery, session);
      setSimulations(sims);
    };
    fetchSims();
  }, [selectedMEModelId, session]);

  if (!simulations)
    return (
      <div className="flex h-full items-center justify-center text-4xl font-bold text-primary-9">
        No simulations available.
      </div>
    );

  return (
    <div>
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
  const session = useSessionAtomValue();
  const [distributionJson, setDistributionJson] = useState<SingleNeuronSimulationPayload | null>(
    null
  );

  useEffect(() => {
    if (!simulation || !session) return;

    const fetchPayload = async () => {
      const jsonFile = await fetchJsonFileByUrl<SingleNeuronSimulationPayload>(
        simulation.distribution.contentUrl,
        session
      );
      if (!jsonFile) return;

      setDistributionJson(jsonFile);
    };
    fetchPayload();
  }, [simulation, session]);

  return (
    <div className="grid grid-cols-2 border p-8">
      <div className="flex flex-col gap-10 text-primary-8">
        <NameDescription name={simulation.name} description={simulation.description} />
        <Params payload={distributionJson} />
        <div>
          <div className={subtitleStyle}>Injection location</div>
          <div className="font-bold">{distributionJson?.config.injectTo}</div>
        </div>
        <div>
          <div className={subtitleStyle}>Recording locations</div>
          <div className="font-bold">
            {distributionJson?.config.recordFrom.map((r) => <span key={r}>{r}</span>)}
          </div>
        </div>
      </div>

      <div>
        <StimuliPreview />
        <RecordingPreview />
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

function Params({ payload }: { payload: SingleNeuronSimulationPayload | null }) {
  if (!payload) return null;

  return (
    <div className="flex justify-between gap-10">
      <div>
        <div className={subtitleStyle}>Temperature</div>
        <div>
          <span className="font-bold">{payload.config.celsius}</span>
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
          <span className="font-bold">{payload.config.vinit}</span>
          <span>&nbsp;mV</span>
        </div>
      </div>

      <div>
        <div className={subtitleStyle}>Holding current</div>
        <div>
          <span className="font-bold">{payload.config.hypamp}</span>
          <span>&nbsp;nA</span>
        </div>
      </div>
    </div>
  );
}

function StimuliPreview() {
  return <Empty description="No traces available" image={Empty.PRESENTED_IMAGE_SIMPLE} />;
}

function RecordingPreview() {
  return <Empty description="No traces available" image={Empty.PRESENTED_IMAGE_SIMPLE} />;
}
