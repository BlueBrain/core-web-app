import {
  ExpDesignerGroupParameter,
  ExpDesignerMultipleDropdownParameter,
  ExpDesignerTargetParameter,
  StepperType,
} from '@/types/experiment-designer';
import expDesDefaults from '@/components/experiment-designer/experiment-designer-defaults';

export const getNewStimulusObj = (): ExpDesignerGroupParameter => ({
  id: crypto.randomUUID(),
  name: '',
  type: 'group',
  value: structuredClone((expDesDefaults.stimuli[0] as ExpDesignerGroupParameter).value),
});

export const getNewRecordingObj = (): ExpDesignerGroupParameter => ({
  id: crypto.randomUUID(),
  name: '',
  type: 'group',
  value: structuredClone((expDesDefaults.recording[0] as ExpDesignerGroupParameter).value),
});

export const getNewSensoryInputObj = (): ExpDesignerGroupParameter => ({
  id: crypto.randomUUID(),
  name: '',
  type: 'group',
  value: structuredClone((expDesDefaults.input[0] as ExpDesignerGroupParameter).value),
});

export const getNewTargetObj = (): ExpDesignerTargetParameter => ({
  id: crypto.randomUUID(),
  name: '',
  type: 'targetDropdown',
  value: 'AAA',
});

export const getNewMultiDropdown = (): ExpDesignerMultipleDropdownParameter => ({
  id: crypto.randomUUID(),
  name: '',
  type: 'multipleDropdown',
  value: [],
  options: [],
});

export const getNewStepper = (): StepperType => ({
  name: 'Number of steps',
  value: 2,
});
