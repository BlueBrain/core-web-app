import { ReactNode, useCallback, useMemo } from 'react';
import { useAtom } from 'jotai';
import last from 'lodash/last';

import { ExperimentInteractiveContext } from '@/components/experiment-interactive/ExperimentInteractive/context';
import {
  isViewSettingsPanelVisibleAtom,
  simulationPreviewsAtom,
} from '@/state/experiment-interactive';
import {
  ExperimentInteractiveContextType,
  SimulationParameterValues,
  SimulationPreviewElement,
} from '@/components/experiment-interactive/types';
import { MAX_SIMULATION_PREVIEWS } from '@/components/experiment-interactive/config';

interface ExperimentInteractiveProviderProps {
  children: ReactNode;
}

export default function ExperimentInteractiveProvider({
  children,
}: ExperimentInteractiveProviderProps) {
  const [simulationPreviews, setSimulationPreviews] = useAtom(simulationPreviewsAtom);

  const [isViewSettingsPanelVisible, setIsViewSettingsPanelVisible] = useAtom(
    isViewSettingsPanelVisibleAtom
  );

  const startBulkEditing = useCallback(() => {
    setSimulationPreviews((simPreviews) =>
      simPreviews.map((simPrev) => ({
        ...simPrev,
        ...(typeof simPrev.editParams === 'undefined'
          ? { editParams: { ...simPrev.simParams } }
          : {}),
      }))
    );
  }, [setSimulationPreviews]);

  const cancelBulkEditing = useCallback(() => {
    setSimulationPreviews((simPreviews) =>
      simPreviews.map((simPrev) => ({
        ...simPrev,
        editParams: undefined,
      }))
    );
  }, [setSimulationPreviews]);

  const applyBulkEditing = useCallback(() => {
    setSimulationPreviews((simPreviews) =>
      simPreviews.map((simPrev) => ({
        ...simPrev,
        simParams: { ...(simPrev.editParams as SimulationParameterValues) },
        editParams: undefined,
      }))
    );
  }, [setSimulationPreviews]);

  const isBulkEditingMode = useMemo(
    () => !simulationPreviews.some((value) => typeof value.editParams === 'undefined'),
    [simulationPreviews]
  );

  const canAddNewSimulation = useMemo(
    () => simulationPreviews.length < MAX_SIMULATION_PREVIEWS,
    [simulationPreviews.length]
  );

  const addNewSimulation = useCallback(() => {
    setSimulationPreviews((simPreviews) => {
      if (!canAddNewSimulation) {
        return simPreviews;
      }

      // Create a new simulation preview based on the last of the current simulations
      const newSimPreview = structuredClone(last(simPreviews) as SimulationPreviewElement);
      newSimPreview.id = Date.now().toString();
      newSimPreview.editParams = { ...newSimPreview.simParams };

      return [...simPreviews, newSimPreview];
    });
  }, [canAddNewSimulation, setSimulationPreviews]);

  const deleteSimulation = useCallback(
    (index: number) => {
      setSimulationPreviews((previous) =>
        previous.length > 1 ? previous.filter((p, i) => i + 1 !== index) : previous
      );
    },
    [setSimulationPreviews]
  );

  const showViewSettingsPanel = useCallback(() => {
    setIsViewSettingsPanelVisible(() => true);
  }, [setIsViewSettingsPanelVisible]);

  const hideViewSettingsPanel = useCallback(() => {
    setIsViewSettingsPanelVisible(() => false);
  }, [setIsViewSettingsPanelVisible]);

  const providerValue: ExperimentInteractiveContextType = useMemo(
    () => ({
      startBulkEditing,
      cancelBulkEditing,
      applyBulkEditing,
      isBulkEditingMode,
      addNewSimulation,
      canAddNewSimulation,
      deleteSimulation,
      isViewSettingsPanelVisible,
      showViewSettingsPanel,
      hideViewSettingsPanel,
    }),
    [
      startBulkEditing,
      cancelBulkEditing,
      applyBulkEditing,
      isBulkEditingMode,
      addNewSimulation,
      canAddNewSimulation,
      deleteSimulation,
      isViewSettingsPanelVisible,
      showViewSettingsPanel,
      hideViewSettingsPanel,
    ]
  );

  return (
    <ExperimentInteractiveContext.Provider value={providerValue}>
      {children}
    </ExperimentInteractiveContext.Provider>
  );
}
