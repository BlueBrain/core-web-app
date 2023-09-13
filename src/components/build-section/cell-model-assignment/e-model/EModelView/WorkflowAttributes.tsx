import { useEffect } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';

import {
  eModelCanBeSavedAtom,
  eModelEditModeAtom,
  eModelUIConfigAtom,
  selectedEModelAtom,
} from '@/state/brain-model-config/cell-model-assignment/e-model';
import { selectedBrainRegionAtom } from '@/state/brain-regions';
import { saveEModelOptimizationConfigAtom } from '@/state/brain-model-config/cell-model-assignment/e-model/setters';

// this component will set some extra attributes
// to the configuration to launch workflow for building e-model
export default function WorkflowAttributes() {
  const selectedEModel = useAtomValue(selectedEModelAtom);
  const selectedBrainRegion = useAtomValue(selectedBrainRegionAtom);
  const eModelEditMode = useAtomValue(eModelEditModeAtom);
  const [eModelUIConfig, setEModelUIConfig] = useAtom(eModelUIConfigAtom);
  const eModelCanBeSaved = useAtomValue(eModelCanBeSavedAtom);
  const saveEModelOptimizationConfig = useSetAtom(saveEModelOptimizationConfigAtom);

  useEffect(() => {
    if (!eModelEditMode || !selectedEModel || !selectedBrainRegion) return;

    setEModelUIConfig((oldAtomData) => ({
      ...oldAtomData,
      mType: selectedEModel.mTypeName,
      eType: selectedEModel.name,
      brainRegionName: selectedBrainRegion.title,
      species: 'mouse',
    }));
  }, [eModelEditMode, selectedEModel, setEModelUIConfig]);

  useEffect(() => {
    if (!eModelCanBeSaved) return;

    saveEModelOptimizationConfig();
  }, [eModelUIConfig, eModelCanBeSaved]);

  return null;
}
