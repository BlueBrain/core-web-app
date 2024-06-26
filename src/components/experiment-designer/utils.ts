import { focusAtom } from 'jotai-optics';
import { PrimitiveAtom } from 'jotai';
import range from 'lodash/range';
import round from 'lodash/round';
import filter from 'lodash/filter';
import find from 'lodash/find';

import { getNewStepper, getNewTargetObj } from './defaultNewObject';
import { expDesignerConfigAtom } from '@/state/experiment-designer';
import type {
  ExpDesignerGroupParameter,
  ExpDesignerNumberParameter,
  ExpDesignerParam,
  ExpDesignerRangeParameter,
  ExpDesignerTargetParameter,
  ExpDesignerTargetDropdownGroupParameter,
  ExpDesignerMultipleDropdownParameter,
  ExpDesignerDropdownParameter,
  StepperType,
  ExpDesignerSectionName,
} from '@/types/experiment-designer';
import { customRangeDelimeter } from '@/services/bbp-workflow/config';

export function getFocusedAtom(name: ExpDesignerSectionName) {
  return focusAtom(expDesignerConfigAtom, (optic) => optic.prop(name));
}

export function getSubGroupFocusedAtom(groupParamAtom: PrimitiveAtom<ExpDesignerGroupParameter>) {
  return focusAtom(groupParamAtom, (optic) => optic.prop('value'));
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

  const newEnd: number = Math.round(value + (value * 50) / 100);

  return {
    ...numberParam,
    type: 'range',
    value: {
      min: numberParam.min,
      max: numberParam.max,
      start: numberParam.value,
      end: newEnd,
      step: numberParam.step,
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
  if (stepper.value <= 0) return [];
  let values: number[];
  if (stepper.name === 'Number of steps') {
    if (stepper.value === 2) {
      values = [start, end];
    } else {
      const steps = (end - start) / (stepper.value - 1);
      values = [...range(start, end, steps), end];
    }
  } else {
    values = [...range(start, end, stepper.value), end];
  }
  return values.map((v) => round(v, 2));
}

function addTargetNamesFromInput(targetInput: ExpDesignerTargetParameter, targetSet: Set<string>) {
  const inputValue = (targetInput as ExpDesignerTargetParameter).value;
  if (Array.isArray(inputValue)) {
    inputValue.forEach(targetSet.add, targetSet);
  } else {
    targetSet.add(inputValue);
  }
}

export function extractTargetNamesFromSection(inputSectionParams: ExpDesignerParam[]): string[] {
  const inputSections = filter(inputSectionParams, {
    type: 'group',
  }) as ExpDesignerGroupParameter[];
  const targetValuesSet: Set<string> = new Set();

  inputSections.forEach((section) => {
    const targetInput = find(
      section.value,
      (item) => item.type === 'targetDropdown' || item.type === 'targetDropdownGroup'
    );

    if (targetInput) {
      addTargetNamesFromInput(targetInput as ExpDesignerTargetParameter, targetValuesSet);
    }
  });

  const targetDirectInputs = filter(
    inputSectionParams,
    (item) => item.type === 'targetDropdown' || item.type === 'targetDropdownGroup'
  );
  targetDirectInputs.forEach((targetInput) => {
    addTargetNamesFromInput(targetInput as ExpDesignerTargetParameter, targetValuesSet);
  });

  return Array.from(targetValuesSet);
}

// workaround to remove the string on the placeholders to be SONATA compatible
const templateReplaceRegexp = new RegExp(`"?${customRangeDelimeter}(\\$?[^"},]+)"?`, 'gm');

export function replaceCustomBbpWorkflowPlaceholders(text: string) {
  const replaced = text.replace(templateReplaceRegexp, '$1');
  return replaced;
}

export default getFocusedAtom;
