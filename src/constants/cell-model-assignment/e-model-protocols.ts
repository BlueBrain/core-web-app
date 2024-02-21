export type StimulusType = 'current_clamp' | 'voltage_clamp' | 'conductance';

export type StimulusModule =
  | 'step'
  | 'hyperpolarizing'
  | 'noise_step'
  | 'shot_noise_step'
  | 'ornstein_uhlenbeck_noise'
  | 'ramp'
  | 'pulse'
  | 'seclamp'
  | 'sin_current'
  | 'alpha_synapse';

export type StimulusTypeDropdownOptionType = {
  label: string;
  value: StimulusType;
};

export type StimulusModuleDropdownOptionType = {
  label: string;
  value: StimulusModule;
  usedBy: StimulusType[];
  description: string;
};

type FunctionParameter = {
  name: string;
  description: string;
  unit: string | null;
  disabled?: boolean;
  hidden?: boolean;
};

export type FunctionParameterNumber = FunctionParameter & {
  defaultValue: number;
  min: number;
  max: number;
  step: number;
};

export type StimulusParameter = Record<string, FunctionParameterNumber>;

type ConditionalStimulusParamsTypes = Record<StimulusModule, StimulusParameter>;

type DropdownInfo = {
  name: string;
  value: string;
};

export const stimulusTypeParams: DropdownInfo & { options: StimulusTypeDropdownOptionType[] } = {
  name: 'Type',
  value: 'current_clamp',
  options: [
    { label: 'Current clamp', value: 'current_clamp' },
    { label: 'Voltage clamp', value: 'voltage_clamp' },
    { label: 'Conductance', value: 'conductance' },
  ],
};

export const stimulusModuleParams: DropdownInfo & { options: StimulusModuleDropdownOptionType[] } =
  {
    name: 'Protocol',
    value: 'step',
    options: [
      {
        label: 'Step IClamp',
        value: 'step',
        usedBy: ['current_clamp'],
        description: 'Step current clamp',
      },
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
        label: 'Shot Noise Step IClamp',
        value: 'shot_noise_step',
        usedBy: ['current_clamp'],
        description: 'Poisson shot noise signal with gamma-distributed',
      },
      {
        label: 'Ornstein Uhlenbeck Noise',
        value: 'ornstein_uhlenbeck_noise',
        usedBy: ['current_clamp'],
        description: 'TODO',
      },
      {
        label: 'Ramp',
        value: 'ramp',
        usedBy: ['current_clamp'],
        description: 'Ramp currrent clamp. Similar to BPEM',
      },
      {
        label: 'Pulse Train',
        value: 'pulse',
        usedBy: ['current_clamp'],
        description: 'Inject a series of pulses',
      },
      {
        label: 'SEClamp (Voltage Clamp)',
        value: 'seclamp',
        usedBy: ['voltage_clamp'],
        description: 'Voltage clamp',
      },
      {
        label: 'Sinusoidal',
        value: 'sin_current',
        usedBy: ['current_clamp'],
        description: 'Sinusoidal current injection',
      },
      {
        label: 'Alpha Synapse',
        value: 'alpha_synapse',
        usedBy: ['current_clamp'],
        description: 'AlphaSynapse NEURON point process stimulus to the cell',
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
    defaultValue: 0,
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
  step: {
    ...commonParams,
    level: amp,
  },
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
  shot_noise_step: {
    ...commonParams,
    rise_time: {
      name: 'rise_time',
      description: 'bi-exponential rise time',
      defaultValue: 0.4,
      min: 0,
      max: 1000,
      step: 0.1,
      unit: 'ms',
    },
    decay_time: {
      name: 'decay_time',
      description: 'bi-exponential decay time',
      defaultValue: 4,
      min: 0,
      max: 100,
      step: 1,
      unit: 'ms',
    },
    rate: {
      name: 'rate',
      description: 'Poisson event rate',
      defaultValue: 2000,
      min: 0,
      max: 5000,
      step: 1,
      unit: 'Hz',
    },
    amp_mean: {
      name: 'amp_mean',
      description: 'mean of gamma-distributed amplitudes',
      defaultValue: 0.04,
      min: 0,
      max: 1,
      step: 0.01,
      unit: 'nA',
    },
    amp_var: {
      name: 'amp_var',
      description: 'variance of gamma-distributed amplitudes',
      defaultValue: 0.0016,
      min: 0,
      max: 1,
      step: 0.01,
      unit: 'nA^2',
    },
  },
  ornstein_uhlenbeck_noise: {
    delay: {
      name: 'delay',
      description: 'delay before start the stimulus',
      defaultValue: 0,
      min: 0,
      max: 100,
      step: 0.1,
      unit: 'ms',
    },
    duration: {
      name: 'duration',
      description: 'duration of the stimulus',
      defaultValue: 2,
      min: 0,
      max: 100,
      step: 0.1,
      unit: 'ms',
    },
    tau: {
      name: 'tau',
      description: 'correlation time [ms], white noise if zero',
      defaultValue: 2.8,
      min: 0,
      max: 100,
      step: 0.1,
      unit: 'ms',
    },
    sigma: {
      name: 'sigma',
      description: 'standard deviation',
      defaultValue: 0.0042,
      min: 0,
      max: 100,
      step: 0.1,
      unit: 'uS',
    },
    mean: {
      name: 'mean',
      description: 'mean value',
      defaultValue: 0.029,
      min: 0,
      max: 100,
      step: 0.1,
      unit: 'uS',
    },
  },
  ramp: {
    ...commonParams,
    start_level: {
      name: 'start_level',
      description: 'TODO',
      defaultValue: 0,
      min: 0,
      max: 1000,
      step: 1,
      unit: 'TODO',
    },
    stop_level: {
      name: 'stop_level',
      description: 'TODO',
      defaultValue: 0,
      min: 0,
      max: 1000,
      step: 1,
      unit: 'TODO',
    },
  },
  pulse: {
    ...commonParams,
    amp_start: {
      name: 'amp_start',
      description: 'TODO',
      defaultValue: 0,
      min: 0,
      max: 1000,
      step: 1,
      unit: 'nA',
    },
    frequency: {
      name: 'frequency',
      description: 'TODO',
      defaultValue: 0,
      min: 0,
      max: 1000,
      step: 1,
      unit: 'Hz',
    },
    width: {
      name: 'width',
      description: 'TODO',
      defaultValue: 0,
      min: 0,
      max: 1000,
      step: 1,
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
  sin_current: {
    amp,
    start_time: {
      name: 'start_time',
      description: 'time to start the stimulus',
      defaultValue: 0,
      min: 0,
      max: 1000,
      step: 1,
      unit: 'ms',
    },
    // TODO: should we have 'stop_time' here instead of 'duration' to be consistent?
    duration: {
      name: 'duration',
      description: 'duration of the stimulus',
      defaultValue: 0,
      min: 0,
      max: 1000,
      step: 1,
      unit: 'ms',
    },
    frequency: {
      name: 'frequency',
      description: 'TODO',
      defaultValue: 0,
      min: 0,
      max: 1000,
      step: 1,
      unit: 'Hz',
    },
  },
  alpha_synapse: {
    onset: {
      name: 'onset',
      description: 'TODO',
      defaultValue: 0,
      min: 0,
      max: 1000,
      step: 1,
      unit: 'TODO',
    },
    tau: {
      name: 'tau',
      description: 'TODO',
      defaultValue: 0,
      min: 0,
      max: 1000,
      step: 1,
      unit: 'TODO',
    },
    gmax: {
      name: 'gmax',
      description: 'TODO',
      defaultValue: 0,
      min: 0,
      max: 1000,
      step: 1,
      unit: 'TODO',
    },
    e: {
      name: 'e',
      description: 'TODO',
      defaultValue: 0,
      min: 0,
      max: 1000,
      step: 1,
      unit: 'TODO',
    },
  },
};
