import {
  ExpDesignerGroupParameter,
  ExpDesignerMultipleDropdownParameter,
  ExpDesignerTargetParameter,
} from '@/types/experiment-designer';

export const getNewStimulusObj = (): ExpDesignerGroupParameter => ({
  id: crypto.randomUUID(),
  name: crypto.randomUUID(),
  type: 'group',
  value: [
    {
      id: 'stimType',
      name: 'Type',
      type: 'dropdown',
      value: 'Current',
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

export const getNewRecordingObj = (): ExpDesignerGroupParameter => ({
  id: crypto.randomUUID(),
  name: crypto.randomUUID(),
  type: 'group',
  value: [
    {
      id: 'variableType',
      name: 'Variable',
      type: 'dropdown',
      value: 'Soma voltage',
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
      id: 'recordingTarget',
      name: 'Target',
      type: 'targetDropdown',
      value: 'AAA',
    },
  ],
});

export const getNewSensoryInputObj = (): ExpDesignerGroupParameter => ({
  id: 'input1',
  name: 'input1',
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
  name: 'name',
  type: 'targetDropdown',
  value: 'AAA',
});

export const getNewMultiDropdown = (): ExpDesignerMultipleDropdownParameter => ({
  id: crypto.randomUUID(),
  name: 'name',
  type: 'multipleDropdown',
  value: [],
  options: [],
});
