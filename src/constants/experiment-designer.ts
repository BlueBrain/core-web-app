import { StimulusTypeDropdown, StimulusModuleDropdown } from '@/types/experiment-designer';

export const stimulusTypeParams: StimulusTypeDropdown = {
  id: 'type',
  name: 'Type',
  type: 'dropdown',
  value: 'current_clamp',
  options: [
    { label: 'Current clamp', value: 'current_clamp' },
    { label: 'Voltage clamp', value: 'voltage_clamp' },
    { label: 'Conductance', value: 'conductance' },
  ],
};

export const stimulusModuleParams: StimulusModuleDropdown = {
  id: 'module',
  name: 'Module',
  type: 'dropdown',
  value: 'linear',
  options: [
    { label: 'Linear', value: 'linear' },
    { label: 'Relative linear', value: 'relative_linear' },
    { label: 'Pulse', value: 'pulse' },
    { label: 'Subthreshold', value: 'subthreshold' },
    { label: 'Hyperpolarizing', value: 'hyperpolarizing' },
    { label: 'Seclamp', value: 'seclamp' },
    { label: 'Noise', value: 'noise' },
    { label: 'Shot noise', value: 'shot_noise' },
    { label: 'Relative shot noise', value: 'relative_shot_noise' },
    { label: 'Absolute shot noise', value: 'absolute_shot_noise' },
    { label: 'Ornstein uhlenbeck', value: 'ornstein_uhlenbeck' },
    { label: 'Relative ornstein uhlenbeck', value: 'relative_ornstein_uhlenbeck' },
  ],
};
