import lodashFind from 'lodash/find';

import {
  EModelConfigurationMorphology,
  EModelConfigurationParameter,
  ExemplarMorphologyDataType,
  SimulationParameter,
} from '@/types/e-model';

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
  const notAvailableStr = 'Data not available';
  return {
    '@id': crypto.randomUUID(),
    name: remoteMorphology.name,
    description: notAvailableStr,
    brainLocation: notAvailableStr,
    mType: notAvailableStr,
    contributor: notAvailableStr,
  };
}
