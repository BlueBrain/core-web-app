import { SimConfig, StimulusConfig } from './types';
import { getParamValues } from './utils';
import {
  stimulusModuleParams,
  stimulusParams,
} from '@/constants/cell-model-assignment/e-model-protocols';

export const DEFAULT_STIM_CONFIG: StimulusConfig = {
  stimulusType: 'current_clamp',
  stimulusProtocol: 'step',
  stimulusProtocolOptions: stimulusModuleParams.options.filter((option) =>
    option.usedBy.includes('current_clamp')
  ),
  stimulusProtocolInfo:
    stimulusModuleParams.options.find((option) => option.value === 'step') || null,
  paramInfo: stimulusParams.step,
  paramValues: getParamValues(stimulusParams.step),
};

export const DEFAULT_SIM_CONFIG: SimConfig = {
  isFixedDt: false,
  celsius: 34,
  variableDt: true,
  dt: null,
  tstop: 1000,
  hypamp: 0,
  vinit: -73,
  injectTo: 'soma[0]',
  recordFrom: ['soma[0]_0'],
  stimulus: DEFAULT_STIM_CONFIG,
};
