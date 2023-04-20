import {
  ExpDesignerGroupParameter,
  ExpDesignerMultipleDropdownParameter,
  ExpDesignerRegionParameter,
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
    },
    {
      id: 'targetInputRegion',
      name: 'Target',
      type: 'regionDropdown',
      brainRegionId: 382,
      value: 'Field CA1',
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
    },
    {
      id: 'recordingRegion',
      name: 'Target',
      type: 'regionDropdown',
      brainRegionId: 382,
      value: 'Field CA1',
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
    },
    {
      id: 'targetInputRegion',
      name: 'Target',
      type: 'regionDropdown',
      brainRegionId: 382,
      value: 'Field CA1',
    },
  ],
});

export const getNewTargetObj = (): ExpDesignerRegionParameter => ({
  id: crypto.randomUUID(),
  name: 'name',
  type: 'regionDropdown',
  value: 'Field CA1',
  brainRegionId: 382,
});

export const getNewMultiDropdown = (): ExpDesignerMultipleDropdownParameter => ({
  id: crypto.randomUUID(),
  name: 'name',
  type: 'multipleDropdown',
  value: [],
  options: [],
});
