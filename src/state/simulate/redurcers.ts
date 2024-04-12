import { SimConfig, SimAction } from '@/types/simulate/single-neuron';
import { getParamValues } from '@/util/simulate/single-neuron';
import { stimulusModuleParams, stimulusParams } from '@/constants/simulate/single-neuron';

export function simReducer(state: SimConfig, action: SimAction): SimConfig {
  switch (action.type) {
    case 'CHANGE_TYPE': {
      const options = stimulusModuleParams.options.filter((option) =>
        option.usedBy.includes(action.payload)
      );
      const paramInfo = stimulusParams[options?.[0]?.value] || {};

      return {
        ...state,
        stimulus: {
          ...state.stimulus,
          stimulusType: action.payload,
          stimulusProtocolOptions: options || [],
          stimulusProtocolInfo: options?.[0] || null,
          stimulusProtocol: options?.[0]?.value || null,
          paramValues: getParamValues(paramInfo),
          paramInfo,
        },
      };
    }
    case 'CHANGE_PROTOCOL': {
      const protocolInfo = stimulusModuleParams.options.find(
        (option) => option.value === action.payload
      );
      if (!protocolInfo) throw new Error(`Protocol info ${action.payload} not found`);

      const paramInfo = stimulusParams[action.payload];
      if (!paramInfo) throw new Error(`Parameters for protocol ${action.payload} not found`);
      // duration depending on protocol
      paramInfo.stop_time.defaultValue = protocolInfo.duration;

      return {
        ...state,
        stimulus: {
          ...state.stimulus,
          stimulusProtocolInfo: protocolInfo || null,
          stimulusProtocol: protocolInfo?.value || null,
          paramValues: getParamValues(paramInfo),
          paramInfo,
        },
      };
    }
    case 'CHANGE_STIM_PARAM': {
      return {
        ...state,
        stimulus: {
          ...state.stimulus,
          paramValues: {
            ...state.stimulus.paramValues,
            [action.payload.key]: action.payload.value,
          },
        },
      };
    }
    case 'CHANGE_AMPLITUDES': {
      return {
        ...state,
        stimulus: {
          ...state.stimulus,
          amplitudes: action.payload,
        },
      };
    }
    case 'CHANGE_PARAM': {
      return {
        ...state,
        [action.payload.key]: action.payload.value,
      };
    }
    default:
      return {
        ...state,
      };
  }
}
