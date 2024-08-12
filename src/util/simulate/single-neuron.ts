import { StimulusParameter } from '@/types/simulation/single-neuron';

export function getParamValues(paramInfo: StimulusParameter) {
  return Object.entries(paramInfo).reduce(
    (acc, [key, value]) => {
      acc[key] = value.defaultValue;
      return acc;
    },
    {} as Record<string, number>
  );
}
