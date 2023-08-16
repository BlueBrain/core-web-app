import lodashFind from 'lodash/find';

import {
  EModelConfigurationMorphology,
  EModelConfigurationParameter,
  ExemplarMorphologyDataType,
  ExperimentalTracesDataType,
  SimulationParameter,
  Trace,
} from '@/types/e-model';

const NOT_AVAILABLE_STR = 'Data not available';

export function convertRemoteParamsForUI(
  remoteParams: EModelConfigurationParameter[]
): SimulationParameter {
  const ra = lodashFind(remoteParams, ['name', 'Ra'])?.value;
  const temp = lodashFind(remoteParams, ['name', 'celsius'])?.value;
  const voltage = lodashFind(remoteParams, ['name', 'v_init'])?.value;

  if ([ra, temp, voltage].some((value) => !value || Array.isArray(value))) {
    throw new Error('Failed converting remote simulation parameter');
  }

  return {
    'Temperature (°C)': temp as number,
    Ra: ra as number,
    'Initial voltage': voltage as number,
  };
}

export function convertMorphologyForUI(
  remoteMorphology: EModelConfigurationMorphology
): ExemplarMorphologyDataType {
  return {
    '@id': crypto.randomUUID(),
    name: remoteMorphology.name,
    description: NOT_AVAILABLE_STR,
    brainLocation: NOT_AVAILABLE_STR,
    mType: NOT_AVAILABLE_STR,
    contributor: NOT_AVAILABLE_STR,
  };
}

export function convertTracesForUI(traces: Trace[]): ExperimentalTracesDataType[] {
  return traces.map((trace) => ({
    '@id': crypto.randomUUID(),
    cellName: trace.name,
    mType: NOT_AVAILABLE_STR,
    eType: NOT_AVAILABLE_STR,
    description: NOT_AVAILABLE_STR,
    eCode: NOT_AVAILABLE_STR,
    subjectSpecies: trace.subject.species.label,
  }));
}
