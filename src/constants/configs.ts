import { SubConfigName } from '@/types/nexus';

export const supportedUIConfigVersion: Record<SubConfigName, number> = {
  cellCompositionConfig: 1,
  cellPositionConfig: 0,
  morphologyAssignmentConfig: 1,
  meModelConfig: 1,
  macroConnectomeConfig: 0,
  microConnectomeConfig: 1,
  synapseConfig: 1,
};
