import { atom } from 'jotai';
import {
  mockSimulationAnnotations,
  mockSimulationData,
  mockSimulationParams,
  mockSimulationPreviews,
} from '@/components/experiment-interactive/mock-data';
import {
  ParameterKeyConfig,
  SimulationAnnotation,
  SimulationData,
  SimulationPreviewElement,
  SimulationTimeRange,
} from '@/components/experiment-interactive/types';

export const simulationPreviewsAtom = atom<SimulationPreviewElement[]>([...mockSimulationPreviews]);

export const displayedSimulationParamsConfigAtom = atom<ParameterKeyConfig[]>([
  ...mockSimulationParams,
]);

export const playbackStepSizeAtom = atom<number>(20);

export const playbackActiveStepAtom = atom<number>(600);

export const simulationDataAtom = atom<SimulationData>(mockSimulationData);

export const simulationAnnotationsAtom = atom<SimulationAnnotation[]>(mockSimulationAnnotations);

export const simulationDurationAtom = atom<number>((get) => {
  const { stepCount } = get(simulationDataAtom);
  const stepSize = get(playbackStepSizeAtom);
  return stepCount * stepSize;
});

export const movieGenerationSimulationsAtom = atom<string[]>([]);

export const movieGenerationTimeRangeAtom = atom<SimulationTimeRange>({ start: 0, end: 0 });

export const isDisplayWholeBrainCheckedAtom = atom<boolean>(false);

export const isViewSettingsPanelVisibleAtom = atom<boolean>(false);
