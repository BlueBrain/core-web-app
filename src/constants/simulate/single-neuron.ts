import {
  ConditionalStimulusParamsTypes,
  FunctionParameterNumber,
  StimulusDropdownInfo,
  StimulusTypeDropdownOptionType,
  StimulusModuleDropdownOptionType,
  SimConfig,
  StimulusConfig,
} from '@/types/simulate/single-neuron';
import { getParamValues } from '@/util/simulate/single-neuron';

export const stimulusTypeParams: StimulusDropdownInfo & {
  options: StimulusTypeDropdownOptionType[];
} = {
  name: 'Type',
  value: 'current_clamp',
  options: [
    { label: 'Current clamp', value: 'current_clamp' },
    { label: 'Voltage clamp', value: 'voltage_clamp' },
    { label: 'Conductance', value: 'conductance' },
  ],
};

export const stimulusModuleParams: StimulusDropdownInfo & {
  options: StimulusModuleDropdownOptionType[];
} = {
  name: 'Protocol',
  value: 'step',
  options: [
    {
      label: 'Hyperpolarizing IClamp',
      value: 'hyperpolarizing',
      usedBy: ['current_clamp'],
      description: 'Hyperpolarising step current clamp',
    },
    {
      label: 'Noise Step IClamp',
      value: 'noise_step',
      usedBy: ['current_clamp'],
      description: 'Step current with noise on top',
    },
    {
      label: 'SEClamp (Voltage Clamp)',
      value: 'seclamp',
      usedBy: ['voltage_clamp'],
      description: 'Voltage clamp',
    },
  ],
};

const commonParams: { [key: string]: FunctionParameterNumber } = {
  start_time: {
    name: 'Start time',
    description: 'time to start the stimulus',
    defaultValue: 0,
    min: 0,
    max: 1000,
    step: 1,
    unit: 'ms',
  },
  stop_time: {
    name: 'Stop time',
    description: 'time to stop the stimulus',
    defaultValue: 100,
    min: 0,
    max: 1000,
    step: 1,
    unit: 'ms',
  },
};

const amp: FunctionParameterNumber = {
  name: 'Amp',
  description: 'TODO',
  defaultValue: 0.7,
  min: -10,
  max: 10,
  step: 0.1,
  unit: 'nA',
};

export const stimulusParams: ConditionalStimulusParamsTypes = {
  hyperpolarizing: {
    ...commonParams,
    level: amp,
  },
  noise_step: {
    ...commonParams,
    mean: {
      name: 'mean',
      description: 'TODO',
      defaultValue: 0,
      min: 0,
      max: 100,
      step: 0.1,
      unit: 'TODO',
    },
    variance: {
      name: 'variance',
      description: 'TODO',
      defaultValue: 0,
      min: 0,
      max: 100,
      step: 0.1,
      unit: 'TODO',
    },
  },
  seclamp: {
    // TODO: it does not have start_time???
    stop_time: {
      name: 'stop_time',
      description: 'Time at which voltage clamp should stop',
      defaultValue: 0,
      min: 0,
      max: 1000,
      step: 1,
      unit: 'ms',
    },
    level: {
      name: 'amp',
      description: 'Voltage level of the vc',
      defaultValue: 0.7,
      min: -100,
      max: 100,
      step: 1,
      unit: 'mV',
    },
  },
};

export const DEFAULT_STIM_CONFIG: StimulusConfig = {
  stimulusType: 'current_clamp',
  stimulusProtocol: 'hyperpolarizing',
  stimulusProtocolOptions: stimulusModuleParams.options.filter((option) =>
    option.usedBy.includes('current_clamp')
  ),
  stimulusProtocolInfo:
    stimulusModuleParams.options.find((option) => option.value === 'hyperpolarizing') || null,
  paramInfo: stimulusParams.hyperpolarizing,
  paramValues: getParamValues(stimulusParams.hyperpolarizing),
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
