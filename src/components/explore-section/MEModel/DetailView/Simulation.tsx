import Image from 'next/image';
import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import { ErrorBoundary } from '@sentry/nextjs';
import { Empty, Skeleton } from 'antd';
import { useInView } from 'react-intersection-observer';

import { fetchJsonFileByUrl, queryES } from '@/api/nexus';
import { useSessionAtomValue } from '@/hooks/hooks';
import { getSimulationsPerMEModelQuery } from '@/queries/es';
import { selectedMEModelIdAtom } from '@/state/virtual-lab/build/me-model';
import { SingleNeuronSimulation } from '@/types/nexus';
import { SimulationPayload } from '@/types/simulation/single-neuron';
import { ensureArray } from '@/util/nexus';
import {
  SIMULATION_CONFIG_FILE_NAME_BASE,
  SIMULATION_PLOT_NAME,
  STIMULUS_PLOT_NAME,
} from '@/state/simulate/single-neuron-setter';
import { getSession } from '@/authFetch';
import { createHeaders } from '@/util/utils';
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

  const stimulusDistribution = ensureArray(simulation.distribution).find((o) =>
    o.name.startsWith(STIMULUS_PLOT_NAME)
  );
  const simulationDistribution = ensureArray(simulation.distribution).find((o) =>
    o.name.startsWith(SIMULATION_PLOT_NAME)
  );
  return (
    <div className="grid grid-cols-2 gap-8 border p-8">
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

      <div className="flex w-full flex-col items-end justify-center gap-2">
        {stimulusDistribution && (
          <SimulationImage
            {...{
              contentUrl: stimulusDistribution?.contentUrl,
              encodingFormat: stimulusDistribution.encodingFormat,
            }}
          />
        )}
        {simulationDistribution && (
          <SimulationImage
            {...{
              contentUrl: simulationDistribution.contentUrl,
              encodingFormat: simulationDistribution.encodingFormat,
            }}
          />
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

function SimulationImage({
  contentUrl,
  encodingFormat,
}: {
  contentUrl: string;
  encodingFormat: string;
}) {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { ref, inView } = useInView({
    threshold: 0.2,
  });

  useEffect(() => {
    if (inView) {
      (async () => {
        const session = await getSession();
        if (!session) {
          return null;
        }
        setLoading(true);
        fetch(contentUrl, {
          method: 'GET',
          headers: createHeaders(session.accessToken, {
            Accept: encodingFormat,
          }),
        })
          .then((response) => response.blob())
          .then((blob) => {
            setImage(URL.createObjectURL(blob));
            setLoading(false);
          })
          .catch(() => setLoading(false));
      })();
    }
  }, [contentUrl, encodingFormat, inView]);

  if (image) {
    return (
      <div className="relative flex h-96 w-full max-w-2xl items-center justify-center">
        <Image
          fill
          objectFit="contains"
          alt="Stimulus plot"
          className="border border-neutral-2"
          src={image}
        />
      </div>
    );
  }

  return (
    <div ref={ref} className="flex h-96 w-full max-w-2xl items-center justify-center">
      {loading ? (
        <Skeleton.Image
          active={loading}
          className="!h-full !w-full rounded-none"
          rootClassName="!h-full !w-full"
        />
      ) : (
        <Empty description="No thumbnail available" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
    </div>
  );
}
