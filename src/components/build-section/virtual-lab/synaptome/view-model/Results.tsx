import { useEffect, useState } from 'react';
import { ErrorBoundary } from '@sentry/nextjs';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

import { getSimulationsPerModelQuery } from '@/queries/es';
import { SynaptomeSimulation } from '@/types/nexus';
import { getSession } from '@/authFetch';
import { queryES } from '@/api/nexus';

import SimulationDetail from '@/components/explore-section/MEModel/DetailView/SimulationDetails';
import ConfigItem from '@/components/build-section/virtual-lab/synaptome/molecules/ConfigItem';
import SimpleErrorComponent from '@/components/GenericErrorFallback';

type LocationParams = {
  projectId: string;
  virtualLabId: string;
};

export default function Results({ params, modelId }: { params: LocationParams; modelId: string }) {
  const [simulations, setSimulations] = useState<SynaptomeSimulation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!modelId) return;

    const fetchSims = async () => {
      setLoading(true);
      setError(false);
      try {
        const session = await getSession();
        if (!session) return;

        const simulationsPerMEModelQuery = getSimulationsPerModelQuery({
          modelId,
          type: 'SynaptomeSimulation',
        });
        const sims = await queryES<SynaptomeSimulation>(simulationsPerMEModelQuery, session, {
          org: params.virtualLabId,
          project: params.projectId,
        });
        setSimulations(sims);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchSims();
  }, [params.projectId, params.virtualLabId, modelId]);

  if (loading) {
    return (
      <div className="flex h-full min-h-64 w-full flex-col items-center justify-center gap-3">
        <Spin indicator={<LoadingOutlined />} size="large" />
        <h2 className="font-light text-primary-9">Loading simulations...</h2>
      </div>
    );
  }

  if (!simulations || !simulations.length) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-2xl font-bold text-primary-9">
        <h2>No simulations available</h2>
        <p className="mt-4 max-w-2xl text-center text-sm font-light text-gray-500">
          It looks like you haven’t run any simulations yet. To view your simulations here, please
          start a new simulation. Once completed, the results will appear on this page for further
          review and analysis.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-2xl font-bold text-primary-9">
        <h2>Failed to Load Simulations</h2>
        <p className="mt-4 max-w-2xl text-center text-sm font-light text-gray-500">
          An error occurred while fetching your simulations. Please check your connection and try
          again. If the issue persists, contact support or try refreshing the page to reload the
          simulations
        </p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-2">
      {simulations.map((sim, indx) => (
        <ErrorBoundary fallback={SimpleErrorComponent} key={sim['@id']}>
          <SimulationDetail<SynaptomeSimulation> simulation={sim} index={indx}>
            {({ config }) => {
              if (!config.synaptome) return null;
              return (
                <>
                  <div className="text-lg font-bold text-primary-8">Synaptic Inputs</div>
                  <div className="grid grid-cols-2 gap-4">
                    {config.synaptome.map((c, ind) => (
                      <div
                        key={c.id}
                        className="flex w-max min-w-96 flex-col items-start justify-start"
                      >
                        <div
                          className="flex items-center justify-center px-4 py-2 text-base text-white"
                          style={{
                            backgroundColor: c.color,
                          }}
                        >
                          {ind + 1}
                        </div>
                        <div className="flex w-full flex-col gap-5 border border-gray-300 p-6">
                          <div className="grid grid-cols-3 gap-2">
                            <ConfigItem {...{ label: 'delay', value: c.delay, unit: 'ms' }} />
                            <ConfigItem {...{ label: 'duration', value: c.duration, unit: 'ms' }} />
                            <ConfigItem
                              {...{ label: 'frequency', value: c.frequency, unit: 'hz' }}
                            />
                            <ConfigItem {...{ label: 'weight scalar', value: c.weightScalar }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              );
            }}
          </SimulationDetail>
        </ErrorBoundary>
      ))}
    </div>
  );
}
