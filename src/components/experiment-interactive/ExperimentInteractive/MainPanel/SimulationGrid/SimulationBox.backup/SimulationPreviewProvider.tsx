import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import isEqual from 'lodash/isEqual';

import {
  SimulationParameterKey,
  SimulationPreviewContextType,
  SimulationPreviewElement,
} from '@/components/experiment-interactive/types';
import { SimulationPreviewContext } from '@/components/experiment-interactive/ExperimentInteractive/MainPanel/SimulationGrid/SimulationBox.backup/context';
import {
  displayedSimulationParamsConfigAtom,
  simulationPreviewsAtom,
} from '@/state/experiment-interactive';
import { usePrevious } from '@/hooks/hooks';
import { useExperimentInteractive } from '@/components/experiment-interactive/ExperimentInteractive/hooks';

interface SimulationPreviewProviderProps {
  children: ReactNode;
  index: number;
  simulationPreview: SimulationPreviewElement;
}

export default function SimulationPreviewProvider({
  children,
  index,
  simulationPreview,
}: SimulationPreviewProviderProps) {
  const { deleteSimulation } = useExperimentInteractive();

  const displayedSimulationParamsConfig = useAtomValue(displayedSimulationParamsConfigAtom);

  const setSimulationPreviews = useSetAtom(simulationPreviewsAtom);

  const previousSimulationPreview = usePrevious(simulationPreview);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [editedParamKey, setEditedParamKey] = useState<SimulationParameterKey>(
    displayedSimulationParamsConfig?.[0].paramKey
  );

  const deleteCurrentSimulation = useCallback(() => {
    deleteSimulation(index);
  }, [deleteSimulation, index]);

  const startEditing = useCallback(() => {
    const newSimulationPreview = { ...simulationPreview };
    newSimulationPreview.editParams = { ...newSimulationPreview.simParams };
    setSimulationPreviews((prev: SimulationPreviewElement[]) => {
      const value = [...prev];
      value[index - 1] = newSimulationPreview;
      return value;
    });
  }, [index, setSimulationPreviews, simulationPreview]);

  const cancelEditing = useCallback(() => {
    const newSimulationPreview = { ...simulationPreview };
    delete newSimulationPreview.editParams;
    setSimulationPreviews((prev: SimulationPreviewElement[]) => {
      const value = [...prev];
      value[index - 1] = newSimulationPreview;
      return value;
    });
  }, [index, setSimulationPreviews, simulationPreview]);

  const applyChanges = useCallback(() => {
    const newSimulationPreview = { ...simulationPreview };

    if (newSimulationPreview.editParams) {
      newSimulationPreview.simParams = { ...newSimulationPreview.editParams };
      delete newSimulationPreview.editParams;

      setSimulationPreviews((prev: SimulationPreviewElement[]) => {
        const value = [...prev];
        value[index - 1] = newSimulationPreview;
        return value;
      });
    }
  }, [index, setSimulationPreviews, simulationPreview]);

  const triggerLoadingSimulation = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 5000);
  }, []);

  useEffect(() => {
    if (!isEqual(previousSimulationPreview?.simParams, simulationPreview.simParams)) {
      triggerLoadingSimulation();
    }
  }, [previousSimulationPreview?.simParams, simulationPreview.simParams, triggerLoadingSimulation]);

  const providerValue: SimulationPreviewContextType = useMemo(
    () => ({
      simulationPreview,
      index,
      cancelEditing,
      startEditing,
      deleteCurrentSimulation,
      applyChanges,
      isLoading,
      editedParamKey,
      setEditedParamKey,
    }),
    [
      simulationPreview,
      index,
      cancelEditing,
      startEditing,
      deleteCurrentSimulation,
      applyChanges,
      isLoading,
      editedParamKey,
    ]
  );

  return (
    <SimulationPreviewContext.Provider value={providerValue}>
      {children}
    </SimulationPreviewContext.Provider>
  );
}
