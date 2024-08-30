import {
  ConditionalStimulusParamsTypes,
  StimulusDropdownInfo,
  StimulusTypeOption,
  StimulusModuleOption,
  SimulationConfiguration,
  StimulusConfig,
  CurrentInjectionSimulationConfig,
  SynapseConfig,
  RecordLocation,
  SimulationExperimentalSetup,
} from '@/types/simulation/single-neuron';
import { getParamValues } from '@/util/simulate/single-neuron';
import { SingleSynaptomeConfig } from '@/types/synaptome';
import { SynapseType } from '@/components/neuron-viewer/hooks/events';

export const stimulusTypeParams: StimulusDropdownInfo & {
  options: StimulusTypeOption[];
} = {
  name: 'Type',
  value: 'current_clamp',
  options: [
    { label: 'Current clamp', value: 'current_clamp' },
    { label: 'Voltage clamp', value: 'voltage_clamp' },
    { label: 'Conductance', value: 'conductance' },
  ],
};

// taken from https://github.com/BlueBrain/BlueCelluLab/blob/main/bluecellulab/stimulus/factory.py#L311
export const stimulusModuleParams: StimulusDropdownInfo & {
  options: StimulusModuleOption[];
} = {
  name: 'Protocol',
  value: 'step',
  options: [
    {
      label: 'AP_WAVEFORM',
      value: 'ap_waveform',
      usedBy: ['current_clamp'],
      description:
        'This protocol is used to check the precise AP waveform. The aim is to get 1-2 APs for higher currents to study the AP properties such as AP amplitude, AP duration, peak time, afterhyperpolarisation, rise-time, fall-time, etc.',
      delay: 250,
      duration: 50,
      stopTime: 550,
    },
    {
      label: 'IDREST',
      value: 'idrest',
      usedBy: ['current_clamp'],
      description: `This protocol is a sequence of depolarizing square pulses. The aim is to get as many APs as possible and make cell firing up to saturation. The firing properties, such as mean AP frequency and interspike intervals, bursting number, etc., are calculated to determine the cell's e-type (electrical firing type).`,
      delay: 250,
      duration: 1350,
      stopTime: 1850,
    },
    {
      label: 'IV',
      value: 'iv',
      usedBy: ['current_clamp'],
      description:
        'This protocol is used to check the passive properties and the voltage sag. A sequence of current steps, from hyperpolarization to small depolarization, is injected. It is mainly used to calculate the Input resistance of the cell.',

      delay: 250,
      duration: 3000,
      stopTime: 3500,
    },
    {
      label: 'FIRE_PATTERN',
      value: 'fire_pattern',
      usedBy: ['current_clamp'],
      description: ` This protocol involves injecting a few long-duration, small and high suprathreshold currents. This protocol and IDREST are used to check cells' electrical firing type (e-type), e.g., continuous, bursting, stuttering and irregular firing.`,

      delay: 250,
      duration: 3600,
      stopTime: 4100, // TODO: Update
    },
  ],
};

// These  values are based on discussions in this ticket - https://bbpteam.epfl.ch/project/issues/browse/BBPP134-2099
// The default value for `step` is reduced for some protocols to reduce the number of simulation processes.
export const stimulusParams: ConditionalStimulusParamsTypes = {
  ap_waveform: {
    params: {
      defaultValue: 250,
      min: 0.05,
      max: 0.5,
      step: 5,
      unit: 'ms',
    },
  },
  idrest: {
    params: {
      defaultValue: 1350,
      min: 0.05,
      max: 0.5,
      step: 5,
      unit: 'ms',
    },
  },
  iv: {
    params: {
      defaultValue: 3000,
      min: -0.5,
      max: 0.1,
      step: 5,
      unit: 'ms',
    },
  },
  fire_pattern: {
    params: {
      defaultValue: 3600,
      min: 0.05,
      max: 0.5,
      step: 4,
      unit: 'ms',
    },
  },
};

const DEFAULT_SECTION = 'soma[0]';

export const DEFAULT_RECORDING_LOCATION: RecordLocation = {
  section: DEFAULT_SECTION,
  offset: 0.5,
};

export const DEFAULT_SIMULATION_EXPERIMENTAL_SETUP: SimulationExperimentalSetup = {
  celsius: 34,
  vinit: -73,
  hypamp: 0,
  max_time: 2000,
  time_step: 0.05,
  seed: 100,
};

export const DEFAULT_PROTOCOL = 'idrest';

export const DEFAULT_STIM_CONFIG: StimulusConfig = {
  stimulusType: 'current_clamp',
  stimulusProtocol: DEFAULT_PROTOCOL,
  stimulusProtocolOptions: stimulusModuleParams.options.filter((option) =>
    option.usedBy.includes('current_clamp')
  ),
  stimulusProtocolInfo:
    stimulusModuleParams.options.find((option) => option.value === DEFAULT_PROTOCOL) || null,
  paramInfo: stimulusParams.idrest,
  paramValues: getParamValues(stimulusParams.idrest),
  amplitudes: [40, 80, 120],
};

export const DEFAULT_DIRECT_STIM_CONFIG: CurrentInjectionSimulationConfig = {
  id: 0,
  configId: crypto.randomUUID(),
  injectTo: DEFAULT_SECTION,
  stimulus: DEFAULT_STIM_CONFIG,
};

export const DEFAULT_SIM_CONFIG: SimulationConfiguration = {
  conditions: DEFAULT_SIMULATION_EXPERIMENTAL_SETUP,
  recordFrom: [{ ...DEFAULT_RECORDING_LOCATION }],
  currentInjection: [DEFAULT_DIRECT_STIM_CONFIG],
  synapses: undefined,
};

export const SYNPASE_CODE_TO_TYPE: Record<number, SynapseType> = {
  110: 'excitatory',
  10: 'inhibitory',
};

export const getDefaultSynapseConfig = (
  synapsePlacementConfig?: SingleSynaptomeConfig[]
): SynapseConfig | null => {
  if (synapsePlacementConfig) {
    return {
      id: synapsePlacementConfig[0].id,
      configId: crypto.randomUUID(),
      color: '#ffffff',
      delay: 100,
      duration: 2000,
      frequency: 20,
      weightScalar: 2,
    };
  }
  return null;
};

export const SIMULATION_COLORS = [
  '#FF8B2C',
  '#32C14E',
  '#8AB5FF',
  '#DC51FF',
  '#B3A26E',
  '#F02124',
  '#32D4C1',
  '#814BFF',
  '#E3F750',
  '#D653C5',
  '#AD7A14',
  '#87BB74',
  '#DFC6AE',
  '#5778FF',
  '#EE527C',
  '#81ADE0',
  '#99FF80',
  '#FFCF30',
  '#5193BA',
  '#DD63CF',
];

// Each amperage starts a new simulation process in the server. To limit resource consumption, we put a maximum threshold on number of amperages a simulation can have.
export const MAX_AMPERAGE_STEPS = 15;
