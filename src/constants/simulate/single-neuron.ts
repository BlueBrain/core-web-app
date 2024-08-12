import {
  ConditionalStimulusParamsTypes,
  FunctionParameterNumber,
  StimulusDropdownInfo,
  StimulusTypeOption,
  StimulusModuleOption,
  SimulationConfiguration,
  StimulusConfig,
  DirectSimulationConfig,
  SynapseConfig,
} from '@/types/simulation/single-neuron';
import { getParamValues } from '@/util/simulate/single-neuron';
import { SingleSynaptomeConfig } from '@/types/synaptome';

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
      duration: 550,
    },
    {
      label: 'IDREST',
      value: 'idrest',
      usedBy: ['current_clamp'],
      description: '',
      duration: 1850,
    },
    {
      label: 'IV',
      value: 'iv',
      usedBy: ['current_clamp'],
      description: '',
      duration: 3500,
    },
    {
      label: 'FIRE_PATTERN',
      value: 'fire_pattern',
      usedBy: ['current_clamp'],
      description: '',
      duration: 4100,
    },
  ],
};

const commonParams: { [key: string]: FunctionParameterNumber } = {
  stop_time: {
    name: 'Stop time',
    description: 'time to stop the stimulus.',
    defaultValue: 3500,
    min: 0,
    max: 10000,
    step: 1,
    unit: 'ms',
  },
};

export const stimulusParams: ConditionalStimulusParamsTypes = {
  ap_waveform: {
    ...commonParams,
  },
  idrest: {
    ...commonParams,
  },
  iv: {
    ...commonParams,
  },
  fire_pattern: {
    ...commonParams,
  },
};

export const DEFAULT_STIM_CONFIG: StimulusConfig = {
  stimulusType: 'current_clamp',
  stimulusProtocol: 'iv',
  stimulusProtocolOptions: stimulusModuleParams.options.filter((option) =>
    option.usedBy.includes('current_clamp')
  ),
  stimulusProtocolInfo:
    stimulusModuleParams.options.find((option) => option.value === 'iv') || null,
  paramInfo: stimulusParams.iv,
  paramValues: getParamValues(stimulusParams.iv),
  amplitudes: [40, 80, 120],
};

export const DEFAULT_DIRECT_STIM_CONFIG: DirectSimulationConfig = {
  id: '0',
  celsius: 34,
  hypamp: 0,
  vinit: -73,
  injectTo: 'soma[0]',
  stimulus: DEFAULT_STIM_CONFIG,
};

export const DEFAULT_SIM_CONFIG: SimulationConfiguration = {
  recordFrom: ['soma[0]_0'],
  directStimulation: [DEFAULT_DIRECT_STIM_CONFIG],
  synapses: null,
};

export const getDefaultSynapseConfig = (
  synapsePlacementConfig?: SingleSynaptomeConfig[]
): SynapseConfig | null => {
  if (synapsePlacementConfig) {
    return {
      id: '0',
      synapseId: synapsePlacementConfig[0].id,
      delay: 100,
      duration: 2000,
      frequency: 20,
      weightScalar: 2,
    };
  }
  return null;
};
