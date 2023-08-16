import { FeatureParameterGroup } from '@/types/e-model';

export const mockEModelAssignedMap: Record<string, string> = {
  'L1_DAC<>bNAC': 'cNAC_12345_2023',
  'L1_DAC<>cNAC': '',
  'L1_HAC<>bNAC': '',
  'L1_HAC<>cIR': '',
  'L1_HAC<>cNAC': 'cNAC_12345_2023',
  'L1_LAC<>cNAC': '',
  'L1_NGC-DA<>bNAC': 'cNAC_188971245_2023',
  'L1_NGC-DA<>cSTUT': '',
  'L1_NGC-SA<>cNAC': '',
  'L1_SAC<>bNAC': '',
  'L1_SAC<>cAC': 'cNAC_12345_2023',
  'L1_SAC<>cNAC': '',
};

export const mockFeatureParameters: FeatureParameterGroup = {
  'Spike shape': [
    { parameterName: 'decay_time_constant_after_sim', selected: true },
    { parameterName: 'min_AHP-indices', selected: true },
    { parameterName: 'steady_state_hyper', selected: true },
    { parameterName: 'voltage', selected: true },
    { parameterName: 'voltage_deflection_vb_ssse', selected: true },
  ],
  'Spike event': [
    { parameterName: 'decay_time_constant_after_sim', selected: true },
    { parameterName: 'steady_state_hyper', selected: true },
    { parameterName: 'voltage', selected: true },
    { parameterName: 'voltage_deflection_vb_ssse', selected: true },
  ],
  Voltage: [
    { parameterName: 'decay_time_constant_after_sim', selected: true },
    { parameterName: 'min_AHP-indices', selected: true },
    { parameterName: 'voltage_deflection_vb_ssse', selected: true },
  ],
};
