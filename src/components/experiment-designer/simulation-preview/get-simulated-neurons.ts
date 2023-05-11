import find from 'lodash/find';
import isArray from 'lodash/isArray';
import { ExpDesignerParam, ExpDesignerTargetParameter } from '@/types/experiment-designer';

export default function getSimulatedNeurons(setup: ExpDesignerParam[]): string[] {
  const simulatedNeurons = find(
    setup,
    (setupEntry) => setupEntry.id === 'simulatedNeurons'
  ) as ExpDesignerTargetParameter;
  const simulatedNeuronsValue: string | string[] = simulatedNeurons?.value;
  return isArray(simulatedNeuronsValue) ? simulatedNeuronsValue : [simulatedNeuronsValue];
}
