export type SimulationParameterKey =
  | 'desired_connected_proportion_of_invivo_frs'
  | 'depol_stdev_mean_ratio'
  | 'vpm_pct'
  | 'extracellular_calcium'
  | 'additional_dimension_number';

export type SimulationParameterValues = Record<SimulationParameterKey, number>;

export interface SimulationPreviewElement {
  id: string;
  simParams: SimulationParameterValues;
  editParams?: SimulationParameterValues;
}

export interface ParameterKeyConfig {
  paramKey: SimulationParameterKey;
  color: string;
  minValue: number;
  maxValue: number;
}

export interface SimulationData {
  stepCount: number;
}

export interface SimulationAnnotation {
  step: number;
  text?: string;
  color?: string;
}

export interface ExperimentInteractiveContextType {
  addNewSimulation: () => void;
  canAddNewSimulation: boolean;
  startBulkEditing: () => void;
  applyBulkEditing: () => void;
  cancelBulkEditing: () => void;
  isBulkEditingMode: boolean;
  deleteSimulation: (index: number) => void;
  isViewSettingsPanelVisible: boolean;
  showViewSettingsPanel: () => void;
  hideViewSettingsPanel: () => void;
}

export interface SimulationPreviewContextType {
  index: number;
  simulationPreview: SimulationPreviewElement;
  applyChanges: () => void;
  cancelEditing: () => void;
  startEditing: () => void;
  deleteCurrentSimulation: () => void;
  isLoading: boolean;
  editedParamKey: SimulationParameterKey;
  setEditedParamKey: (value: SimulationParameterKey) => void;
}

export interface SimulationTimeRange {
  start: number;
  end: number;
}
