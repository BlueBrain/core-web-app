import { useEffect } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';

import {
  eModelCanBeSavedAtom,
  eModelEditModeAtom,
  eModelUIConfigAtom,
  selectedEModelAtom,
} from '@/state/brain-model-config/cell-model-assignment/e-model';
import { selectedBrainRegionAtom } from '@/state/brain-regions';
import {
  createEModelOptimizationConfigAtom,
  updateEModelOptimizationConfigAtom,
} from '@/state/brain-model-config/cell-model-assignment/e-model/setters';
import { BRAIN_REGION_URI_BASE } from '@/util/brain-hierarchy';

// this component will set some extra attributes
// to the configuration to launch workflow for building e-model
export default function WorkflowAttributes() {
  const selectedEModel = useAtomValue(selectedEModelAtom);
  const selectedBrainRegion = useAtomValue(selectedBrainRegionAtom);
  const eModelEditMode = useAtomValue(eModelEditModeAtom);
  const [eModelUIConfig, setEModelUIConfig] = useAtom(eModelUIConfigAtom);
  const eModelCanBeSaved = useAtomValue(eModelCanBeSavedAtom);
  const createEModelOptimizationConfig = useSetAtom(createEModelOptimizationConfigAtom);
  const updateEModelOptimizationConfig = useSetAtom(updateEModelOptimizationConfigAtom);

  useEffect(() => {
    if (!eModelEditMode || !selectedEModel || !selectedBrainRegion) return;

    setEModelUIConfig((oldAtomData) => ({
      ...oldAtomData,
      mType: selectedEModel.mType,
      eType: selectedEModel.eType,
      brainRegionName: selectedBrainRegion.title,
      brainRegionId: `${BRAIN_REGION_URI_BASE}/${selectedBrainRegion.id}`,
      species: 'mouse',
    }));
  }, [eModelEditMode, selectedEModel, setEModelUIConfig, selectedBrainRegion]);

  useEffect(() => {
    if (!eModelCanBeSaved) return;

    if (selectedEModel?.isOptimizationConfig) {
      updateEModelOptimizationConfig();
    } else {
      createEModelOptimizationConfig();
    }
  }, [
    eModelUIConfig,
    eModelCanBeSaved,
    createEModelOptimizationConfig,
    updateEModelOptimizationConfig,
    selectedEModel?.isOptimizationConfig,
  ]);

  return null;
}
