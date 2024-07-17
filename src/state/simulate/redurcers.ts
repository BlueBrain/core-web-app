import { SimConfig, SimAction } from '@/types/simulate/single-neuron';
import { getParamValues } from '@/util/simulate/single-neuron';
import {
  stimulusModuleParams,
  stimulusParams,
  DEFAULT_DIRECT_STIM_CONFIG,
} from '@/constants/simulate/single-neuron';

export function simReducer(state: SimConfig, action: SimAction): SimConfig {
  switch (action.type) {
    case 'CHANGE_STIMULATION_TYPE': {
      if (
        !state.directStimulation?.find(
          (stimConfig) => stimConfig.id === action.payload.stimulationId
        )
      ) {
        throw new Error(`No stimulation config for id ${action.payload.stimulationId} exists`);
      }
      const options = stimulusModuleParams.options.filter((option) =>
        option.usedBy.includes(action.payload.value)
      );
      const paramInfo = stimulusParams[options?.[0]?.value] || {};
      return {
        ...state,
        directStimulation: state.directStimulation.map((stim) =>
          stim.id === action.payload.stimulationId
            ? {
                ...stim,
                stimulus: {
                  ...stim.stimulus,
                  stimulusType: action.payload.value,
                  stimulusProtocolOptions: options || [],
                  stimulusProtocolInfo: options?.[0] || null,
                  stimulusProtocol: options?.[0]?.value || null,
                  paramValues: getParamValues(paramInfo),
                  paramInfo,
                },
              }
            : { ...stim }
        ),
      };
    }
    case 'CHANGE_PROTOCOL': {
      if (
        !state.directStimulation?.find(
          (stimConfig) => stimConfig.id === action.payload.stimulationId
        )
      ) {
        throw new Error(`No stimulation config for id ${action.payload.stimulationId} exists`);
      }

      const protocolInfo = stimulusModuleParams.options.find(
        (option) => option.value === action.payload.value
      );
      if (!protocolInfo) throw new Error(`Protocol info ${action.payload} not found`);

      const paramInfo = stimulusParams[action.payload.value];
      if (!paramInfo) throw new Error(`Parameters for protocol ${action.payload} not found`);
      // duration depending on protocol
      paramInfo.stop_time.defaultValue = protocolInfo.duration;

      return {
        ...state,
        directStimulation: state.directStimulation.map((stim) =>
          stim.id === action.payload.stimulationId
            ? {
                ...stim,
                stimulus: {
                  ...stim.stimulus,
                  stimulusProtocolInfo: protocolInfo || null,
                  stimulusProtocol: protocolInfo?.value || null,
                  paramValues: getParamValues(paramInfo),
                  paramInfo,
                },
              }
            : { ...stim }
        ),
      };
    }
    case 'CHANGE_STIM_PARAM': {
      if (
        !state.directStimulation?.find(
          (stimConfig) => stimConfig.id === action.payload.stimulationId
        )
      ) {
        throw new Error(`No stimulation config for id ${action.payload.stimulationId} exists`);
      }

      return {
        ...state,
        directStimulation: state.directStimulation.map((stim) =>
          stim.id === action.payload.stimulationId
            ? {
                ...stim,
                stimulus: {
                  ...stim.stimulus,
                  paramValues: {
                    ...stim.stimulus.paramValues,
                    [action.payload.key]: action.payload.value,
                  },
                },
              }
            : { ...stim }
        ),
      };
    }
    case 'CHANGE_AMPLITUDES': {
      if (
        !state.directStimulation?.find(
          (stimConfig) => stimConfig.id === action.payload.stimulationId
        )
      ) {
        throw new Error(`No stimulation config for id ${action.payload.stimulationId} exists`);
      }
      return {
        ...state,
        directStimulation: state.directStimulation.map((stim) =>
          stim.id === action.payload.stimulationId
            ? {
                ...stim,
                stimulus: {
                  ...stim.stimulus,
                  amplitudes: action.payload.value,
                },
              }
            : { ...stim }
        ),
      };
    }
    case 'CHANGE_DIRECT_STIM_PROPERTY': {
      if (
        !state.directStimulation?.find(
          (stimConfig) => stimConfig.id === action.payload.stimulationId
        )
      ) {
        throw new Error(`No stimulation config for id ${action.payload.stimulationId} exists`);
      }
      return {
        ...state,
        directStimulation: state.directStimulation.map((stim) =>
          stim.id === action.payload.stimulationId
            ? {
                ...stim,
                [action.payload.key]: action.payload.value,
              }
            : { ...stim }
        ),
      };
    }
    case 'CHANGE_RECORD_FROM': {
      return {
        ...state,
        recordFrom: [...action.payload],
      };
    }
    case 'SET_ONLY_STIMULUS': {
      return {
        ...state,
        synapses: null,
        directStimulation: state.directStimulation
          ? [...state.directStimulation]
          : [DEFAULT_DIRECT_STIM_CONFIG],
      };
    }
    case 'SET_ONLY_SYNAPSES': {
      return {
        ...state,
        directStimulation: null,
        synapses: [...action.payload],
      };
    }
    case 'SET_STIMULUS_AND_SYNAPSES': {
      return {
        ...state,
        directStimulation: state.directStimulation
          ? [...state.directStimulation]
          : [DEFAULT_DIRECT_STIM_CONFIG],
        synapses: [...action.payload],
      };
    }
    case 'UPDATE_SYNAPSE': {
      if (!state.synapses || !state.synapses.find((s) => s.id === action.payload.id)) {
        throw new Error(`No synapses found with id ${action.payload.id}`);
      }
      return {
        ...state,
        synapses: state.synapses.map((s) =>
          s.id === action.payload.id
            ? { ...s, [action.payload.key]: action.payload.value }
            : { ...s }
        ),
      };
    }
    case 'ADD_SYNAPSE': {
      if (!state.synapses) {
        throw new Error(`No synapses found in config`);
      }

      return {
        ...state,
        synapses: [...state.synapses, { ...action.payload }],
      };
    }
    case 'REMOVE_SYNAPSE': {
      if (!state.synapses) {
        throw new Error(`No synapses found in config`);
      }

      return {
        ...state,
        synapses: state.synapses.filter((s, index) => index !== action.payload.id),
      };
    }
    case 'ADD_STIMULATION_CONFIG': {
      if (!state.directStimulation) {
        throw new Error(`No direct simulation configs found in simulation`);
      }

      return {
        ...state,
        directStimulation: [
          ...state.directStimulation,
          { ...DEFAULT_DIRECT_STIM_CONFIG, id: `${state.directStimulation.length}` },
        ],
      };
    }
    case 'REMOVE_STIMULATION_CONFIG': {
      if (!state.directStimulation) {
        throw new Error(`No direct simulation configs found in simulation`);
      }

      return {
        ...state,
        directStimulation: state.directStimulation.filter(
          (s, index) => index !== action.payload.stimulationId
        ),
      };
    }
    default:
      return {
        ...state,
      };
  }
}
