import WsCommon from '@/services/ws-common';

export const BluePyEModelCmd = {
  // Cmd target: backend
  SET_MODEL: 'set_model',
  RUN_ANALYSIS: 'run_analysis',
};

export type WSResponses = `${Lowercase<keyof typeof BluePyEModelCmd>}_done`;

export default class Ws extends WsCommon<WSResponses> {}
