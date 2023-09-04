import {
  ParameterKeyConfig,
  SimulationAnnotation,
  SimulationData,
  SimulationPreviewElement,
} from '@/components/experiment-interactive/types';

export const mockSimulationPreviews: SimulationPreviewElement[] = [
  {
    id: '1',
    simParams: {
      extracellular_calcium: 1.3,
      depol_stdev_mean_ratio: 0.7,
      desired_connected_proportion_of_invivo_frs: 0.4,
      vpm_pct: 0.55,
      additional_dimension_number: 1.03,
    },
  },
  {
    id: '2',
    simParams: {
      extracellular_calcium: 1.3,
      depol_stdev_mean_ratio: 0.7,
      desired_connected_proportion_of_invivo_frs: 0.4,
      vpm_pct: 0.55,
      additional_dimension_number: 1.03,
    },
  },
  {
    id: '3',
    simParams: {
      extracellular_calcium: 1.3,
      depol_stdev_mean_ratio: 0.7,
      desired_connected_proportion_of_invivo_frs: 0.4,
      vpm_pct: 0.55,
      additional_dimension_number: 1.03,
    },
  },
  {
    id: '4',
    simParams: {
      extracellular_calcium: 1.3,
      depol_stdev_mean_ratio: 0.7,
      desired_connected_proportion_of_invivo_frs: 0.4,
      vpm_pct: 0.55,
      additional_dimension_number: 1.03,
    },
  },
  {
    id: '5',
    simParams: {
      extracellular_calcium: 1.3,
      depol_stdev_mean_ratio: 0.7,
      desired_connected_proportion_of_invivo_frs: 0.4,
      vpm_pct: 0.55,
      additional_dimension_number: 1.03,
    },
  },
  {
    id: '6',
    simParams: {
      extracellular_calcium: 1.3,
      depol_stdev_mean_ratio: 0.7,
      desired_connected_proportion_of_invivo_frs: 0.4,
      vpm_pct: 0.55,
      additional_dimension_number: 1.03,
    },
  },
  {
    id: '7',
    simParams: {
      extracellular_calcium: 1.3,
      depol_stdev_mean_ratio: 0.7,
      desired_connected_proportion_of_invivo_frs: 0.4,
      vpm_pct: 0.55,
      additional_dimension_number: 1.03,
    },
  },
  {
    id: '8',
    simParams: {
      extracellular_calcium: 1.3,
      depol_stdev_mean_ratio: 0.7,
      desired_connected_proportion_of_invivo_frs: 0.4,
      vpm_pct: 0.55,
      additional_dimension_number: 1.03,
    },
  },
  {
    id: '9',
    simParams: {
      extracellular_calcium: 1.3,
      depol_stdev_mean_ratio: 0.7,
      desired_connected_proportion_of_invivo_frs: 0.4,
      vpm_pct: 0.55,
      additional_dimension_number: 1.03,
    },
  },
];

export const mockSimulationData: SimulationData = {
  stepCount: 600,
};

export const mockSimulationAnnotations: SimulationAnnotation[] = [
  { step: 0, text: 'Lorem ipsum' },
  { step: 34, text: 'Dolor sit amet' },
  { step: 225, text: 'Stimulus start', color: 'text-red-500' },
  { step: 245, text: 'Stimulus end', color: 'text-blue-500' },
  { step: 555, text: 'Some description' },
  { step: 600, text: 'End of the simulation' },
];

export const mockSimulationParams: ParameterKeyConfig[] = [
  {
    paramKey: 'desired_connected_proportion_of_invivo_frs',
    color: '#FF6969',
    minValue: 0,
    maxValue: 10,
  },
  { paramKey: 'depol_stdev_mean_ratio', color: '#00E9BF', minValue: 0, maxValue: 10 },
  { paramKey: 'extracellular_calcium', color: '#E037CF', minValue: 0, maxValue: 10 },
  { paramKey: 'vpm_pct', color: '#FFF740', minValue: 0, maxValue: 10 },
  { paramKey: 'additional_dimension_number', color: '#63BFF2', minValue: 0, maxValue: 10 },
];
