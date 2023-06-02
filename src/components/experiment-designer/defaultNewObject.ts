import {
  ExpDesignerGroupParameter,
  ExpDesignerMultipleDropdownParameter,
  ExpDesignerTargetParameter,
  StepperType,
} from '@/types/experiment-designer';

export const getNewStimulusObj = (): ExpDesignerGroupParameter => ({
  id: crypto.randomUUID(),
  name: '',
  type: 'group',
  value: [
    {
      id: 'stimType',
      name: 'Type',
      type: 'dropdown',
      value: 'current_clamp',
      options: [{ label: 'Current clamp', value: 'current_clamp' }],
    },
    {
      id: 'stimModule',
      name: 'Module',
      type: 'dropdown',
      value: 'linear',
      options: [{ label: 'Linear', value: 'linear' }],
    },
    {
      id: 'ampStart',
      name: 'AmpStart',
      type: 'number',
      value: 0.0351,
      unit: 'nA',
      min: 0,
      max: 2,
      step: 0.01,
    },
    {
      id: 'delay',
      name: 'Delay',
      type: 'number',
      value: 0,
      unit: 'ms',
      min: 0,
      max: 2000,
      step: 100,
    },
    {
      id: 'duration',
      name: 'Duration',
      type: 'number',
      value: 4000,
      unit: 'ms',
      min: 0,
      max: 20000,
      step: 1000,
    },
    {
      id: 'targetInput',
      name: 'Target',
      type: 'targetDropdown',
      value: 'AAA',
    },
  ],
});

export const getNewRecordingObj = (): ExpDesignerGroupParameter => ({
  id: crypto.randomUUID(),
  name: '',
  type: 'group',
  value: [
    {
      id: 'variableType',
      name: 'Variable',
      type: 'dropdown',
      value: 'v',
      options: [{ label: 'Soma voltage', value: 'v' }],
    },
    {
      id: 'sections',
      name: 'Sections',
      type: 'dropdown',
      value: 'soma',
      options: [{ label: 'Soma', value: 'soma' }],
    },
    {
      id: 'reportType',
      name: 'Type',
      type: 'dropdown',
      value: 'compartment',
      options: [{ label: 'Compartment', value: 'compartment' }],
    },
    {
      id: 'startTime',
      name: 'Start time',
      type: 'number',
      value: 0,
      unit: 'ms',
      min: 0,
      max: 20000,
      step: 500,
    },
    {
      id: 'duration',
      name: 'Duration',
      type: 'number',
      value: 4000,
      unit: 'ms',
      min: 0,
      max: 20000,
      step: 1000,
    },
    {
      id: 'dt',
      name: 'Dt',
      type: 'number',
      value: 0.1,
      unit: 'ms',
      min: 0,
      max: 100,
      step: 0.1,
    },
    {
      id: 'recordingTarget',
      name: 'Target',
      type: 'targetDropdown',
      value: 'AAA',
    },
  ],
});

export const getNewSensoryInputObj = (): ExpDesignerGroupParameter => ({
  id: crypto.randomUUID(),
  name: '',
  type: 'group',
  value: [
    {
      id: 'spikes',
      name: 'Spikes',
      type: 'dropdown',
      value: 'Whiskers stimulus',
      options: [],
    },
    {
      id: 'duration',
      name: 'Duration',
      type: 'number',
      value: 4000,
      unit: 'ms',
      min: 0,
      max: 20000,
      step: 1000,
    },
    {
      id: 'targetInput',
      name: 'Target',
      type: 'targetDropdown',
      value: 'AAA',
    },
  ],
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
