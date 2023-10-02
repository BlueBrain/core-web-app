export interface RuleOutput {
  id: string;
  name: string;
  description: string;
  resourceType: string;
  inputParameters: InputParameter[];
  nexusLink: string;
  embeddingModels: Record<string, EmbeddingModel>;
}

type EmbeddingModel = {
  description: string;
  name: string;
  distance: string;
  id: string;
};

export interface InputFilter {
  TargetResourceParameter: string;
  SelectModelsParameter: string[];
  LimitQueryParameter?: number;
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
  displayName: string;
  name: string;
  id: string;
  value: boolean;
  description: string;
}

export type InferenceError = {
  detail: {
    loc: Array<number | string>;
    msg: string;
    type: string;
  }[];
};

export interface ResourceBasedInferenceRequest {
  rules: { id: string }[];
  inputFilter: InputFilter;
}

export type ResourceBasedInferenceResponse = Array<{
  id: string;
  results: ResourceBasedInference[];
}>;

export type InferredResource = Omit<
  ResourceBasedInference,
  'value' | 'description' | 'displayName'
>;
