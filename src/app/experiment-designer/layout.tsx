'use client';

import { ReactNode, useEffect, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { loadable } from 'jotai/utils';
import { Spin } from 'antd';

import { ExperimentDesignerTopTabs, SimulateBtn } from '@/components/experiment-designer';
import useAuth from '@/hooks/auth';
import SimpleErrorComponent from '@/components/GenericErrorFallback';
import ExperimentDesignerPanel from '@/components/experiment-designer/ExperimentDesignerPanel';
import useSimulationCampaignUIConfig from '@/hooks/simulation-campaign-ui-config';
import {
  expDesignerConfigAtom,
  remoteConfigPayloadAtom,
  setConfigPayloadAtom,
  savedConfigAtom,
  setWorkflowExecutionAtom,
  brainModelConfigIdFromSimCampUIConfigIdAtom,
} from '@/state/experiment-designer';
import { idAtom as brainModelConfigId } from '@/state/brain-model-config';

const loadableRemoteConfigAtom = loadable(remoteConfigPayloadAtom);
const loadableDerivedBrainModelConfigIdAtom = loadable(brainModelConfigIdFromSimCampUIConfigIdAtom);

type ExperimentDesignerLayoutProps = {
  children: ReactNode;
};

export default function ExperimentDesignerLayout({ children }: ExperimentDesignerLayoutProps) {
  const [localConfig, setLocalConfig] = useAtom(expDesignerConfigAtom);
  const remoteConfigLoadable = useAtomValue(loadableRemoteConfigAtom);
  // show only once while app starts
  const [isLoading, setIsLoading] = useState(true);
  const saveConfigDebounced = useSetAtom(setConfigPayloadAtom);
  const setSavedConfig = useSetAtom(savedConfigAtom);
  const setWorkflowExecution = useSetAtom(setWorkflowExecutionAtom);
  const derivedBrainModelConfigIdLoadable = useAtomValue(loadableDerivedBrainModelConfigIdAtom);
  const setBrainModelConfigId = useSetAtom(brainModelConfigId);

  useAuth(true);
  useSimulationCampaignUIConfig();

  useEffect(() => {
    if (remoteConfigLoadable.state !== 'hasData') return;
    if (!remoteConfigLoadable.data) return;
    if (!Object.keys(remoteConfigLoadable.data).length) return;

    // overwrite the default config with the saved remote config
    setLocalConfig(remoteConfigLoadable.data);
    setSavedConfig(remoteConfigLoadable.data);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, [setLocalConfig, remoteConfigLoadable, setSavedConfig]);

  useEffect(() => {
    saveConfigDebounced();
  }, [localConfig, saveConfigDebounced]);

  useEffect(() => {
    if (derivedBrainModelConfigIdLoadable.state !== 'hasData') return;
    if (!derivedBrainModelConfigIdLoadable.data) return;

    // setting the brainModelConfig from simCampUIConfig query param
    setBrainModelConfigId(derivedBrainModelConfigIdLoadable.data);
  }, [derivedBrainModelConfigIdLoadable]);

  const onLaunched = (nexusUrl: string) => {
    if (!nexusUrl) return;

    setWorkflowExecution(nexusUrl);
  };

  return (
    <Spin spinning={isLoading}>
      <div className="h-screen grid grid-cols-[minmax(40px,auto)_1fr]">
        <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
          <ExperimentDesignerPanel />
        </ErrorBoundary>

        <div className="flex flex-col">
          <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
            <ExperimentDesignerTopTabs />
          </ErrorBoundary>

          <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
            <div className="grow">{children}</div>
          </ErrorBoundary>

          <div className="absolute bottom-5 right-5 flex gap-5">
            <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
              <SimulateBtn onLaunched={onLaunched} />
            </ErrorBoundary>
          </div>
        </div>
      </div>
    </Spin>
  );
}
