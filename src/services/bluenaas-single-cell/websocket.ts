import WsCommon from '@/services/ws-common';

export const BlueNaasCmd = {
  // Cmd target: backend
  SET_MODEL: 'set_model',
  GET_UI_DATA: 'get_ui_data',
  SET_INJECTION_LOCATION: 'set_injection_location',
  START_SIMULATION: 'start_simulation',
  GET_STIMULI_PLOT_DATA: 'get_stimuli_plot_data',
};

export type WSResponses =
  | `${Lowercase<keyof typeof BlueNaasCmd>}_done`
  | 'partial_simulation_data'
  | 'partial_morphology_data';

export default class Ws extends WsCommon<WSResponses> {}
