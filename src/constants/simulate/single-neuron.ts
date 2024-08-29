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
  SimulationConditions,
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
      description: '',
      delay: 250,
      duration: 50,
      stopTime: 0, // TODO: Update
    },
    {
      label: 'IDREST',
      value: 'idrest',
      usedBy: ['current_clamp'],
      description: '',

      delay: 250,
      duration: 1350,
      stopTime: 1850,
    },
    {
      label: 'IV',
      value: 'iv',
      usedBy: ['current_clamp'],
      description: '',

      delay: 250,
      duration: 3000,
      stopTime: 0, // TODO: Update
    },
    {
      label: 'FIRE_PATTERN',
      value: 'fire_pattern',
      usedBy: ['current_clamp'],
      description: '',

      delay: 250,
      duration: 3600,
      stopTime: 0, // TODO: Update
    },
  ],
};

export const stimulusParams: ConditionalStimulusParamsTypes = {
  ap_waveform: {
    params: {
      defaultValue: 250,
      min: 40,
      max: 120,
      step: 40,
      unit: 'ms',
    },
  },
  idrest: {
    params: {
      defaultValue: 1350,
      min: 0.05,
      max: 0.5,
      step: 10,
      unit: 'ms',
    },
  },
  iv: {
    params: {
      defaultValue: 3000,
      min: 40,
      max: 120,
      step: 40,
      unit: 'ms',
    },
  },
  fire_pattern: {
    params: {
      defaultValue: 3600,
      min: 40,
      max: 120,
      step: 40,
      unit: 'ms',
    },
  },
};

const DEFAULT_SECTION = 'soma[0]';

export const DEFAULT_RECORDING_LOCATION: RecordLocation = {
  section: DEFAULT_SECTION,
  offset: 0.5,
};

export const DEFAULT_SIMULATION_CONDITIONS: SimulationConditions = {
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
  conditions: DEFAULT_SIMULATION_CONDITIONS,
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

export const SYNAPTIC_INPUT_COLORS = [
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
