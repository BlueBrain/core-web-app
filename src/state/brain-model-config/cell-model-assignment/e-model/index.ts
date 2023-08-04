import { atom } from 'jotai';

import {
  EModel,
  ExamplarMorphologyDataType,
  ExperimentalTracesDataType,
  FeatureParameterGroup,
  SimulationParameter,
} from '@/types/e-model';
import {
  mockExamplarMorphology,
  mockExperimentalTraces,
  mockFeatureParameters,
  mockSimulationParameterList,
} from '@/constants/cell-model-assignment/e-model';

export const selectedEModelAtom = atom<EModel | null>(null);

export const eModelRemoteParamsLoadedAtom = atom(false);

export const refetchTriggerAtom = atom<{}>({});

export const simulationParametersAtom = atom<Promise<SimulationParameter | null>>(
  async () => mockSimulationParameterList
);

export const featureParametersAtom = atom<Promise<FeatureParameterGroup | null>>(
  async () => mockFeatureParameters
);

export const examplarMorphologyAtom = atom<Promise<ExamplarMorphologyDataType[] | null>>(
  async () => mockExamplarMorphology
);

export const experimentalTracesAtom = atom<Promise<ExperimentalTracesDataType[] | null>>(
  async () => mockExperimentalTraces
);
