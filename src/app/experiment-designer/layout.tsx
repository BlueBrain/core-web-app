'use client';

import { ReactNode, useEffect, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { loadable } from 'jotai/utils';
import { Spin, message } from 'antd';

import {
  ExperimentDesignerTopTabs,
  SimulateBtn,
  DuplicateConfigBtn,
  ViewResultsBtn,
} from '@/components/experiment-designer';
import useAuth from '@/hooks/auth';
import SimpleErrorComponent from '@/components/GenericErrorFallback';
import ExperimentDesignerPanel from '@/components/experiment-designer/ExperimentDesignerPanel';
import useSimulationCampaignUIConfig from '@/hooks/simulation-campaign-ui-config';
import {
  expDesignerConfigAtom,
  remoteConfigPayloadAtom,
  setConfigPayloadAtom,
  savedConfigAtom,
  setWorkflowExecutionAndCloneAtom,
  brainModelConfigIdFromSimCampUIConfigIdAtom,
  isConfigUsedInSimAtom,
} from '@/state/experiment-designer';
import { idAtom as brainModelConfigIdAtom } from '@/state/brain-model-config';
import { classNames } from '@/util/utils';

const loadableRemoteConfigAtom = loadable(remoteConfigPayloadAtom);
const loadableDerivedBrainModelConfigIdAtom = loadable(brainModelConfigIdFromSimCampUIConfigIdAtom);
const loadableIsConfigUsedInSimAtom = loadable(isConfigUsedInSimAtom);

type ExperimentDesignerLayoutProps = {
  children: ReactNode;
};

type ActionButtonProps = {
  isConfigUsedInSim: boolean;
  isLoading: boolean;
};

function ActionButtons({ isConfigUsedInSim, isLoading }: ActionButtonProps) {
  const setWorkflowExecutionAndClone = useSetAtom(setWorkflowExecutionAndCloneAtom);

  const onLaunched = (nexusUrl: string) => {
    if (!nexusUrl) return;

    setWorkflowExecutionAndClone(nexusUrl);
  };

  const defaultButtonStyle = 'flex h-12 px-8 items-center';

  if (isLoading) {
    return (
      <div className={classNames(defaultButtonStyle, 'bg-slate-400')}>
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <>
      {isConfigUsedInSim && (
        <>
          <ViewResultsBtn className={defaultButtonStyle} />
          <DuplicateConfigBtn className={defaultButtonStyle} />
        </>
      )}
      {!isConfigUsedInSim && <SimulateBtn onLaunched={onLaunched} />}
    </>
  );
}

export default function ExperimentDesignerLayout({ children }: ExperimentDesignerLayoutProps) {
  const [localConfig, setLocalConfig] = useAtom(expDesignerConfigAtom);
  const remoteConfigLoadable = useAtomValue(loadableRemoteConfigAtom);
  // show only once while app starts
  const [isLoading, setIsLoading] = useState(true);
  const saveConfigDebounced = useSetAtom(setConfigPayloadAtom);
  const setSavedConfig = useSetAtom(savedConfigAtom);

  const derivedBrainModelConfigIdLoadable = useAtomValue(loadableDerivedBrainModelConfigIdAtom);
  const setBrainModelConfigId = useSetAtom(brainModelConfigIdAtom);

  const isConfigUsedInSimLoadable = useAtomValue(loadableIsConfigUsedInSimAtom);
  const isConfigUsedInSim =
    isConfigUsedInSimLoadable.state === 'hasData' ? isConfigUsedInSimLoadable.data : false;

  const [messageApi, messageContextHolder] = message.useMessage();

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
    // skip changing config if sim was launched with it.
    if (isConfigUsedInSim) {
      messageApi.open({
        type: 'error',
        content: 'Config used in simulation. It cannot be modified. Please Duplicate it',
      });
      return;
    }

    saveConfigDebounced();
  }, [localConfig, saveConfigDebounced, isConfigUsedInSim, messageApi]);

  useEffect(() => {
    if (derivedBrainModelConfigIdLoadable.state !== 'hasData') return;
    if (!derivedBrainModelConfigIdLoadable.data) return;

    // setting the brainModelConfig from simCampUIConfig query param
    setBrainModelConfigId(derivedBrainModelConfigIdLoadable.data);
  }, [derivedBrainModelConfigIdLoadable, setBrainModelConfigId]);

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
              <ActionButtons
                isConfigUsedInSim={isConfigUsedInSim}
                isLoading={isConfigUsedInSimLoadable.state === 'loading'}
              />
            </ErrorBoundary>
          </div>
        </div>
      </div>
      {messageContextHolder}
    </Spin>
  );
}
