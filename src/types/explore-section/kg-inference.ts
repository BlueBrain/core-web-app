export interface RuleOuput {
  id: string;
  name: string;
  description: string;
  resourceType: string;
  inputParameters: InputParameter[];
  nexusLink: string;
}

export interface InputParameter {
  name: string;
  payload: Payload;
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
