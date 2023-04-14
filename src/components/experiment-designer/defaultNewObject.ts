import { ExpDesignerGroupParameter } from '@/types/experiment-designer';

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
    },
    {
      id: 'targetInputRegion',
      name: 'Target',
      type: 'regionDropdown',
      value: 'Hippocampus CA1',
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
    },
    {
      id: 'recordingRegion',
      name: 'Target',
      type: 'regionDropdown',
      value: 'Hippocampus CA1',
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
    },
    {
      id: 'targetInputRegion',
      name: 'Target',
      type: 'regionDropdown',
      value: 'Hippocampus CA1',
    },
  ],
});
