'use client';

import { useAtomValue, useSetAtom } from 'jotai';
import { Form } from 'antd';
import { useState } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import kebabCase from 'lodash/kebabCase';

import useSimulationModal from '../hooks/useSimulationModal';
import { SaveSimulation } from './modals';
import type { SaveSimulationProps } from './modals';
import {
  genericSingleNeuronSimulationPlotDataAtom,
  simulationStatusAtom,
} from '@/state/simulate/single-neuron';
import { SimulationType } from '@/types/simulation/common';
import { exportSimulationResultsAsZip } from '@/util/simulation-plotly-to-csv';
import { launchSimulationAtom } from '@/state/simulate/single-neuron-setter';
import { simulationExperimentalSetupAtom } from '@/state/simulate/categories/simulation-conditions';
import { currentInjectionSimulationConfigAtom } from '@/state/simulate/categories/current-injection-simulation';
import { PROTOCOL_DETAILS } from '@/constants/simulate/single-neuron';
import useNotification from '@/hooks/notifications';

type Props = {
  modelSelfUrl: string;
  vLabId: string;
  projectId: string;
  simulationType: SimulationType;
};

export default function SimulationButton({
  modelSelfUrl,
  vLabId,
  projectId,
  simulationType,
}: Props) {
  const form = Form.useFormInstance();
  const simulationStatus = useAtomValue(simulationStatusAtom);
  const simulationResults = useAtomValue(genericSingleNeuronSimulationPlotDataAtom);
  const [downloading, setDownloading] = useState(false);
  const { error: notifyError, success: notifySuccess } = useNotification();
  const launchSimulation = useSetAtom(launchSimulationAtom);
  const experimentalSetupConfig = useAtomValue(simulationExperimentalSetupAtom);
  const currentInjectionConfig = useAtomValue(currentInjectionSimulationConfigAtom);

  const onCompleteSimulation = useSimulationModal<SaveSimulationProps>({
    showCloseIcon: false,
    Content: SaveSimulation,
  });

  const runSimulation = () => {
    const protocol = currentInjectionConfig.at(0)?.stimulus.stimulusProtocol;
    let currentInjectionDuration = 0;
    if (protocol) {
      currentInjectionDuration = PROTOCOL_DETAILS[protocol].defaults.time.stopTime;
    }

    launchSimulation(
      modelSelfUrl,
      simulationType,
      experimentalSetupConfig.max_time ?? currentInjectionDuration
    );
  };

  const [saveSimulation, saveModalContext] = onCompleteSimulation({
    id: 'save-simulation',
    name: form.getFieldValue('name'),
    description: form.getFieldValue('description'),
    modelSelfUrl,
    vLabId,
    projectId,
    simulationType,
  });

  const onDownloadRecordingDataAsZip = async () => {
    if (simulationResults) {
      try {
        setDownloading(true);
        await exportSimulationResultsAsZip({
          name: kebabCase(form.getFieldValue('name')) ?? 'simulation_plots',
          result: simulationResults,
        });
        notifySuccess(
          'The simulation recording files was successfully downloaded. Please check your downloads folder.',
          undefined,
          'topRight',
          true,
          'download-simulation-zip'
        );
      } catch (error) {
        notifyError(
          'An error occurred while generating the ZIP file. Please try again.',
          undefined,
          'topRight',
          true,
          'download-simulation-zip'
        );
      } finally {
        setDownloading(false);
      }
    }
  };

  return (
    <div className="flex items-center justify-between gap-4">
      {simulationStatus?.status === 'finished' && (
        <button
          className="w-max bg-primary-8 px-7 py-3 text-white"
          type="button"
          onClick={onDownloadRecordingDataAsZip}
        >
          {downloading && <LoadingOutlined className="mr-2" />}
          Download <span className="font-light">(csv)</span>
        </button>
      )}
      <button
        type="button"
        className="bg-primary-8 px-7 py-3 text-lg text-white disabled:bg-gray-300"
        onClick={runSimulation}
        disabled={simulationStatus?.status === 'launched'}
      >
        {simulationStatus?.status === 'finished' ? 'Re-run Simulation' : 'Simulate'}
      </button>
      {simulationStatus?.status === 'finished' && (
        <button
          className="w-max bg-primary-8 px-7 py-3 text-white"
          type="button"
          onClick={saveSimulation}
        >
          Save
        </button>
      )}
      {saveModalContext}
    </div>
  );
}
