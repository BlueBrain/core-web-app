import { SubConfigName } from '@/types/nexus';

export const defaultReleaseUrl =
  'https://bbp.epfl.ch/nexus/v1/resources/bbp/mmb-point-neuron-framework-model/_/https:%2F%2Fbbp.epfl.ch%2Fneurosciencegraph%2Fdata%2Fmodelconfigurations%2F1921aaae-69c4-4366-ae9d-7aa1453f2158';

export const supportedUIConfigVersion: Record<SubConfigName, number> = {
  cellCompositionConfig: 1,
  cellPositionConfig: 0,
  morphologyAssignmentConfig: 1,
  meModelConfig: 1,
  macroConnectomeConfig: 0,
  microConnectomeConfig: 1,
  synapseConfig: 1,
};
