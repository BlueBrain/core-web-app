import { focusAtom } from 'jotai-optics';
import { OpticFor } from 'optics-ts';
import { PrimitiveAtom } from 'jotai';
import range from 'lodash/range';
import round from 'lodash/round';

import { getNewStepper, getNewTargetObj } from './defaultNewObject';
import { expDesignerConfigAtom } from '@/state/experiment-designer';
import type {
  ExpDesignerConfig,
  ExpDesignerGroupParameter,
  ExpDesignerNumberParameter,
  ExpDesignerParam,
  ExpDesignerRangeParameter,
  ExpDesignerTargetParameter,
  ExpDesignerTargetDropdownGroupParameter,
  ExpDesignerMultipleDropdownParameter,
  ExpDesignerDropdownParameter,
  StepperType,
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
      stepper: getNewStepper(),
    },
  };
}

function changeRangeToNumber(rangeParam: ExpDesignerRangeParameter): ExpDesignerNumberParameter {
  return {
    ...rangeParam,
    type: 'number',
    value: rangeParam.value.start,
    min: rangeParam.value.min,
    max: rangeParam.value.max,
    step: rangeParam.value.step,
  };
}

function changeTargetToTargetList(
  targetParam: ExpDesignerTargetParameter
): ExpDesignerTargetDropdownGroupParameter {
  const newTarget = getNewTargetObj();
  newTarget.value = targetParam.value;

  return {
    id: targetParam.id,
    name: targetParam.name,
    type: 'targetDropdownGroup',
    value: [newTarget.value],
  };
}

function changeTargetListToTarget(
  targetListParam: ExpDesignerTargetDropdownGroupParameter
): ExpDesignerTargetParameter {
  let singleTarget: ExpDesignerTargetParameter;

  if (targetListParam.value.length) {
    const [firstItem] = targetListParam.value;
    singleTarget = {
      ...targetListParam,
      type: 'targetDropdown',
      value: firstItem,
    };
  } else {
    singleTarget = getNewTargetObj();
    singleTarget.name = targetListParam.name;
  }

  return {
    ...singleTarget,
  };
}

function changeDropdownToDropdownList(
  dropdown: ExpDesignerDropdownParameter
): ExpDesignerMultipleDropdownParameter {
  return {
    ...dropdown,
    type: 'multipleDropdown',
    value: [dropdown.value],
  };
}

function changeMultiDropdownToDropdown(
  multiDropdown: ExpDesignerMultipleDropdownParameter
): ExpDesignerDropdownParameter {
  const singleValue = multiDropdown.value.length
    ? multiDropdown.value[0]
    : multiDropdown.options[0].value;
  return {
    ...multiDropdown,
    type: 'dropdown',
    value: singleValue,
  };
}

export function applySwapFunction(param: ExpDesignerParam): ExpDesignerParam | undefined {
  let newSwapParam;
  switch (param.type) {
    case 'number':
      newSwapParam = changeNumberToRange(param);
      break;

    case 'range':
      newSwapParam = changeRangeToNumber(param);
      break;

    case 'targetDropdown':
      newSwapParam = changeTargetToTargetList(param);
      break;

    case 'targetDropdownGroup':
      newSwapParam = changeTargetListToTarget(param);
      break;

    case 'dropdown':
      newSwapParam = changeDropdownToDropdownList(param);
      break;

    case 'multipleDropdown':
      newSwapParam = changeMultiDropdownToDropdown(param);
      break;

    default:
      break;
  }
  return newSwapParam;
}

export function calculateRangeOutput(start: number, end: number, stepper: StepperType) {
  let values: number[];
  if (stepper.name === 'Number of steps') {
    const steps = (end - start) / stepper.value;
    values = range(start, end, steps);
  } else {
    values = range(start, end, stepper.value);
  }
  return values.map((v) => round(v, 2));
}

export default getFocusedAtom;
