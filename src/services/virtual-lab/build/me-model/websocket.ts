import WsCommon from '@/services/ws-common';

export const BluePyEModelCmd = {
  // Cmd target: backend
  SET_MODEL: 'set_model',
  RUN_ANALYSIS: 'run_analysis',
};

type BluePyEModelCmdKeys = Lowercase<keyof typeof BluePyEModelCmd>;

export type WSResponses = `${BluePyEModelCmdKeys}_done` | `${BluePyEModelCmdKeys}_error`;

export default class Ws extends WsCommon<WSResponses> {}
