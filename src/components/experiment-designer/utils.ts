import { focusAtom } from 'jotai-optics';
import { OpticFor } from 'optics-ts';
import { PrimitiveAtom } from 'jotai';

import { expDesignerConfigAtom } from '@/state/experiment-designer';
import type {
  ExpDesignerConfig,
  ExpDesignerGroupParameter,
  ExpDesignerNumberParameter,
  ExpDesignerParam,
  ExpDesignerRangeParameter,
} from '@/types/experiment-designer';

export function getFocusedAtom(name: string) {
  return focusAtom(expDesignerConfigAtom, (optic: OpticFor<ExpDesignerConfig>) => optic.prop(name));
}

export function getSubGroupFocusedAtom(groupParamAtom: PrimitiveAtom<ExpDesignerGroupParameter>) {
  return focusAtom(groupParamAtom, (optic: OpticFor<ExpDesignerGroupParameter>) =>
    optic.prop('value')
  );
}

export function cloneLastAndAdd(setSectionConfig: any) {
  setSectionConfig((sectionConfig: ExpDesignerGroupParameter[]) => {
    if (!sectionConfig.length) return [];

    const lastItemClone = structuredClone(sectionConfig.slice(-1)[0]);
    lastItemClone.id = crypto.randomUUID();
    lastItemClone.name = lastItemClone.id;
    sectionConfig.push(lastItemClone);

    return [...sectionConfig];
  });
}

function changeNumberToRange(numberParam: ExpDesignerNumberParameter): ExpDesignerRangeParameter {
  const { value } = numberParam;

  let newEnd: number = Math.round(value + (value * 50) / 100);
  let newStep: number = 1;

  if (value < 1) {
    newEnd = 1 + value;
    newStep = 0.1;
  }

  return {
    ...numberParam,
    type: 'range',
    value: {
      min: numberParam.min,
      max: numberParam.max,
      start: numberParam.value,
      end: newEnd,
      step: newStep,
    },
  };
}

export function applySwapFunction(param: ExpDesignerParam): ExpDesignerParam | undefined {
  let newSwapParam;
  switch (param.type) {
    case 'number':
      newSwapParam = changeNumberToRange(param);
      break;

    default:
      break;
  }
  return newSwapParam;
}

export default getFocusedAtom;
