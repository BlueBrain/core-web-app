import { StimulusParameter } from '@/constants/cell-model-assignment/e-model-protocols';

export function getParamValues(paramInfo: StimulusParameter) {
  return Object.entries(paramInfo).reduce(
    (acc, [key, value]) => {
      acc[key] = value.defaultValue;
      return acc;
    },
    {} as Record<string, number>
  );
}
