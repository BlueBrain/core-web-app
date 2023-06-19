import {
  StimulusType,
  StimulusModule,
  ExpDesignerStimulusValueParameterType,
  ExpDesignerNumberParameter,
  StimulusTypeDropdown,
  StimulusModuleDropdown,
  RecordingVariableNameDropdown,
  RecordingTypeDropdown,
  RecordingModuleDropdown,
} from '@/types/experiment-designer';

type ConditionalStimulusParamsTypes = {
  [stimType in StimulusType]?: {
    [stimModule in StimulusModule]?: ExpDesignerStimulusValueParameterType[];
  };
};

export const stimulusTypeParams: StimulusTypeDropdown = {
  id: 'input_type',
  name: 'Type',
  type: 'dropdown',
  value: 'current_clamp',
  options: [
    { label: 'Current clamp', value: 'current_clamp' },
    { label: 'Voltage clamp', value: 'voltage_clamp' },
    { label: 'Conductance', value: 'conductance' },
  ],
};

export const stimulusModuleParams: StimulusModuleDropdown = {
  id: 'module',
  name: 'Module',
  type: 'dropdown',
  value: 'linear',
  options: [
    { label: 'Linear', value: 'linear' },
    { label: 'Relative linear', value: 'relative_linear' },
    { label: 'Pulse', value: 'pulse' },
    { label: 'Subthreshold', value: 'subthreshold' },
    { label: 'Hyperpolarizing', value: 'hyperpolarizing' },
    { label: 'Seclamp', value: 'seclamp' },
    { label: 'Noise', value: 'noise' },
    { label: 'Shot noise', value: 'shot_noise' },
    { label: 'Relative shot noise', value: 'relative_shot_noise' },
    { label: 'Absolute shot noise', value: 'absolute_shot_noise' },
    { label: 'Ornstein uhlenbeck', value: 'ornstein_uhlenbeck' },
    { label: 'Relative ornstein uhlenbeck', value: 'relative_ornstein_uhlenbeck' },
  ],
};

/* just put this number instead of the actual MaxInt
   to avoid sliders not being unusable */
const maxInt = 99999;

// conditional params based on stimulus type and module
const multipleUsageParams1: ExpDesignerNumberParameter[] = [
  {
    id: 'rise_time',
    name: 'Rise time',
    type: 'number',
    value: 0.0351,
    unit: 'ms',
    min: 0,
    max: 2,
    step: 0.01,
  },
  {
    id: 'decay_time',
    name: 'Decay time',
    type: 'number',
    value: 0.0351,
    unit: 'ms',
    min: 0,
    max: 2,
    step: 0.01,
  },
  {
    id: 'rate',
    name: 'Rate',
    type: 'number',
    value: 0.0351,
    unit: 'Hz',
    min: 0,
    max: 2,
    step: 0.01,
  },
  {
    id: 'amp_mean',
    name: 'Amp mean',
    type: 'number',
    value: 0.0351,
    unit: 'nA',
    min: 0,
    max: 2,
    step: 0.01,
  },
  {
    id: 'amp_var',
    name: 'Amp variance',
    type: 'number',
    value: 0.0351,
    unit: 'nA^2',
    min: 0,
    max: 2,
    step: 0.01,
  },
  {
    id: 'amp_cv',
    name: 'Amp coefficient of variation',
    type: 'number',
    value: 0.0351,
    unit: 'sd/mean',
    min: 0,
    max: 2,
    step: 0.01,
  },
  {
    id: 'mean_percent',
    name: 'Mean percent',
    type: 'number',
    value: 0.0351,
    unit: '%',
    min: 0,
    max: 2,
    step: 0.01,
  },
  {
    id: 'sd_percent',
    name: 'Std dev percent',
    type: 'number',
    value: 0.0351,
    unit: '%',
    min: 0,
    max: 2,
    step: 0.01,
  },
  {
    id: 'mean',
    name: 'Signal mean',
    type: 'number',
    value: 0.0351,
    unit: 'nA',
    min: 0,
    max: 2,
    step: 0.01,
  },
  {
    id: 'sigma',
    name: 'Sigma',
    type: 'number',
    value: 0.0351,
    unit: 'nA',
    min: 0,
    max: 2,
    step: 0.01,
  },
  {
    id: 'dt',
    name: 'Timestep',
    type: 'number',
    value: 0.0351,
    unit: 'ms',
    min: 0,
    max: 2,
    step: 0.25,
  },
  {
    id: 'random_seed',
    name: 'Random seed',
    type: 'number',
    value: 1,
    unit: '',
    min: 0,
    max: maxInt,
    step: 1,
  },
];

const multipleUsageParams2: ExpDesignerNumberParameter[] = [
  {
    id: 'tau',
    name: 'Tau',
    type: 'number',
    value: 0.0351,
    unit: 'ms',
    min: 0,
    max: 2,
    step: 0.01,
  },
  {
    id: 'mean_percent',
    name: 'Mean percent',
    type: 'number',
    value: 0.0351,
    unit: '%',
    min: 0,
    max: 2,
    step: 0.01,
  },
  {
    id: 'sd_percent',
    name: 'Std dev percent',
    type: 'number',
    value: 0.0351,
    unit: '%',
    min: 0,
    max: 2,
    step: 0.01,
  },
  {
    id: 'mean',
    name: 'Signal mean',
    type: 'number',
    value: 0.0351,
    unit: 'nA',
    min: 0,
    max: 2,
    step: 0.01,
  },
  {
    id: 'sigma',
    name: 'Sigma',
    type: 'number',
    value: 0.0351,
    unit: 'nA',
    min: 0,
    max: 2,
    step: 0.01,
  },
  {
    id: 'reversal',
    name: 'Reversal potential',
    type: 'number',
    value: 0.0351,
    unit: 'mV',
    min: 0,
    max: 2,
    step: 0.01,
  },
  {
    id: 'dt',
    name: 'Timestep',
    type: 'number',
    value: 0.0351,
    unit: 'ms',
    min: 0,
    max: 2,
    step: 0.25,
  },
  {
    id: 'random_seed',
    name: 'Random seed',
    type: 'number',
    value: 1,
    unit: '',
    min: 0,
    max: maxInt,
    step: 1,
  },
];

export const conditionalStimulusParams: ConditionalStimulusParamsTypes = {
  current_clamp: {
    linear: [
      {
        id: 'amp_start',
        name: 'AmpStart',
        type: 'number',
        value: 0.0351,
        unit: 'nA',
        min: 0,
        max: 2,
        step: 0.01,
      },
      {
        id: 'amp_end',
        name: 'AmpEnd',
        type: 'number',
        value: 0.0351,
        unit: 'nA',
        min: 0,
        max: 2,
        step: 0.01,
      },
    ],
    relative_linear: [
      {
        id: 'percent_start',
        name: 'PercentStart',
        type: 'number',
        value: 0.0351,
        unit: '%',
        min: 0,
        max: 2,
        step: 0.01,
      },
      {
        id: 'percent_end',
        name: 'PercentEnd',
        type: 'number',
        value: 0.0351,
        unit: '%',
        min: 0,
        max: 2,
        step: 0.01,
      },
    ],
    pulse: [
      {
        id: 'amp_start',
        name: 'AmpStart',
        type: 'number',
        value: 0.0351,
        unit: 'nA',
        min: 0,
        max: 2,
        step: 0.01,
      },
      {
        id: 'amp_end',
        name: 'AmpEnd',
        type: 'number',
        value: 0.0351,
        unit: 'nA',
        min: 0,
        max: 2,
        step: 0.01,
      },
      {
        id: 'width',
        name: 'Width',
        type: 'number',
        value: 0.0351,
        unit: 'ms',
        min: 0,
        max: 2,
        step: 0.01,
      },
      {
        id: 'frequency',
        name: 'Frequency',
        type: 'number',
        value: 0.0351,
        unit: 'Hz',
        min: 0,
        max: 2,
        step: 0.01,
      },
    ],
    subthreshold: [
      {
        id: 'percent_less',
        name: 'Percent less',
        type: 'number',
        value: 0.0351,
        unit: '%',
        min: 0,
        max: 2,
        step: 0.01,
      },
    ],
    hyperpolarizing: [],
    noise: [
      {
        id: 'mean',
        name: 'Mean',
        type: 'number',
        value: 0.0351,
        unit: 'nA',
        min: 0,
        max: 2,
        step: 0.01,
      },
      {
        id: 'mean_percent',
        name: 'Mean percent',
        type: 'number',
        value: 0.0351,
        unit: '%',
        min: 0,
        max: 2,
        step: 0.01,
      },
      {
        id: 'variance',
        name: 'Variance',
        type: 'number',
        value: 0.0351,
        unit: '',
        min: 0,
        max: 2,
        step: 0.01,
      },
    ],
    shot_noise: [...multipleUsageParams1],
    absolute_shot_noise: [...multipleUsageParams1],
    relative_shot_noise: [...multipleUsageParams1],
    ornstein_uhlenbeck: [...multipleUsageParams2],
    relative_ornstein_uhlenbeck: [...multipleUsageParams2],
  },
  voltage_clamp: {
    seclamp: [
      {
        id: 'voltage',
        name: 'Voltage',
        type: 'number',
        value: 0.0351,
        unit: 'mV',
        min: 0,
        max: 2,
        step: 0.01,
      },
      {
        id: 'series_resistance',
        name: 'Series resistance',
        type: 'number',
        value: 0.01,
        unit: 'M Ω',
        min: 0,
        max: 2,
        step: 0.01,
      },
    ],
  },
  conductance: {
    shot_noise: [...multipleUsageParams1],
    absolute_shot_noise: [...multipleUsageParams1],
    relative_shot_noise: [...multipleUsageParams1],
    ornstein_uhlenbeck: [...multipleUsageParams2],
    relative_ornstein_uhlenbeck: [...multipleUsageParams2],
  },
};

export const stimulusParamsToKeep = ['delay', 'input_type', 'module', 'duration', 'node_set'];

export const recordingVariableNameParams: RecordingVariableNameDropdown = {
  id: 'variable_name',
  name: 'Variable',
  type: 'dropdown',
  value: 'v',
  options: [
    { label: 'Soma voltage', value: 'v' },
    { label: 'Membrane current', value: 'i_membrane' },
    { label: 'Current clamp', value: 'IClamp' },
  ],
};

export const recordingTypeParams: RecordingTypeDropdown = {
  id: 'type',
  name: 'Type',
  type: 'dropdown',
  value: 'compartment',
  options: [
    { label: 'Compartment', value: 'compartment' },
    { label: 'Summation', value: 'summation' },
    { label: 'Synapse', value: 'synapse' },
  ],
};

export const recordingSectionParams: RecordingModuleDropdown = {
  id: 'sections',
  name: 'Sections',
  type: 'dropdown',
  value: 'soma',
  options: [
    { label: 'Soma', value: 'soma' },
    { label: 'Axon', value: 'axon' },
    { label: 'Dend', value: 'dend' },
    { label: 'Apic', value: 'apic' },
    { label: 'All', value: 'all' },
  ],
};
