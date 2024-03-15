export type SimulateStep =
  | 'stimulation'
  | 'recording'
  | 'conditions'
  | 'analysis'
  | 'visualization';

// ------------------ Stimulation protocols types ------------------

export type StimulusType = 'current_clamp' | 'voltage_clamp' | 'conductance';

export type StimulusModule = 'hyperpolarizing' | 'noise_step' | 'seclamp';

export type StimulusTypeDropdownOptionType = {
  label: string;
  value: StimulusType;
};

export type StimulusModuleDropdownOptionType = {
  label: string;
  value: StimulusModule;
  usedBy: StimulusType[];
  description: string;
};

type FunctionParameter = {
  name: string;
  description: string;
  unit: string | null;
  disabled?: boolean;
  hidden?: boolean;
};

export type FunctionParameterNumber = FunctionParameter & {
  defaultValue: number;
  min: number;
  max: number;
  step: number;
};

export type StimulusParameter = Record<string, FunctionParameterNumber>;

export type ConditionalStimulusParamsTypes = Record<StimulusModule, StimulusParameter>;

export type StimulusDropdownInfo = {
  name: string;
  value: string;
};

export interface SimConfig {
  isFixedDt: boolean;
  celsius: number;
  dt: number | null;
  variableDt: boolean;
  tstop: number;
  hypamp: number;
  vinit: number;
  injectTo: string;
  recordFrom: string[];
  stimulus: StimulusConfig;
}

export type StimulusConfig = {
  stimulusType: StimulusType;
  stimulusProtocol: StimulusModule | null;
  stimulusProtocolInfo: StimulusModuleDropdownOptionType | null;
  stimulusProtocolOptions: StimulusModuleDropdownOptionType[];
  paramInfo: StimulusParameter;
  paramValues: Record<string, number | null>;
};

export type SimAction =
  | { type: 'CHANGE_TYPE'; payload: StimulusType }
  | { type: 'CHANGE_PROTOCOL'; payload: StimulusModule }
  | { type: 'CHANGE_STIM_PARAM'; payload: { key: string; value: number | null } }
  | { type: 'CHANGE_PARAM'; payload: { key: string; value: unknown } };