export interface RuleOutput {
  id: string;
  name: string;
  description: string;
  resourceType: string;
  inputParameters: InputParameter[];
  nexusLink: string;
}

export interface InputFilter {
  TargetResourceParameter: string;
  SelectModelsParameter: string[];
}

export interface PayLoadValues {
  [key: string]: string;
}
export interface Payload {
  name: string;
  description: string;
  optional: boolean;
  default: any[] | null;
  type: string;
  values: PayLoadValues;
}

export interface InferenceOptionsState {
  [key: string]: boolean;
}
export interface RuleWithOptionsProps {
  [rule: string]: InferenceOptionsState;
}

export interface InputParameter {
  name: string;
  payload: Payload;
  values?: string[];
}
export interface ResourceBasedInference {
  name: string;
  id: string;
  value: boolean;
}
export interface ResourceBasedInferenceRequest {
  rules: string[];
  inputFilter: InputFilter;
}

export type InferredResource = Omit<ResourceBasedInference, 'value'>;
